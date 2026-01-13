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

export default function ProducteursListScreen({ navigation }: any) {
  const { agent } = useAuth();
  const [producteurs, setProducteurs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducteurs();
  }, [agent]);

  const loadProducteurs = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getProducteurs(agent?.id);
      setProducteurs(data);
    } catch (error) {
      console.error('Erreur chargement producteurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProducteur = ({ item }: { item: any }) => (
    <Card style={styles.producteurCard} onPress={() => navigation.navigate('Producteur', { producteur: item })}>
      <Card.Content>
        <View style={styles.producteurRow}>
          <View style={styles.producteurInfo}>
            <Text style={styles.producteurName}>{item.nom_complet}</Text>
            <Text style={styles.producteurCode}>Code: {item.code}</Text>
            <Text style={styles.producteurVillage}>Village: {item.village?.nom || 'N/A'}</Text>
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
        <Text style={styles.headerTitle}>Producteurs</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Producteur')}
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
          data={producteurs}
          renderItem={renderProducteur}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="account-off" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Aucun producteur enregistré</Text>
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
  producteurCard: {
    marginBottom: 12,
    elevation: 2,
  },
  producteurRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  producteurInfo: {
    flex: 1,
  },
  producteurName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  producteurCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  producteurVillage: {
    fontSize: 14,
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


