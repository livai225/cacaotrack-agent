import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Text, Card, FAB, List } from 'react-native-paper';
import * as Location from 'expo-location';

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
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission GPS refusée', 'Veuillez autoriser l\'accès à la localisation');
          return;
        }

        // Position initiale
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        const pos = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentPosition(pos);
        setRegion({
          ...pos,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Suivi en temps réel
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5, // Ajouter un point tous les 5 mètres
          },
          (location) => {
            const newPos = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setCurrentPosition(newPos);

            // Ajouter automatiquement des points pendant le mapping
            if (isMapping) {
              addPoint(newPos);
            }
          }
        );
      } catch (error) {
        console.error('Erreur GPS:', error);
        Alert.alert('Erreur GPS', 'Impossible d\'obtenir votre position');
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isMapping]);

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
      <ScrollView style={styles.scrollView}>
        {/* Panneau d'informations */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>📍 Mapping GPS de la Parcelle</Text>
            
            <Text style={styles.infoText}>
              Points enregistrés: <Text style={styles.bold}>{points.length}</Text>
            </Text>
            
            {currentPosition && (
              <Text style={styles.infoText}>
                Position actuelle: {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
              </Text>
            )}
            
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

        {/* Liste des points */}
        {points.length > 0 && (
          <Card style={styles.pointsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.subtitle}>Points GPS enregistrés</Text>
              {points.map((point, index) => (
                <List.Item
                  key={index}
                  title={`Point ${index + 1}`}
                  description={`Lat: ${point.latitude.toFixed(6)}, Lon: ${point.longitude.toFixed(6)}`}
                  left={props => <List.Icon {...props} icon="map-marker" color="#8B4513" />}
                />
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  infoCard: {
    margin: 16,
    elevation: 4,
  },
  title: {
    marginBottom: 12,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 8,
    color: '#8B4513',
  },
  pointsCard: {
    margin: 16,
    marginTop: 0,
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
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    marginTop: 8,
  },
});
