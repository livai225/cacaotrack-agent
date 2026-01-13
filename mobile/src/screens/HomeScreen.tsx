import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Title,
  Paragraph,
  Chip,
  FAB,
  Portal,
  Provider as PaperProvider,
  List,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';
import { apiService } from '../services/api.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  const StatCard = ({ title, value, icon, subtitle, growth, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.statCard, { borderLeftColor: color }]} elevation={2}>
        <Card.Content style={styles.statCardContent}>
          <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
            <Avatar.Icon 
              icon={icon} 
              size={40} 
              style={{ backgroundColor: color }} 
            />
          </View>
          <View style={styles.statTextContainer}>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
            {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
            {growth !== undefined && growth > 0 && (
              <View style={styles.growthContainer}>
                <Text style={styles.growthText}>+{growth} cette semaine</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, count, icon, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.quickActionCard} elevation={1}>
        <Card.Content style={styles.quickActionContent}>
          <Avatar.Icon 
            icon={icon} 
            size={36} 
            style={{ backgroundColor: color }} 
          />
          <View style={styles.quickActionText}>
            <Text style={styles.quickActionCount}>{count}</Text>
            <Text style={styles.quickActionTitle}>{title}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6D4C41" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeText}>Bienvenue,</Text>
              <Title style={styles.userName}>
                {agent?.prenom || 'Jean'} {agent?.nom || 'Kouassi'}
              </Title>
              <Text style={styles.dateText}>
                {format(new Date(), "EEEE, d MMMM yyyy", { locale: fr })}
              </Text>
            </View>
            <Chip 
              icon={isOnline ? "check-circle" : "alert-circle"} 
              style={[styles.syncChip, { backgroundColor: isOnline ? '#E8F5E9' : '#FFEBEE' }]}
              textStyle={{ color: isOnline ? '#2E7D32' : '#C62828', fontSize: 12 }}
            >
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </Chip>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={['#8B4513']} 
            />
          }
        >
          <View style={styles.content}>
            {/* Statistiques principales */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Mes statistiques</Text>
              
              {isLoadingStats ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#8B4513" />
                </View>
              ) : (
                <>
                  <StatCard 
                    title="Villages" 
                    value={stats.villages.total} 
                    icon="home-group" 
                    color="#f59e0b"
                    onPress={() => navigation.navigate('Village')}
                  />
                  <StatCard 
                    title="Sections" 
                    value={stats.sections.total} 
                    icon="source-branch" 
                    color="#8b5cf6"
                    onPress={() => navigation.navigate('Section')}
                  />
                  <StatCard 
                    title="Producteurs" 
                    value={stats.producteurs.total} 
                    growth={stats.producteurs.growth}
                    icon="account-group" 
                    color="#8B4513"
                    onPress={() => navigation.navigate('Producteur')}
                  />
                  <StatCard 
                    title="Plantations" 
                    value={stats.plantations.total} 
                    growth={stats.plantations.growth}
                    icon="sprout" 
                    color="#4CAF50"
                    onPress={() => navigation.navigate('Parcelle')}
                  />
                  <StatCard 
                    title="Récoltes" 
                    value={stats.recoltes.total} 
                    icon="tractor-variant" 
                    color="#FF9800"
                    subtitle="En attente"
                    onPress={() => navigation.navigate('Collecte')}
                  />
                  <StatCard 
                    title="Opérations" 
                    value={stats.operations.total} 
                    growth={stats.operations.growth}
                    icon="clipboard-list" 
                    color="#2196F3"
                    onPress={() => navigation.navigate('Collecte')}
                  />
                </>
              )}
            </View>

            {/* Actions rapides */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚡ Actions rapides</Text>
              <View style={styles.quickActionsGrid}>
                <QuickActionCard
                  title="Organisation"
                  count={stats.organisations.total}
                  icon="domain"
                  color="#3b82f6"
                  onPress={() => navigation.navigate('Organisation')}
                />
                <QuickActionCard
                  title="Section"
                  count={stats.sections.total}
                  icon="source-branch"
                  color="#8b5cf6"
                  onPress={() => navigation.navigate('Section')}
                />
                <QuickActionCard
                  title="Village"
                  count={stats.villages.total}
                  icon="home-group"
                  color="#f59e0b"
                  onPress={() => navigation.navigate('Village')}
                />
                <QuickActionCard
                  title="Producteur"
                  count={stats.producteurs.total}
                  icon="account-plus"
                  color="#8B4513"
                  onPress={() => navigation.navigate('Producteur')}
                />
                <QuickActionCard
                  title="Parcelle"
                  count={stats.plantations.total}
                  icon="map-marker-plus"
                  color="#4CAF50"
                  onPress={() => navigation.navigate('Parcelle')}
                />
                <QuickActionCard
                  title="Collecte"
                  count={stats.operations.total}
                  icon="tractor-variant"
                  color="#FF9800"
                  onPress={() => navigation.navigate('Collecte')}
                />
              </View>
            </View>

            {/* Liste détaillée */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Détails</Text>
              <Card style={styles.detailCard} elevation={2}>
                <Card.Content>
                  <TouchableOpacity onPress={() => navigation.navigate('Organisation')}>
                    <List.Item
                      title="Organisations"
                      description={`${stats.organisations.total} organisation${stats.organisations.total > 1 ? 's' : ''}`}
                      left={props => <List.Icon {...props} icon="domain" color="#3b82f6" />}
                      right={props => <Text style={styles.countText}>{stats.organisations.total}</Text>}
                    />
                  </TouchableOpacity>
                  <Divider />
                  <TouchableOpacity onPress={() => navigation.navigate('Section')}>
                    <List.Item
                      title="Sections"
                      description={`${stats.sections.total} section${stats.sections.total > 1 ? 's' : ''}`}
                      left={props => <List.Icon {...props} icon="source-branch" color="#8b5cf6" />}
                      right={props => <Text style={styles.countText}>{stats.sections.total}</Text>}
                    />
                  </TouchableOpacity>
                  <Divider />
                  <TouchableOpacity onPress={() => navigation.navigate('Village')}>
                    <List.Item
                      title="Villages"
                      description={`${stats.villages.total} village${stats.villages.total > 1 ? 's' : ''}`}
                      left={props => <List.Icon {...props} icon="home-group" color="#f59e0b" />}
                      right={props => <Text style={styles.countText}>{stats.villages.total}</Text>}
                    />
                  </TouchableOpacity>
                  <Divider />
                  <TouchableOpacity onPress={() => navigation.navigate('Producteur')}>
                    <List.Item
                      title="Producteurs"
                      description={`${stats.producteurs.total} producteur${stats.producteurs.total > 1 ? 's' : ''}`}
                      left={props => <List.Icon {...props} icon="account-group" color="#8B4513" />}
                      right={props => <Text style={styles.countText}>{stats.producteurs.total}</Text>}
                    />
                  </TouchableOpacity>
                  <Divider />
                  <TouchableOpacity onPress={() => navigation.navigate('Parcelle')}>
                    <List.Item
                      title="Plantations"
                      description={`${stats.plantations.total} plantation${stats.plantations.total > 1 ? 's' : ''}`}
                      left={props => <List.Icon {...props} icon="sprout" color="#4CAF50" />}
                      right={props => <Text style={styles.countText}>{stats.plantations.total}</Text>}
                    />
                  </TouchableOpacity>
                  <Divider />
                  <TouchableOpacity onPress={() => navigation.navigate('Collecte')}>
                    <List.Item
                      title="Opérations"
                      description={`${stats.operations.total} opération${stats.operations.total > 1 ? 's' : ''}`}
                      left={props => <List.Icon {...props} icon="tractor-variant" color="#FF9800" />}
                      right={props => <Text style={styles.countText}>{stats.operations.total}</Text>}
                    />
                  </TouchableOpacity>
                </Card.Content>
              </Card>
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
                label: 'Organisation',
                onPress: () => navigation.navigate('Organisation'),
              },
              {
                icon: 'source-branch',
                label: 'Section',
                onPress: () => navigation.navigate('Section'),
              },
              {
                icon: 'home-group',
                label: 'Village',
                onPress: () => navigation.navigate('Village'),
              },
              {
                icon: 'account-plus',
                label: 'Producteur',
                onPress: () => navigation.navigate('Producteur'),
              },
              {
                icon: 'map-marker-plus',
                label: 'Parcelle',
                onPress: () => navigation.navigate('Parcelle'),
              },
              {
                icon: 'tractor-variant',
                label: 'Collecte',
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
    backgroundColor: '#8B4513',
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFFFFFAA',
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFFCC',
  },
  syncChip: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  statCard: {
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    backgroundColor: '#FFFFFF',
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  growthContainer: {
    marginTop: 6,
  },
  growthText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickActionCard: {
    width: (width - 48) / 2,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  quickActionText: {
    marginLeft: 12,
    flex: 1,
  },
  quickActionCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quickActionTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detailCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
});
