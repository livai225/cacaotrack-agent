import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';
import { format } from 'date-fns';

export default function HomeScreen({ navigation }: any) {
  const { agent } = useAuth();
  const { isOnline } = useSync();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Statistiques (à remplacer par des vraies données de l'API)
  const stats = {
    producteurs: { total: 127, growth: 12 },
    plantations: { total: 89, growth: 5 },
    recoltes: { total: 23 },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Mise à jour chaque minute

    return () => clearInterval(timer);
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    growth, 
    icon, 
    iconColor 
  }: {
    title: string;
    value: number;
    subtitle: string;
    growth?: number;
    icon: string;
    iconColor: string;
  }) => (
    <View style={styles.statCard}>
      <View style={styles.statContent}>
        <View style={styles.statLeft}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statSubtitle}>{subtitle}</Text>
          {growth !== undefined && (
            <View style={styles.growthContainer}>
              <Icon name="arrow-up" size={14} color="#4CAF50" />
              <Text style={styles.growthText}>+{growth}</Text>
            </View>
          )}
        </View>
        <View style={[styles.statIconContainer, { backgroundColor: iconColor + '20' }]}>
          <Icon name={icon} size={32} color={iconColor} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B4513" />
      
      {/* Header avec barre marron */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tableau de bord</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell" size={24} color="#fff" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section utilisateur */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Bonjour,</Text>
            <Text style={styles.userName}>
              {agent?.prenom || 'Jean'} {agent?.nom || 'Kouassi'}
            </Text>
            <View style={styles.dateWeatherRow}>
              <Text style={styles.dateText}>
                {format(currentDate, 'd MMMM yyyy')}
              </Text>
              <View style={styles.weatherContainer}>
                <Icon name="weather-sunny" size={20} color="#FF6B35" />
                <Text style={styles.temperatureText}>28°C</Text>
              </View>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="account" size={40} color="#8B4513" />
            </View>
          </View>
        </View>

        {/* Section Statistiques */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          
          <StatCard
            title="Producteurs gérés"
            value={stats.producteurs.total}
            subtitle="Total enregistrés"
            growth={stats.producteurs.growth}
            icon="account-group"
            iconColor="#8B4513"
          />

          <StatCard
            title="Plantations actives"
            value={stats.plantations.total}
            subtitle="En production"
            growth={stats.plantations.growth}
            icon="flag"
            iconColor="#4CAF50"
          />

          <StatCard
            title="Récoltes en attente"
            value={stats.recoltes.total}
            subtitle="À collecter"
            icon="tractor"
            iconColor="#FF6B35"
          />
        </View>
      </ScrollView>
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
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  userSection: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  temperatureText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  avatarContainer: {
    marginLeft: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5E6D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLeft: {
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
