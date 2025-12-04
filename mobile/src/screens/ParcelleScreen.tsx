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
import { apiService } from '../services/api.service';
import { useSync } from '../contexts/SyncContext';

export default function ParcelleScreen({ navigation, route }: any) {
  const { isOnline, savePending } = useSync();
  const [loading, setLoading] = useState(false);
  const [producteurs, setProducteurs] = useState<any[]>([]);
  const [selectedProducteur, setSelectedProducteur] = useState<any>(null);
  const [showProducteurList, setShowProducteurList] = useState(false);
  
  // Données GPS du mapping (si venant de ParcelleMapScreen)
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
    // Mettre à jour si on revient du mapping
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scroll}>
        {/* Producteur */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Sélectionner le Producteur</Title>
            
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

        {/* Informations de base */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations de la Parcelle</Title>

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

            <TextInput
              label="Superficie déclarée (ha)"
              value={superficieDeclaree}
              onChangeText={setSuperficieDeclaree}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Âge de la plantation (années)"
              value={ageplantation}
              onChangeText={setAgeplantation}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

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

        {/* Cartographie GPS */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Cartographie GPS</Title>

            {superficieGps ? (
              <View style={styles.gpsInfo}>
                <Text style={styles.gpsLabel}>✅ Parcelle cartographiée</Text>
                <Text style={styles.gpsValue}>Superficie GPS: {superficieGps} ha</Text>
                <Text style={styles.gpsValue}>Périmètre: {perimetre} m</Text>
                <Text style={styles.gpsValue}>Points: {polygoneGps ? JSON.parse(polygoneGps).length : 0}</Text>
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
          Créer la Parcelle
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
  submitButton: {
    marginTop: 16,
    marginBottom: 40,
    paddingVertical: 8,
  },
});
