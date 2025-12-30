import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Title, Card, List, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { apiService } from '../services/api.service';
import { useSync } from '../contexts/SyncContext';
import StepIndicator from '../components/StepIndicator';

const STEPS = [
  'Rattachement',
  'Informations Générales',
  'Photo',
  'Famille',
];

export default function ProducteurScreen({ navigation }: any) {
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Données
  const [villages, setVillages] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [organisations, setOrganisations] = useState<any[]>([]);
  
  // Sélections
  const [selectedOrganisation, setSelectedOrganisation] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [selectedVillage, setSelectedVillage] = useState<any>(null);
  const [showOrgList, setShowOrgList] = useState(false);
  const [showSectionList, setShowSectionList] = useState(false);
  const [showVillageList, setShowVillageList] = useState(false);
  
  // Formulaire
  const [nomComplet, setNomComplet] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [lieuNaissance, setLieuNaissance] = useState('');
  const [sexe, setSexe] = useState('');
  const [telephone, setTelephone] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [situationMatrimoniale, setSituationMatrimoniale] = useState('');
  const [nbEnfants, setNbEnfants] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filtrer sections par organisation
    if (selectedOrganisation) {
      const filtered = sections.filter(s => s.id_organisation === selectedOrganisation.id);
      if (filtered.length > 0 && !filtered.find(s => s.id === selectedSection?.id)) {
        setSelectedSection(null);
      }
    }
  }, [selectedOrganisation, sections]);

  useEffect(() => {
    // Filtrer villages par section
    if (selectedSection) {
      const filtered = villages.filter(v => v.id_section === selectedSection.id);
      if (filtered.length > 0 && !filtered.find(v => v.id === selectedVillage?.id)) {
        setSelectedVillage(null);
      }
    }
  }, [selectedSection, villages]);

  const loadData = async () => {
    try {
      const [orgs, secs, vills] = await Promise.all([
        apiService.getOrganisations(),
        apiService.getSections(),
        apiService.getVillages(),
      ]);
      setOrganisations(orgs);
      setSections(secs);
      setVillages(vills);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  const handleTakePhoto = () => {
    Alert.alert(
      'Photo du Producteur',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: () => {
            launchCamera(
              {
                mediaType: 'photo',
                quality: 0.7,
                includeBase64: true,
              },
              (response) => {
                if (response.assets && response.assets[0].base64) {
                  setPhoto(`data:image/jpeg;base64,${response.assets[0].base64}`);
                }
              }
            );
          },
        },
        {
          text: 'Choisir dans la galerie',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                quality: 0.7,
                includeBase64: true,
              },
              (response) => {
                if (response.assets && response.assets[0].base64) {
                  setPhoto(`data:image/jpeg;base64,${response.assets[0].base64}`);
                }
              }
            );
          },
        },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!selectedOrganisation || !selectedSection || !selectedVillage) {
          Alert.alert('Erreur', 'Veuillez sélectionner l\'organisation, la section et le village');
          return false;
        }
        return true;
      case 2:
        if (!nomComplet.trim()) {
          Alert.alert('Erreur', 'Le nom complet est obligatoire');
          return false;
        }
        return true;
      case 3:
        // Photo optionnelle
        return true;
      case 4:
        // Famille optionnelle
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
      id_organisation: selectedOrganisation?.id,
      id_section: selectedSection?.id,
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Organisation *</Title>
                <Button
                  mode="outlined"
                  onPress={() => setShowOrgList(!showOrgList)}
                  style={styles.selectButton}
                >
                  {selectedOrganisation ? selectedOrganisation.nom : 'Choisir une organisation'}
                </Button>
                {showOrgList && (
                  <View style={styles.listContainer}>
                    {organisations.filter(o => o.statut === 'actif').map((org) => (
                      <List.Item
                        key={org.id}
                        title={org.nom}
                        description={org.code}
                        onPress={() => {
                          setSelectedOrganisation(org);
                          setShowOrgList(false);
                        }}
                        left={(props: any) => <List.Icon {...props} icon="domain" />}
                      />
                    ))}
                  </View>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Section *</Title>
                <Button
                  mode="outlined"
                  onPress={() => setShowSectionList(!showSectionList)}
                  style={styles.selectButton}
                  disabled={!selectedOrganisation}
                >
                  {selectedSection ? selectedSection.nom : 'Choisir une section'}
                </Button>
                {showSectionList && selectedOrganisation && (
                  <View style={styles.listContainer}>
                    {sections
                      .filter(s => s.id_organisation === selectedOrganisation.id)
                      .map((sec) => (
                        <List.Item
                          key={sec.id}
                          title={sec.nom}
                          description={sec.code}
                          onPress={() => {
                            setSelectedSection(sec);
                            setShowSectionList(false);
                          }}
                          left={(props: any) => <List.Icon {...props} icon="map-marker" />}
                        />
                      ))}
                  </View>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Village *</Title>
                <Button
                  mode="outlined"
                  onPress={() => setShowVillageList(!showVillageList)}
                  style={styles.selectButton}
                  disabled={!selectedSection}
                >
                  {selectedVillage ? selectedVillage.nom : 'Choisir un village'}
                </Button>
                {showVillageList && selectedSection && (
                  <View style={styles.listContainer}>
                    {villages
                      .filter(v => v.id_section === selectedSection.id)
                      .map((village) => (
                        <List.Item
                          key={village.id}
                          title={village.nom}
                          description={village.type}
                          onPress={() => {
                            setSelectedVillage(village);
                            setShowVillageList(false);
                          }}
                          left={(props: any) => <List.Icon {...props} icon="home" />}
                        />
                      ))}
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Informations Générales</Title>

                <TextInput
                  label="Nom complet *"
                  value={nomComplet}
                  onChangeText={setNomComplet}
                  mode="outlined"
                  style={styles.input}
                  autoCapitalize="words"
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

                <View style={styles.row}>
                  <TextInput
                    label="Sexe (M/F)"
                    value={sexe}
                    onChangeText={setSexe}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                    autoCapitalize="characters"
                    maxLength={1}
                  />

                  <TextInput
                    label="Téléphone"
                    value={telephone}
                    onChangeText={setTelephone}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                    keyboardType="phone-pad"
                  />
                </View>
              </Card.Content>
            </Card>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Photo du Producteur</Title>
                
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

                <Text style={styles.optionalText}>
                  * La photo est optionnelle
                </Text>
              </Card.Content>
            </Card>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Composition Familiale</Title>

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

      {/* Boutons de navigation */}
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
          {currentStep === STEPS.length ? 'Enregistrer' : 'Suivant'}
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
  selectButton: {
    marginTop: 8,
  },
  listContainer: {
    marginTop: 8,
    maxHeight: 300,
  },
  input: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  halfInput: {
    flex: 1,
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
  nextButton: {
    // Styles pour le bouton suivant
  },
});
