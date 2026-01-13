import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { apiService } from '../services/api.service';
import { useAuth } from '../contexts/AuthContext';

export default function PlantationsListScreen({ navigation }: any) {
  const { agent } = useAuth();
  const [plantations, setPlantations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlantations();
  }, [agent]);

  const loadPlantations = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getParcelles(agent?.id);
      setPlantations(data);
    } catch (error) {
      console.error('Erreur chargement plantations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPlantation = ({ item }: { item: any }) => (
    <Card
      style={styles.plantationCard}
      onPress={() => navigation.navigate('Parcelle', { parcelle: item })}
    >
      <Card.Content>
        <View style={styles.plantationRow}>
          <View style={styles.plantationInfo}>
            <Text style={styles.plantationCode}>Code: {item.code}</Text>
            <Text style={styles.plantationProducteur}>
              Producteur: {item.producteur?.nom_complet || 'N/A'}
            </Text>
            <View style={styles.plantationDetails}>
              <Text style={styles.plantationDetail}>
                Superficie: {item.superficie_declaree} Ha
              </Text>
              <Text style={styles.plantationDetail}>
                Statut: {item.statut}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={24} color="#8B4513" />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B4513" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plantations</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Parcelle')}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={plantations}
          renderItem={renderPlantation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="map-marker-off" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Aucune plantation enregistrée</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#8B4513',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  plantationCard: {
    marginBottom: 12,
    elevation: 2,
  },
  plantationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantationInfo: {
    flex: 1,
  },
  plantationCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  plantationProducteur: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  plantationDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  plantationDetail: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});


