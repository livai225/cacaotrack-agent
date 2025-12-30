import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Text, Card, FAB } from 'react-native-paper';
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
    // Obtenir la position initiale
    getCurrentPosition();
  }, []);

  const getCurrentPosition = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La permission de localisation est nécessaire');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newPos = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentPosition(newPos);
      setRegion({
        ...region,
        latitude: newPos.latitude,
        longitude: newPos.longitude,
      });
    } catch (error) {
      console.error('Erreur GPS:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir la position GPS');
    }
  };

  const handleMapPress = (event: any) => {
    if (isMapping) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setPoints([...points, { latitude, longitude }]);
    }
  };

  const startMapping = () => {
    if (!currentPosition) {
      Alert.alert('Erreur', 'Position GPS non disponible');
      return;
    }
    setIsMapping(true);
    setPoints([]);
  };

  const stopMapping = () => {
    setIsMapping(false);
  };

  const clearPoints = () => {
    setPoints([]);
  };

  const saveMapping = () => {
    if (points.length < 3) {
      Alert.alert('Erreur', 'Au moins 3 points sont nécessaires pour créer une parcelle');
      return;
    }

    // Retourner les points à l'écran précédent
    navigation.navigate({
      name: route.params?.returnScreen || 'Parcelle',
      params: {
        points_gps: points,
        superficie_calculee: calculateArea(points),
      },
      merge: true,
    });
  };

  const calculateArea = (pts: Point[]): number => {
    // Calcul simplifié de la superficie (formule de Shoelace)
    if (pts.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      area += pts[i].latitude * pts[j].longitude;
      area -= pts[j].latitude * pts[i].longitude;
    }
    area = Math.abs(area) / 2;
    
    // Convertir en hectares (approximation)
    return area * 111.32 * 111.32 / 10000;
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Cartographie GPS</Text>
          <Text style={styles.subtitle}>
            {isMapping ? 'Mode cartographie actif' : 'Prêt à cartographier'}
          </Text>
          
          {currentPosition && (
            <View style={styles.positionInfo}>
              <Text style={styles.positionText}>
                Position: {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          {points.length > 0 && (
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsText}>
                {points.length} point{points.length > 1 ? 's' : ''} enregistré{points.length > 1 ? 's' : ''}
              </Text>
              {points.length >= 3 && (
                <Text style={styles.areaText}>
                  Superficie estimée: {calculateArea(points).toFixed(2)} ha
                </Text>
              )}
            </View>
          )}

          <ScrollView style={styles.pointsList}>
            {points.map((point, index) => (
              <View key={index} style={styles.pointItem}>
                <Text style={styles.pointText}>
                  Point {index + 1}: {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            {!isMapping ? (
              <Button
                mode="contained"
                onPress={startMapping}
                style={styles.button}
                disabled={!currentPosition}
              >
                Démarrer la cartographie
              </Button>
            ) : (
              <>
                <Button
                  mode="contained"
                  onPress={stopMapping}
                  style={styles.button}
                >
                  Arrêter
                </Button>
                <Button
                  mode="outlined"
                  onPress={clearPoints}
                  style={styles.button}
                >
                  Effacer
                </Button>
              </>
            )}
            
            {points.length >= 3 && (
              <Button
                mode="contained"
                onPress={saveMapping}
                style={[styles.button, styles.saveButton]}
              >
                Enregistrer ({points.length} points)
              </Button>
            )}
          </View>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Retour
          </Button>
        </Card.Content>
      </Card>

      <FAB
        icon="crosshairs-gps"
        style={styles.fab}
        onPress={getCurrentPosition}
        label="GPS"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  positionInfo: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  positionText: {
    fontSize: 14,
    color: '#1976d2',
  },
  pointsInfo: {
    backgroundColor: '#f3e5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  pointsText: {
    fontSize: 14,
    color: '#7b1fa2',
    fontWeight: 'bold',
  },
  areaText: {
    fontSize: 14,
    color: '#7b1fa2',
    marginTop: 4,
  },
  pointsList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  pointItem: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  pointText: {
    fontSize: 12,
    color: '#333',
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#4caf50',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#8B4513',
  },
});
