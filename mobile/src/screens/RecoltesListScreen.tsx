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

export default function RecoltesListScreen({ navigation }: any) {
  const { agent } = useAuth();
  const [recoltes, setRecoltes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecoltes();
  }, [agent]);

  const loadRecoltes = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getOperations(agent?.id);
      // Filtrer les récoltes en attente
      const enAttente = data.filter((op: any) => 
        op.statut === 'En attente' || op.statut === 'En cours' || op.statut === 'Brouillon'
      );
      setRecoltes(enAttente);
    } catch (error) {
      console.error('Erreur chargement récoltes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRecolte = ({ item }: { item: any }) => (
    <Card
      style={styles.recolteCard}
      onPress={() => navigation.navigate('Collecte', { operation: item })}
    >
      <Card.Content>
        <View style={styles.recolteRow}>
          <View style={styles.recolteInfo}>
            <Text style={styles.recolteCode}>Opération: {item.code || item.id}</Text>
            <Text style={styles.recolteProducteur}>
              Producteur: {item.producteur?.nom_complet || 'N/A'}
            </Text>
            <View style={styles.recolteDetails}>
              <Text style={styles.recolteDetail}>
                Poids: {item.manutention_pesee || 0} kg
              </Text>
              <Text style={styles.recolteDetail}>
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
        <Text style={styles.headerTitle}>Récoltes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Collecte')}
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
          data={recoltes}
          renderItem={renderRecolte}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="tractor-variant" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Aucune récolte en attente</Text>
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
  recolteCard: {
    marginBottom: 12,
    elevation: 2,
  },
  recolteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recolteInfo: {
    flex: 1,
  },
  recolteCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recolteProducteur: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recolteDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  recolteDetail: {
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


