import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Text, Card, FAB } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';

interface Point {
  latitude: number;
  longitude: number;
}

export default function ParcelleMapScreen({ navigation, route }: any) {
  const [points, setPoints] = useState<Point[]>([]);
  const [isMapping, setIsMapping] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Point | null>(null);
  const [region, setRegion] = useState({
    latitude: 5.3599517, // Abidjan par défaut
    longitude: -4.0082563,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    // Obtenir la position initiale
    getCurrentPosition();

    // Suivre la position en temps réel
    const watchId = Geolocation.watchPosition(
      (position) => {
        const newPos = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentPosition(newPos);

        // Ajouter automatiquement des points pendant le mapping
        if (isMapping) {
          addPoint(newPos);
        }
      },
      (error) => console.error('Erreur GPS:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 5, // Ajouter un point tous les 5 mètres
        interval: 1000,
        fastestInterval: 500,
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [isMapping]);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentPosition(pos);
        setRegion({
          ...pos,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      (error) => {
        Alert.alert('Erreur GPS', 'Impossible d\'obtenir votre position');
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const addPoint = (point: Point) => {
    setPoints((prev) => {
      // Éviter les doublons trop proches
      const lastPoint = prev[prev.length - 1];
      if (lastPoint) {
        const distance = getDistance(lastPoint, point);
        if (distance < 5) return prev; // Ignorer si < 5 mètres
      }
      return [...prev, point];
    });
  };

  const getDistance = (p1: Point, p2: Point): number => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = (p1.latitude * Math.PI) / 180;
    const φ2 = (p2.latitude * Math.PI) / 180;
    const Δφ = ((p2.latitude - p1.latitude) * Math.PI) / 180;
    const Δλ = ((p2.longitude - p1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateArea = (): number => {
    if (points.length < 3) return 0;

    // Algorithme Shoelace pour calculer l'aire d'un polygone
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    area = Math.abs(area) / 2;

    // Convertir en hectares (approximation)
    // 1 degré ≈ 111.32 km à l'équateur
    const areaInSquareMeters = area * 111320 * 111320;
    const hectares = areaInSquareMeters / 10000;

    return hectares;
  };

  const calculatePerimeter = (): number => {
    if (points.length < 2) return 0;

    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      perimeter += getDistance(points[i], points[j]);
    }

    return perimeter;
  };

  const handleStartMapping = () => {
    if (!currentPosition) {
      Alert.alert('Erreur', 'Position GPS non disponible');
      return;
    }
    setIsMapping(true);
    setPoints([currentPosition]); // Commencer avec la position actuelle
    Alert.alert(
      'Mapping démarré',
      'Marchez autour de la parcelle. Des points seront ajoutés automatiquement.'
    );
  };

  const handlePauseMapping = () => {
    setIsMapping(false);
    Alert.alert('Mapping en pause', 'Vous pouvez reprendre ou terminer.');
  };

  const handleClearPoints = () => {
    Alert.alert(
      'Effacer les points',
      'Voulez-vous vraiment effacer tous les points ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: () => {
            setPoints([]);
            setIsMapping(false);
          },
        },
      ]
    );
  };

  const handleFinishMapping = () => {
    if (points.length < 3) {
      Alert.alert('Erreur', 'Il faut au moins 3 points pour créer une parcelle');
      return;
    }

    const area = calculateArea();
    const perimeter = calculatePerimeter();

    Alert.alert(
      'Mapping terminé',
      `Superficie: ${area.toFixed(2)} ha\nPérimètre: ${perimeter.toFixed(0)} m`,
      [
        { text: 'Modifier', style: 'cancel' },
        {
          text: 'Enregistrer',
          onPress: () => {
            navigation.navigate('Parcelle', {
              polygone_gps: JSON.stringify(points),
              superficie_gps: parseFloat(area.toFixed(2)),
              perimetre: parseFloat(perimeter.toFixed(0)),
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Position actuelle */}
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            title="Ma position"
            pinColor="blue"
          />
        )}

        {/* Points enregistrés */}
        {points.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            title={`Point ${index + 1}`}
            pinColor="red"
          />
        ))}

        {/* Polygone */}
        {points.length > 2 && (
          <Polygon
            coordinates={points}
            strokeColor="#8B4513"
            fillColor="rgba(139, 69, 19, 0.3)"
            strokeWidth={2}
          />
        )}
      </MapView>

      {/* Panneau d'informations */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoText}>
            Points enregistrés: <Text style={styles.bold}>{points.length}</Text>
          </Text>
          {points.length > 2 && (
            <>
              <Text style={styles.infoText}>
                Superficie: <Text style={styles.bold}>{calculateArea().toFixed(2)} ha</Text>
              </Text>
              <Text style={styles.infoText}>
                Périmètre: <Text style={styles.bold}>{calculatePerimeter().toFixed(0)} m</Text>
              </Text>
            </>
          )}
          <Text style={[styles.infoText, isMapping && styles.mappingActive]}>
            {isMapping ? '🟢 Mapping en cours...' : '⚪ Mapping en pause'}
          </Text>
        </Card.Content>
      </Card>

      {/* Boutons d'action */}
      <View style={styles.controls}>
        {!isMapping ? (
          <Button
            mode="contained"
            icon="play"
            onPress={handleStartMapping}
            style={styles.button}
            buttonColor="#4CAF50"
          >
            {points.length === 0 ? 'Démarrer le Mapping' : 'Reprendre'}
          </Button>
        ) : (
          <Button
            mode="contained"
            icon="pause"
            onPress={handlePauseMapping}
            style={styles.button}
            buttonColor="#FF9800"
          >
            Pause
          </Button>
        )}

        {points.length > 0 && (
          <>
            <Button
              mode="outlined"
              icon="delete"
              onPress={handleClearPoints}
              style={styles.button}
              textColor="#F44336"
            >
              Effacer
            </Button>

            {points.length > 2 && (
              <Button
                mode="contained"
                icon="check"
                onPress={handleFinishMapping}
                style={styles.button}
                buttonColor="#8B4513"
              >
                Terminer et Enregistrer
              </Button>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoCard: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    elevation: 4,
  },
  infoText: {
    fontSize: 14,
    marginVertical: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: '#8B4513',
  },
  mappingActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  button: {
    marginTop: 8,
  },
});
