import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { TextInput, Button, Title, Card, List } from 'react-native-paper';
import { apiService } from '../services/api.service';
import { useSync } from '../contexts/SyncContext';
import StepIndicator from '../components/StepIndicator';

const STEPS = [
  'Producteur',
  'Informations',
  'GPS',
];

export default function ParcelleScreen({ navigation, route }: any) {
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [producteurs, setProducteurs] = useState<any[]>([]);
  const [selectedProducteur, setSelectedProducteur] = useState<any>(null);
  const [showProducteurList, setShowProducteurList] = useState(false);
  
  // Données GPS du mapping
  const [polygoneGps, setPolygoneGps] = useState(route.params?.polygone_gps || '');
  const [superficieGps, setSuperficieGps] = useState(route.params?.superficie_gps || '');
  const [perimetre, setPerimetre] = useState(route.params?.perimetre || '');
  
  // Formulaire
  const [code, setCode] = useState('');
  const [statut, setStatut] = useState('active');
  const [superficieDeclaree, setSuperficieDeclaree] = useState('');
  const [ageplantation, setAgeplantation] = useState('');
  const [varieteCacao, setVarieteCacao] = useState('');

  useEffect(() => {
    loadProducteurs();
  }, []);

  useEffect(() => {
    if (route.params?.polygone_gps) {
      setPolygoneGps(route.params.polygone_gps);
      setSuperficieGps(route.params.superficie_gps);
      setPerimetre(route.params.perimetre);
    }
  }, [route.params]);

  const loadProducteurs = async () => {
    try {
      const data = await apiService.getProducteurs();
      setProducteurs(data);
    } catch (error) {
      console.error('Erreur chargement producteurs:', error);
    }
  };

  const handleGoToMapping = () => {
    navigation.navigate('ParcelleMap', {
      returnScreen: 'Parcelle',
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!selectedProducteur) {
          Alert.alert('Erreur', 'Veuillez sélectionner un producteur');
          return false;
        }
        return true;
      case 2:
        if (!code.trim()) {
          Alert.alert('Erreur', 'Le code de la parcelle est obligatoire');
          return false;
        }
        return true;
      case 3:
        // GPS optionnel
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
    if (!code || !selectedProducteur) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    const data = {
      code,
      statut,
      id_producteur: selectedProducteur.id,
      superficie_declaree: superficieDeclaree ? parseFloat(superficieDeclaree) : 0,
      age_plantation: ageplantation ? parseInt(ageplantation) : null,
      variete_cacao: varieteCacao || null,
      polygone_gps: polygoneGps || null,
      superficie_gps: superficieGps ? parseFloat(superficieGps.toString()) : null,
      perimetre: perimetre ? parseFloat(perimetre.toString()) : null,
    };

    setLoading(true);
    try {
      if (isOnline) {
        await apiService.createParcelle(data);
        Alert.alert('Succès', 'Parcelle créée avec succès', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await savePending('parcelle', data);
        Alert.alert(
          'Hors ligne',
          'Parcelle sauvegardée pour synchronisation.',
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
                <Title style={styles.cardTitle}>Sélectionner le Producteur *</Title>
                
                <Button
                  mode="outlined"
                  onPress={() => setShowProducteurList(!showProducteurList)}
                  style={styles.selectButton}
                >
                  {selectedProducteur ? selectedProducteur.nom_complet : 'Choisir un producteur'}
                </Button>

                {showProducteurList && (
                  <View style={styles.listContainer}>
                    {producteurs.map((prod) => (
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
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Informations de la Parcelle</Title>

                <TextInput
                  label="Code de la parcelle *"
                  value={code}
                  onChangeText={setCode}
                  mode="outlined"
                  style={styles.input}
                  autoCapitalize="characters"
                />

                <TextInput
                  label="Statut"
                  value={statut}
                  onChangeText={setStatut}
                  mode="outlined"
                  style={styles.input}
                  placeholder="active, jachere, abandonnee"
                />

                <View style={styles.row}>
                  <TextInput
                    label="Superficie déclarée (ha)"
                    value={superficieDeclaree}
                    onChangeText={setSuperficieDeclaree}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                    keyboardType="numeric"
                  />

                  <TextInput
                    label="Âge (années)"
                    value={ageplantation}
                    onChangeText={setAgeplantation}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                    keyboardType="numeric"
                  />
                </View>

                <TextInput
                  label="Variété de cacao"
                  value={varieteCacao}
                  onChangeText={setVarieteCacao}
                  mode="outlined"
                  style={styles.input}
                  placeholder="Amelonado, Mercedes, etc."
                />
              </Card.Content>
            </Card>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Cartographie GPS</Title>

                {superficieGps ? (
                  <View style={styles.gpsInfo}>
                    <Text style={styles.gpsLabel}>✅ Parcelle cartographiée</Text>
                    <Text style={styles.gpsValue}>Superficie GPS: {superficieGps} ha</Text>
                    <Text style={styles.gpsValue}>Périmètre: {perimetre} m</Text>
                    <Text style={styles.gpsValue}>
                      Points: {polygoneGps ? JSON.parse(polygoneGps).length : 0}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.noGps}>Aucune cartographie GPS</Text>
                )}

                <Button
                  mode="contained"
                  icon="map"
                  onPress={handleGoToMapping}
                  style={styles.mappingButton}
                  buttonColor="#4CAF50"
                >
                  {superficieGps ? 'Modifier la Cartographie' : 'Cartographier la Parcelle'}
                </Button>

                <Text style={styles.optionalText}>
                  * La cartographie GPS est optionnelle
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
  gpsInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  gpsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  gpsValue: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  noGps: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  mappingButton: {
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
