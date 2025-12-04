import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import { apiService } from '../services/api.service';
import { useSync } from '../contexts/SyncContext';

export default function OrganisationScreen({ navigation, route }: any) {
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  
  // Formulaire
  const [nom, setNom] = useState('');
  const [sigle, setSigle] = useState('');
  const [localite, setLocalite] = useState('');
  const [presidentNom, setPresidentNom] = useState('');
  const [presidentContact, setPresidentContact] = useState('');
  const [secretaireNom, setSecretaireNom] = useState('');
  const [secretaireContact, setSecretaireContact] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!nom || !sigle || !localite) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    const data = {
      nom,
      sigle,
      localite,
      president_nom: presidentNom,
      president_contact: presidentContact,
      secretaire_nom: secretaireNom,
      secretaire_contact: secretaireContact,
    };

    setLoading(true);
    try {
      if (isOnline) {
        // Envoyer directement
        await apiService.createOrganisation(data);
        Alert.alert('Succès', 'Organisation créée avec succès', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Sauvegarder pour synchronisation
        await savePending('organisation', data);
        Alert.alert(
          'Hors ligne',
          'Organisation sauvegardée. Elle sera synchronisée quand la connexion reviendra.',
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
            <Title>Informations de l'Organisation</Title>

            <TextInput
              label="Nom de l'organisation *"
              value={nom}
              onChangeText={setNom}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Sigle *"
              value={sigle}
              onChangeText={setSigle}
              mode="outlined"
              style={styles.input}
              autoCapitalize="characters"
            />

            <TextInput
              label="Localité *"
              value={localite}
              onChangeText={setLocalite}
              mode="outlined"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Président</Title>

            <TextInput
              label="Nom du président"
              value={presidentNom}
              onChangeText={setPresidentNom}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Contact du président"
              value={presidentContact}
              onChangeText={setPresidentContact}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Secrétaire</Title>

            <TextInput
              label="Nom du secrétaire"
              value={secretaireNom}
              onChangeText={setSecretaireNom}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Contact du secrétaire"
              value={secretaireContact}
              onChangeText={setSecretaireContact}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
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
          Créer l'Organisation
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
  input: {
    marginTop: 12,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 40,
    paddingVertical: 8,
  },
});
