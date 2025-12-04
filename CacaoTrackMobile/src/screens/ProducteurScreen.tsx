import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { TextInput, Button, Title, Card, List } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { apiService } from '../services/api.service';
import { useSync } from '../contexts/SyncContext';

export default function ProducteurScreen({ navigation }: any) {
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  const [villages, setVillages] = useState<any[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<any>(null);
  const [showVillageList, setShowVillageList] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  
  // Formulaire
  const [nomComplet, setNomComplet] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [lieuNaissance, setLieuNaissance] = useState('');
  const [sexe, setSexe] = useState('');
  const [telephone, setTelephone] = useState('');
  const [situationMatrimoniale, setSituationMatrimoniale] = useState('');
  const [nbEnfants, setNbEnfants] = useState('');

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      const data = await apiService.getVillages();
      setVillages(data);
    } catch (error) {
      console.error('Erreur chargement villages:', error);
    }
  };

  const handleTakePhoto = () => {
    Alert.alert(
      'Photo du Producteur',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission refusée', 'Veuillez autoriser l\'accès à la caméra');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.7,
              base64: true,
              allowsEditing: true,
              aspect: [4, 3],
            });

            if (!result.canceled && result.assets[0].base64) {
              setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
            }
          },
        },
        {
          text: 'Choisir dans la galerie',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission refusée', 'Veuillez autoriser l\'accès à la galerie');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.7,
              base64: true,
              allowsEditing: true,
              aspect: [4, 3],
            });

            if (!result.canceled && result.assets[0].base64) {
              setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
            }
          },
        },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!nomComplet || !selectedVillage) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    const data = {
      nom_complet: nomComplet,
      date_naissance: dateNaissance || null,
      lieu_naissance: lieuNaissance || null,
      sexe: sexe || null,
      telephone: telephone || null,
      situation_matrimoniale: situationMatrimoniale || null,
      nb_enfants: nbEnfants ? parseInt(nbEnfants) : 0,
      id_village: selectedVillage.id,
      photo: photo || null,
    };

    setLoading(true);
    try {
      if (isOnline) {
        await apiService.createProducteur(data);
        Alert.alert('Succès', 'Producteur enregistré avec succès', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await savePending('producteur', data);
        Alert.alert(
          'Hors ligne',
          'Producteur sauvegardé pour synchronisation.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'enregistrement');
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
        {/* Photo */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Photo du Producteur</Title>
            
            {photo && (
              <Image source={{ uri: photo }} style={styles.photo} />
            )}

            <Button
              mode="contained"
              icon="camera"
              onPress={handleTakePhoto}
              style={styles.photoButton}
              buttonColor="#4CAF50"
            >
              {photo ? 'Changer la photo' : 'Prendre une photo'}
            </Button>
          </Card.Content>
        </Card>

        {/* Village */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Sélectionner le Village</Title>
            
            <Button
              mode="outlined"
              onPress={() => setShowVillageList(!showVillageList)}
              style={styles.selectButton}
            >
              {selectedVillage ? selectedVillage.nom : 'Choisir un village'}
            </Button>

            {showVillageList && (
              <View style={styles.listContainer}>
                {villages.map((village) => (
                  <List.Item
                    key={village.id}
                    title={village.nom}
                    description={village.section?.nom}
                    onPress={() => {
                      setSelectedVillage(village);
                      setShowVillageList(false);
                    }}
                    left={(props: any) => <List.Icon {...props} icon="map-marker" />}
                  />
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Informations personnelles */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations Personnelles</Title>

            <TextInput
              label="Nom complet *"
              value={nomComplet}
              onChangeText={setNomComplet}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Date de naissance (JJ/MM/AAAA)"
              value={dateNaissance}
              onChangeText={setDateNaissance}
              mode="outlined"
              style={styles.input}
              placeholder="01/01/1980"
            />

            <TextInput
              label="Lieu de naissance"
              value={lieuNaissance}
              onChangeText={setLieuNaissance}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Sexe (M/F)"
              value={sexe}
              onChangeText={setSexe}
              mode="outlined"
              style={styles.input}
              autoCapitalize="characters"
              maxLength={1}
            />

            <TextInput
              label="Téléphone"
              value={telephone}
              onChangeText={setTelephone}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TextInput
              label="Situation matrimoniale"
              value={situationMatrimoniale}
              onChangeText={setSituationMatrimoniale}
              mode="outlined"
              style={styles.input}
              placeholder="Marié(e), Célibataire, etc."
            />

            <TextInput
              label="Nombre d'enfants"
              value={nbEnfants}
              onChangeText={setNbEnfants}
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
          Enregistrer le Producteur
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
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 12,
  },
  photoButton: {
    marginTop: 8,
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
  submitButton: {
    marginTop: 16,
    marginBottom: 40,
    paddingVertical: 8,
  },
});
