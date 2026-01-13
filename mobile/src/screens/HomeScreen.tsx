import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Title,
  Chip,
  FAB,
  Portal,
  Provider as PaperProvider,
  ActivityIndicator,
  Searchbar,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';
import { apiService } from '../services/api.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface DashboardStats {
  producteurs: { total: number; growth: number };
  plantations: { total: number; growth: number };
  recoltes: { total: number };
  organisations: { total: number };
  sections: { total: number };
  villages: { total: number };
  operations: { total: number; growth?: number };
}

export default function HomeScreen({ navigation }: any) {
  const { agent } = useAuth();
  const { isOnline } = useSync();
  const [refreshing, setRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    producteurs: { total: 0, growth: 0 },
    plantations: { total: 0, growth: 0 },
    recoltes: { total: 0 },
    organisations: { total: 0 },
    sections: { total: 0 },
    villages: { total: 0 },
    operations: { total: 0 },
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, [agent]);

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await apiService.getDashboardStats(agent?.id);
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [agent]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const quickActions = [
    { icon: 'account-group', label: 'Producteurs', color: '#8B4513', count: stats.producteurs.total, onPress: () => navigation.navigate('Producteurs') },
    { icon: 'sprout', label: 'Plantations', color: '#4CAF50', count: stats.plantations.total, onPress: () => navigation.navigate('Plantations') },
    { icon: 'tractor-variant', label: 'Récoltes', color: '#FF9800', count: stats.recoltes.total, onPress: () => navigation.navigate('Récoltes') },
    { icon: 'domain', label: 'Organisations', color: '#3b82f6', count: stats.organisations.total, onPress: () => navigation.navigate('Organisation') },
    { icon: 'source-branch', label: 'Sections', color: '#8b5cf6', count: stats.sections.total, onPress: () => navigation.navigate('Section') },
    { icon: 'home-group', label: 'Villages', color: '#f59e0b', count: stats.villages.total, onPress: () => navigation.navigate('Village') },
    { icon: 'clipboard-list', label: 'Opérations', color: '#2196F3', count: stats.operations.total, onPress: () => navigation.navigate('Collecte') },
  ];

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />

        {/* Header Orange style EGOVERN */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Icon name="sprout" size={28} color="#fff" />
              <Text style={styles.appName}>ASCO Track</Text>
            </View>
            <Chip 
              icon={isOnline ? "check-circle" : "alert-circle"} 
              style={[styles.syncChip, { backgroundColor: isOnline ? '#E8F5E9' : '#FFEBEE' }]}
              textStyle={{ color: isOnline ? '#2E7D32' : '#C62828', fontSize: 11 }}
            >
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </Chip>
          </View>

          <View style={styles.profileSection}>
            {agent?.photo ? (
              <Avatar.Image 
                size={56} 
                source={{ uri: agent.photo }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Icon 
                size={56} 
                icon="account" 
                style={styles.avatar}
                color="#FF6B35"
              />
            )}
            <View style={styles.profileText}>
              <Text style={styles.greeting}>{getGreeting()}, {agent?.prenom || 'Agent'}!</Text>
              <Text style={styles.subGreeting}>Que souhaitez-vous faire aujourd'hui ?</Text>
            </View>
          </View>

          <Searchbar
            placeholder="Rechercher un producteur, plantation..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={['#FF6B35']} 
            />
          }
        >
          <View style={styles.content}>
            {/* Quick Actions Grid */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Actions rapides</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickActionCard}
                    onPress={action.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                      <Icon name={action.icon} size={28} color={action.color} />
                    </View>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                    {action.count > 0 && (
                      <View style={[styles.quickActionBadge, { backgroundColor: action.color }]}>
                        <Text style={styles.quickActionBadgeText}>{action.count}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Statistiques */}
            {isLoadingStats ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
              </View>
            ) : (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Mes statistiques</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Producteurs')}>
                    <Text style={styles.seeAllText}>Voir tout</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.statsGrid}>
                  <Card style={styles.statCard} onPress={() => navigation.navigate('Producteurs')}>
                    <Card.Content style={styles.statCardContent}>
                      <View style={[styles.statIcon, { backgroundColor: '#8B451315' }]}>
                        <Icon name="account-group" size={24} color="#8B4513" />
                      </View>
                      <View style={styles.statText}>
                        <Text style={styles.statValue}>{stats.producteurs.total}</Text>
                        <Text style={styles.statLabel}>Producteurs</Text>
                        {stats.producteurs.growth > 0 && (
                          <Text style={styles.statGrowth}>+{stats.producteurs.growth} cette semaine</Text>
                        )}
                      </View>
                    </Card.Content>
                  </Card>

                  <Card style={styles.statCard} onPress={() => navigation.navigate('Plantations')}>
                    <Card.Content style={styles.statCardContent}>
                      <View style={[styles.statIcon, { backgroundColor: '#4CAF5015' }]}>
                        <Icon name="sprout" size={24} color="#4CAF50" />
                      </View>
                      <View style={styles.statText}>
                        <Text style={styles.statValue}>{stats.plantations.total}</Text>
                        <Text style={styles.statLabel}>Plantations</Text>
                        {stats.plantations.growth > 0 && (
                          <Text style={styles.statGrowth}>+{stats.plantations.growth} cette semaine</Text>
                        )}
                      </View>
                    </Card.Content>
                  </Card>

                  <Card style={styles.statCard} onPress={() => navigation.navigate('Récoltes')}>
                    <Card.Content style={styles.statCardContent}>
                      <View style={[styles.statIcon, { backgroundColor: '#FF980015' }]}>
                        <Icon name="tractor-variant" size={24} color="#FF9800" />
                      </View>
                      <View style={styles.statText}>
                        <Text style={styles.statValue}>{stats.recoltes.total}</Text>
                        <Text style={styles.statLabel}>Récoltes</Text>
                        <Text style={styles.statSubLabel}>En attente</Text>
                      </View>
                    </Card.Content>
                  </Card>
                </View>
              </View>
            )}

            {/* Date */}
            <View style={styles.dateContainer}>
              <Icon name="calendar" size={16} color="#666" />
              <Text style={styles.dateText}>
                {format(new Date(), "EEEE, d MMMM yyyy", { locale: fr })}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* FAB Actions */}
        <Portal>
          <FAB.Group
            open={fabOpen}
            icon={fabOpen ? 'close' : 'plus'}
            actions={[
              {
                icon: 'domain',
                label: 'Nouvelle Organisation',
                onPress: () => navigation.navigate('Organisation'),
              },
              {
                icon: 'source-branch',
                label: 'Nouvelle Section',
                onPress: () => navigation.navigate('Section'),
              },
              {
                icon: 'home-group',
                label: 'Nouveau Village',
                onPress: () => navigation.navigate('Village'),
              },
              {
                icon: 'account-plus',
                label: 'Nouveau Producteur',
                onPress: () => navigation.navigate('Producteur'),
              },
              {
                icon: 'map-marker-plus',
                label: 'Nouvelle Parcelle',
                onPress: () => navigation.navigate('Parcelle'),
              },
              {
                icon: 'tractor-variant',
                label: 'Nouvelle Collecte',
                onPress: () => navigation.navigate('Collecte'),
              },
            ]}
            onStateChange={({ open }) => setFabOpen(open)}
            onPress={() => {
              if (fabOpen) {
                setFabOpen(false);
              }
            }}
          />
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  syncChip: {
    height: 28,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    backgroundColor: '#fff',
  },
  profileText: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#FFFFFFCC',
  },
  searchbar: {
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 48) / 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  quickActionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  quickActionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    marginBottom: 0,
    borderRadius: 12,
    elevation: 2,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  statSubLabel: {
    fontSize: 12,
    color: '#999',
  },
  statGrowth: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
