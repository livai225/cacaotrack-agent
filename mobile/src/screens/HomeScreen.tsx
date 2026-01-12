import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
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
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';
import { apiService } from '../services/api.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardStats {
  producteurs: { total: number; growth: number };
  plantations: { total: number; growth: number };
  recoltes: { total: number };
  organisations: { total: number };
  sections: { total: number };
  villages: { total: number };
  operations: { total: number };
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
  }, []);

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await apiService.getDashboardStats();
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
  }, []);

  const StatCard = ({ title, value, icon, subtitle, growth, color }: any) => (
    <Card style={styles.card} elevation={2}>
      <Card.Content style={styles.cardContent}>
        <Avatar.Icon icon={icon} size={48} color={color} style={{ backgroundColor: `${color}20` }} />
        <View style={styles.statTextContainer}>
          <Title style={styles.statValue}>{value}</Title>
          <Paragraph style={styles.statTitle}>{title}</Paragraph>
          {growth && <Text style={styles.growthText}>+{growth} cette semaine</Text>}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6D4C41" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bienvenue,</Text>
            <Title style={styles.userName}>{agent?.prenom || 'Jean'} {agent?.nom || 'Kouassi'}</Title>
          </View>
          <Chip 
            icon={isOnline ? "check-circle" : "alert-circle"} 
            style={[styles.syncChip, { backgroundColor: isOnline ? '#E8F5E9' : '#FFEBEE' }]}
            textStyle={{ color: isOnline ? '#2E7D32' : '#C62828' }}
          >
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </Chip>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8B4513']} />}
        >
          <View style={styles.content}>
            {/* Date */}
            <Paragraph style={styles.dateText}>
              {format(new Date(), "EEEE, d MMMM yyyy", { locale: fr })}
            </Paragraph>

            {/* Statistiques */}
            <Title style={styles.sectionTitle}>Vos statistiques</Title>
            <StatCard 
              title="Producteurs" 
              value={isLoadingStats ? '...' : stats.producteurs.total} 
              growth={stats.producteurs.growth}
              icon="account-group" 
              color="#8B4513"
            />
            <StatCard 
              title="Plantations" 
              value={isLoadingStats ? '...' : stats.plantations.total} 
              growth={stats.plantations.growth}
              icon="sprout" 
              color="#4CAF50" 
            />
            <StatCard 
              title="Récoltes en attente" 
              value={isLoadingStats ? '...' : stats.recoltes.total} 
              icon="tractor-variant" 
              color="#FF9800"
            />

            {/* Liste des éléments créés */}
            <Title style={[styles.sectionTitle, { marginTop: 30 }]}>Éléments créés</Title>
            
            <Card style={styles.card} elevation={2}>
              <Card.Content>
                <TouchableOpacity onPress={() => navigation.navigate('Organisation')}>
                  <List.Item
                    title="Organisations"
                    description={`${stats.organisations.total} organisation${stats.organisations.total > 1 ? 's' : ''} - Créer une nouvelle`}
                    left={props => <List.Icon {...props} icon="domain" color="#3b82f6" />}
                    right={props => <Text style={styles.countText}>{stats.organisations.total}</Text>}
                  />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => navigation.navigate('Section')}>
                  <List.Item
                    title="Sections"
                    description={`${stats.sections.total} section${stats.sections.total > 1 ? 's' : ''} - Créer une nouvelle`}
                    left={props => <List.Icon {...props} icon="source-branch" color="#8b5cf6" />}
                    right={props => <Text style={styles.countText}>{stats.sections.total}</Text>}
                  />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => navigation.navigate('Village')}>
                  <List.Item
                    title="Villages"
                    description={`${stats.villages.total} village${stats.villages.total > 1 ? 's' : ''} - Créer un nouveau`}
                    left={props => <List.Icon {...props} icon="home-group" color="#f59e0b" />}
                    right={props => <Text style={styles.countText}>{stats.villages.total}</Text>}
                  />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => navigation.navigate('Producteur')}>
                  <List.Item
                    title="Producteurs"
                    description={`${stats.producteurs.total} producteur${stats.producteurs.total > 1 ? 's' : ''} - Créer un nouveau`}
                    left={props => <List.Icon {...props} icon="account-group" color="#8B4513" />}
                    right={props => <Text style={styles.countText}>{stats.producteurs.total}</Text>}
                  />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => navigation.navigate('Parcelle')}>
                  <List.Item
                    title="Plantations"
                    description={`${stats.plantations.total} plantation${stats.plantations.total > 1 ? 's' : ''} - Créer une nouvelle`}
                    left={props => <List.Icon {...props} icon="sprout" color="#4CAF50" />}
                    right={props => <Text style={styles.countText}>{stats.plantations.total}</Text>}
                  />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => navigation.navigate('Collecte')}>
                  <List.Item
                    title="Opérations"
                    description={`${stats.operations.total} opération${stats.operations.total > 1 ? 's' : ''} - Créer une nouvelle`}
                    left={props => <List.Icon {...props} icon="tractor-variant" color="#FF9800" />}
                    right={props => <Text style={styles.countText}>{stats.operations.total}</Text>}
                  />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>

        {/* Actions Rapides */}
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
                // do something if the speed dial is open
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFFCC',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  syncChip: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statTextContainer: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 16,
    color: '#666',
  },
  growthText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
});
