import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Title, Card, List, Text } from 'react-native-paper';
import * as Location from 'expo-location';
import { apiService } from '../services/api.service';
import { useSync } from '../contexts/SyncContext';

export default function VillageScreen({ navigation }: any) {
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [showSectionList, setShowSectionList] = useState(false);
  
  // Formulaire
  const [nom, setNom] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await apiService.getSections();
      setSections(data);
    } catch (error) {
      console.error('Erreur chargement sections:', error);
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setGettingLocation(false);
        Alert.alert('Succès', 'Position GPS enregistrée');
      },
      (error) => {
        setGettingLocation(false);
        Alert.alert('Erreur GPS', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!nom || !selectedSection) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    const data = {
      nom,
      id_section: selectedSection.id,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
    };

    setLoading(true);
    try {
      if (isOnline) {
        await apiService.createVillage(data);
        Alert.alert('Succès', 'Village créé avec succès', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await savePending('village', data);
        Alert.alert(
          'Hors ligne',
          'Village sauvegardé pour synchronisation.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scroll}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Sélectionner la Section</Title>
            
            <Button
              mode="outlined"
              onPress={() => setShowSectionList(!showSectionList)}
              style={styles.selectButton}
            >
              {selectedSection ? selectedSection.nom : 'Choisir une section'}
            </Button>

            {showSectionList && (
              <View style={styles.listContainer}>
                {sections.map((section) => (
                  <List.Item
                    key={section.id}
                    title={section.nom}
                    description={section.organisation?.nom}
                    onPress={() => {
                      setSelectedSection(section);
                      setShowSectionList(false);
                    }}
                    left={(props: any) => <List.Icon {...props} icon="map-marker-radius" />}
                  />
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations du Village</Title>

            <TextInput
              label="Nom du village *"
              value={nom}
              onChangeText={setNom}
              mode="outlined"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Géolocalisation</Title>
            
            <Button
              mode="contained"
              icon="crosshairs-gps"
              onPress={getCurrentLocation}
              loading={gettingLocation}
              disabled={gettingLocation}
              style={styles.gpsButton}
              buttonColor="#4CAF50"
            >
              {gettingLocation ? 'Localisation...' : 'Obtenir ma position GPS'}
            </Button>

            {latitude && longitude && (
              <View style={styles.coordsContainer}>
                <Text style={styles.coordsLabel}>📍 Position enregistrée:</Text>
                <Text style={styles.coords}>Latitude: {latitude}</Text>
                <Text style={styles.coords}>Longitude: {longitude}</Text>
              </View>
            )}

            <TextInput
              label="Latitude"
              value={latitude}
              onChangeText={setLatitude}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Longitude"
              value={longitude}
              onChangeText={setLongitude}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          buttonColor="#8B4513"
        >
          Créer le Village
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  selectButton: {
    marginTop: 12,
  },
  listContainer: {
    marginTop: 8,
    maxHeight: 300,
  },
  input: {
    marginTop: 12,
  },
  gpsButton: {
    marginTop: 12,
  },
  coordsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  coordsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  coords: {
    fontSize: 12,
    color: '#666',
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

