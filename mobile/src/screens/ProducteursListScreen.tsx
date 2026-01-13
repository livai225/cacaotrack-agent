import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { FAB, Portal, Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import { apiService } from '../services/api.service';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProducteursListScreen({ navigation }: any) {
  const { agent } = useAuth();
  const [producteurs, setProducteurs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadProducteurs();
    setRefreshing(false);
  }, [agent]);

  const renderProducteur = ({ item }: { item: any }) => {
    const dateCreation = item.createdAt ? new Date(item.createdAt) : new Date();
    
    return (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => navigation.navigate('Producteur', { producteur: item })}
        activeOpacity={0.7}
      >
        <View style={styles.taskLeft}>
          <View style={styles.checkbox} />
          <View style={styles.taskContent}>
            <Text style={styles.taskTitle}>{item.nom_complet}</Text>
            <Text style={styles.taskDescription} numberOfLines={2}>
              {item.village?.nom || 'Village non spécifié'} - {item.telephone_1 || 'Pas de téléphone'}
            </Text>
            <View style={styles.taskMeta}>
              <Text style={styles.taskTime}>
                {format(dateCreation, "HH:mm", { locale: fr })}
              </Text>
              <Text style={styles.taskTag}>@{item.code}</Text>
            </View>
          </View>
        </View>
        <View style={styles.taskRight}>
          <View style={styles.taskStatus}>
            <Icon name="account" size={16} color="#FF6B35" />
            <Text style={styles.taskStatusText}>0/0</Text>
          </View>
          <Icon name="inbox" size={20} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

  // Grouper par date de création
  const groupedProducteurs = producteurs.reduce((acc: any, item: any) => {
    const date = item.createdAt ? new Date(item.createdAt) : new Date();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey = '';
    if (date.toDateString() === today.toDateString()) {
      groupKey = "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Hier';
    } else {
      groupKey = format(date, "EEEE, d MMMM", { locale: fr });
    }
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});

  const sections = Object.keys(groupedProducteurs).map(key => ({
    title: key,
    data: groupedProducteurs[key],
  }));

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
        
        {/* Header Orange */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Producteurs</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="magnify" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="dots-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
          </View>
        ) : (
          <FlatList
            data={sections}
            renderItem={({ item }) => (
              <View>
                {renderSectionHeader({ section: item })}
                {item.data.map((producteur: any) => (
                  <View key={producteur.id}>
                    {renderProducteur({ item: producteur })}
                  </View>
                ))}
              </View>
            )}
            keyExtractor={(item, index) => `section-${index}`}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#FF6B35']}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="account-off" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Aucun producteur enregistré</Text>
                <Text style={styles.emptySubtext}>Créez votre premier producteur</Text>
              </View>
            }
          />
        )}

        {/* FAB */}
        <Portal>
          <FAB
            icon="plus"
            style={styles.fab}
            color="#fff"
            onPress={() => navigation.navigate('Producteur')}
          />
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  listContent: {
    paddingBottom: 80,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskTime: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  taskTag: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  taskRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskStatusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B35',
  },
});
