import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Title, Card, List } from 'react-native-paper';
import { apiService } from '../services/api.service';
import { useSync } from '../contexts/SyncContext';

export default function SectionScreen({ navigation }: any) {
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showOrgList, setShowOrgList] = useState(false);
  
  // Formulaire
  const [nom, setNom] = useState('');
  const [localite, setLocalite] = useState('');
  const [responsableNom, setResponsableNom] = useState('');
  const [responsableContact, setResponsableContact] = useState('');

  useEffect(() => {
    loadOrganisations();
  }, []);

  const loadOrganisations = async () => {
    try {
      const data = await apiService.getOrganisations();
      setOrganisations(data);
    } catch (error) {
      console.error('Erreur chargement organisations:', error);
    }
  };

  const handleSubmit = async () => {
    if (!nom || !selectedOrg) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    const data = {
      nom,
      localite,
      id_organisation: selectedOrg.id,
      responsable_nom: responsableNom,
      responsable_contact: responsableContact,
    };

    setLoading(true);
    try {
      if (isOnline) {
        await apiService.createSection(data);
        Alert.alert('Succès', 'Section créée avec succès', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await savePending('section', data);
        Alert.alert(
          'Hors ligne',
          'Section sauvegardée pour synchronisation.',
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
            <Title>Sélectionner l'Organisation</Title>
            
            <Button
              mode="outlined"
              onPress={() => setShowOrgList(!showOrgList)}
              style={styles.selectButton}
            >
              {selectedOrg ? selectedOrg.nom : 'Choisir une organisation'}
            </Button>

            {showOrgList && (
              <View style={styles.listContainer}>
                {organisations.map((org) => (
                  <List.Item
                    key={org.id}
                    title={org.nom}
                    description={org.sigle}
                    onPress={() => {
                      setSelectedOrg(org);
                      setShowOrgList(false);
                    }}
                    left={props => <List.Icon {...props} icon="domain" />}
                  />
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations de la Section</Title>

            <TextInput
              label="Nom de la section *"
              value={nom}
              onChangeText={setNom}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Localité"
              value={localite}
              onChangeText={setLocalite}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Nom du responsable"
              value={responsableNom}
              onChangeText={setResponsableNom}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Contact du responsable"
              value={responsableContact}
              onChangeText={setResponsableContact}
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
          Créer la Section
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
  submitButton: {
    marginTop: 16,
    marginBottom: 40,
    paddingVertical: 8,
  },
});
