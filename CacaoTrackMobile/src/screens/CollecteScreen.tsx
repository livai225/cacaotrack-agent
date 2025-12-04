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
import { TextInput, Button, Title, Card, List, Text } from 'react-native-paper';
import { apiService } from '../services/api.service';
import { useSync } from '../contexts/SyncContext';
import { useAuth } from '../contexts/AuthContext';

export default function CollecteScreen({ navigation, route }: any) {
  const { agent } = useAuth();
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  
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
  
  // Signature (si venant de SignatureScreen)
  const [signature, setSignature] = useState(route.params?.signature_producteur || '');
  
  // Formulaire simplifié
  const [campagne, setCampagne] = useState('2024-2025');
  const [quantiteCabosses, setQuantiteCabosses] = useState('');
  const [poidsEstimatif, setPoidsEstimatif] = useState('');
  const [nbSacs, setNbSacs] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Mettre à jour la signature si on revient de SignatureScreen
    if (route.params?.signature_producteur) {
      setSignature(route.params.signature_producteur);
    }
  }, [route.params]);

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
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        await savePending('operation', data);
        Alert.alert(
          'Hors ligne',
          'Collecte sauvegardée pour synchronisation.',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
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
        {/* Village */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Village *</Title>
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

        {/* Producteur */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Producteur *</Title>
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

        {/* Parcelle */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Parcelle *</Title>
            <Button
              mode="outlined"
              onPress={() => setShowParcelleList(!showParcelleList)}
              style={styles.selectButton}
            >
              {selectedParcelle ? selectedParcelle.code : 'Choisir une parcelle'}
            </Button>
            {showParcelleList && (
              <View style={styles.listContainer}>
                {parcelles.map((parcelle) => (
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

        {/* Informations Collecte */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations de la Collecte</Title>

            <TextInput
              label="Campagne"
              value={campagne}
              onChangeText={setCampagne}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Quantité de cabosses estimée"
              value={quantiteCabosses}
              onChangeText={setQuantiteCabosses}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Poids estimatif (kg)"
              value={poidsEstimatif}
              onChangeText={setPoidsEstimatif}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Nombre de sacs"
              value={nbSacs}
              onChangeText={setNbSacs}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />
          </Card.Content>
        </Card>

        {/* Signature */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Signature du Producteur</Title>

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
          Créer la Collecte
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
  submitButton: {
    marginTop: 16,
    marginBottom: 40,
    paddingVertical: 8,
  },
});
