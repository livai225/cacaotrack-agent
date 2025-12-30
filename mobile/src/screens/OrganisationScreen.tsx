import React, { useState } from 'react';
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
import StepIndicator from '../components/StepIndicator';

const STEPS = [
  'Informations',
  'Président',
  'Secrétaire',
];

export default function OrganisationScreen({ navigation, route }: any) {
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Formulaire
  const [nom, setNom] = useState('');
  const [sigle, setSigle] = useState('');
  const [localite, setLocalite] = useState('');
  const [presidentNom, setPresidentNom] = useState('');
  const [presidentContact, setPresidentContact] = useState('');
  const [secretaireNom, setSecretaireNom] = useState('');
  const [secretaireContact, setSecretaireContact] = useState('');

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!nom.trim() || !sigle.trim() || !localite.trim()) {
          Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
          return false;
        }
        return true;
      case 2:
        // Président optionnel
        return true;
      case 3:
        // Secrétaire optionnel
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
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
        await apiService.createOrganisation(data);
        Alert.alert('Succès', 'Organisation créée avec succès', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Informations de l'Organisation</Title>

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
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Président</Title>

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

                <Text style={styles.optionalText}>
                  * Ces informations sont optionnelles
                </Text>
              </Card.Content>
            </Card>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Secrétaire</Title>

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

                <Text style={styles.optionalText}>
                  * Ces informations sont optionnelles
                </Text>
              </Card.Content>
            </Card>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StepIndicator
        currentStep={currentStep}
        totalSteps={STEPS.length}
        stepNames={STEPS}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <Button
            mode="outlined"
            onPress={handlePrevious}
            style={[styles.navButton, styles.prevButton]}
            icon="arrow-left"
          >
            Précédent
          </Button>
        )}
        <Button
          mode="contained"
          onPress={handleNext}
          loading={loading && currentStep === STEPS.length}
          disabled={loading}
          style={[styles.navButton, styles.nextButton]}
          buttonColor="#8B4513"
          icon={currentStep === STEPS.length ? "check" : "arrow-right"}
        >
          {currentStep === STEPS.length ? 'Créer' : 'Suivant'}
        </Button>
      </View>
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
  },
  stepContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  input: {
    marginTop: 12,
  },
  optionalText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  navButton: {
    flex: 1,
  },
  prevButton: {
    borderColor: '#8B4513',
  },
});

