import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
} from 'react-native';
import { TextInput, Button, Title, Card, List } from 'react-native-paper';
import { apiService } from '../services/api.service';
import { useSync } from '../contexts/SyncContext';
import { useAuth } from '../contexts/AuthContext';
import StepIndicator from '../components/StepIndicator';

const STEPS = [
  'Sélection',
  'Quantités',
  'Signature',
];

export default function CollecteScreen({ navigation, route }: any) {
  const { agent } = useAuth();
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Listes
  const [villages, setVillages] = useState<any[]>([]);
  const [producteurs, setProducteurs] = useState<any[]>([]);
  const [parcelles, setParcelles] = useState<any[]>([]);
  
  // Sélections
  const [selectedVillage, setSelectedVillage] = useState<any>(null);
  const [selectedProducteur, setSelectedProducteur] = useState<any>(null);
  const [selectedParcelle, setSelectedParcelle] = useState<any>(null);
  
  // Affichage listes
  const [showVillageList, setShowVillageList] = useState(false);
  const [showProducteurList, setShowProducteurList] = useState(false);
  const [showParcelleList, setShowParcelleList] = useState(false);
  
  // Signature
  const [signature, setSignature] = useState(route.params?.signature_producteur || '');
  
  // Formulaire
  const [campagne, setCampagne] = useState('2024-2025');
  const [quantiteCabosses, setQuantiteCabosses] = useState('');
  const [poidsEstimatif, setPoidsEstimatif] = useState('');
  const [nbSacs, setNbSacs] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (route.params?.signature_producteur) {
      setSignature(route.params.signature_producteur);
    }
  }, [route.params]);

  useEffect(() => {
    // Filtrer producteurs par village
    if (selectedVillage) {
      const filtered = producteurs.filter(p => p.id_village === selectedVillage.id);
      if (filtered.length > 0 && !filtered.find(p => p.id === selectedProducteur?.id)) {
        setSelectedProducteur(null);
        setSelectedParcelle(null);
      }
    }
  }, [selectedVillage, producteurs]);

  useEffect(() => {
    // Filtrer parcelles par producteur
    if (selectedProducteur) {
      const filtered = parcelles.filter(p => p.id_producteur === selectedProducteur.id);
      if (filtered.length > 0 && !filtered.find(p => p.id === selectedParcelle?.id)) {
        setSelectedParcelle(null);
      }
    }
  }, [selectedProducteur, parcelles]);

  const loadData = async () => {
    try {
      const [villagesData, producteursData, parcellesData] = await Promise.all([
        apiService.getVillages(),
        apiService.getProducteurs(),
        apiService.getParcelles(),
      ]);
      setVillages(villagesData);
      setProducteurs(producteursData);
      setParcelles(parcellesData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  const handleGoToSignature = () => {
    navigation.navigate('Signature', {
      returnScreen: 'Collecte',
      producteurNom: selectedProducteur?.nom_complet,
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!selectedVillage || !selectedProducteur || !selectedParcelle) {
          Alert.alert('Erreur', 'Veuillez sélectionner le village, le producteur et la parcelle');
          return false;
        }
        return true;
      case 2:
        // Quantités optionnelles
        return true;
      case 3:
        // Signature optionnelle
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
    if (!selectedVillage || !selectedProducteur || !selectedParcelle) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const data = {
      id_village: selectedVillage.id,
      id_producteur: selectedProducteur.id,
      id_parcelle: selectedParcelle.id,
      id_agent: agent?.id,
      statut: 'Brouillon',
      campagne,
      quantite_cabosses: quantiteCabosses ? parseInt(quantiteCabosses) : null,
      poids_estimatif: poidsEstimatif ? parseFloat(poidsEstimatif) : null,
      nb_sacs_brousse: nbSacs ? parseInt(nbSacs) : 0,
      signature_producteur: signature || null,
      date_signature: signature ? new Date().toISOString() : null,
    };

    setLoading(true);
    try {
      if (isOnline) {
        await apiService.createOperation(data);
        Alert.alert('Succès', 'Collecte créée avec succès', [
          { text: 'OK', onPress: () => navigation.navigate('MainTabs') }
        ]);
      } else {
        await savePending('operation', data);
        Alert.alert(
          'Hors ligne',
          'Collecte sauvegardée pour synchronisation.',
          [{ text: 'OK', onPress: () => navigation.navigate('MainTabs') }]
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
                <Title style={styles.cardTitle}>Village *</Title>
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

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Producteur *</Title>
                <Button
                  mode="outlined"
                  onPress={() => setShowProducteurList(!showProducteurList)}
                  style={styles.selectButton}
                  disabled={!selectedVillage}
                >
                  {selectedProducteur ? selectedProducteur.nom_complet : 'Choisir un producteur'}
                </Button>
                {showProducteurList && selectedVillage && (
                  <View style={styles.listContainer}>
                    {producteurs
                      .filter(p => p.id_village === selectedVillage.id)
                      .map((prod) => (
                        <List.Item
                          key={prod.id}
                          title={prod.nom_complet}
                          description={prod.village?.nom}
                          onPress={() => {
                            setSelectedProducteur(prod);
                            setShowProducteurList(false);
                          }}
                          left={(props: any) => <List.Icon {...props} icon="account" />}
                        />
                      ))}
                  </View>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Parcelle *</Title>
                <Button
                  mode="outlined"
                  onPress={() => setShowParcelleList(!showParcelleList)}
                  style={styles.selectButton}
                  disabled={!selectedProducteur}
                >
                  {selectedParcelle ? selectedParcelle.code : 'Choisir une parcelle'}
                </Button>
                {showParcelleList && selectedProducteur && (
                  <View style={styles.listContainer}>
                    {parcelles
                      .filter(p => p.id_producteur === selectedProducteur.id)
                      .map((parcelle) => (
                        <List.Item
                          key={parcelle.id}
                          title={parcelle.code}
                          description={`${parcelle.producteur?.nom_complet} - ${parcelle.superficie_declaree} ha`}
                          onPress={() => {
                            setSelectedParcelle(parcelle);
                            setShowParcelleList(false);
                          }}
                          left={(props: any) => <List.Icon {...props} icon="map" />}
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
                <Title style={styles.cardTitle}>Informations de la Collecte</Title>

                <TextInput
                  label="Campagne"
                  value={campagne}
                  onChangeText={setCampagne}
                  mode="outlined"
                  style={styles.input}
                />

                <View style={styles.row}>
                  <TextInput
                    label="Quantité cabosses"
                    value={quantiteCabosses}
                    onChangeText={setQuantiteCabosses}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                    keyboardType="numeric"
                  />

                  <TextInput
                    label="Poids estimatif (kg)"
                    value={poidsEstimatif}
                    onChangeText={setPoidsEstimatif}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                    keyboardType="numeric"
                  />
                </View>

                <TextInput
                  label="Nombre de sacs"
                  value={nbSacs}
                  onChangeText={setNbSacs}
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

      case 3:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Signature du Producteur</Title>

                {signature ? (
                  <View style={styles.signatureContainer}>
                    <Text style={styles.signatureLabel}>✅ Signature enregistrée</Text>
                    <Image source={{ uri: signature }} style={styles.signatureImage} />
                  </View>
                ) : (
                  <Text style={styles.noSignature}>Aucune signature</Text>
                )}

                <Button
                  mode="contained"
                  icon="draw"
                  onPress={handleGoToSignature}
                  style={styles.signatureButton}
                  buttonColor="#4CAF50"
                >
                  {signature ? 'Modifier la Signature' : 'Faire Signer le Producteur'}
                </Button>

                <Text style={styles.optionalText}>
                  * La signature est optionnelle
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
  signatureContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  signatureLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  signatureImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  noSignature: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  signatureButton: {
    marginTop: 16,
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

