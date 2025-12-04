import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, Divider } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';

export default function HomeScreen({ navigation }: any) {
  const { agent, logout } = useAuth();
  const { isOnline, isSyncing, pendingCount, syncData } = useSync();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Carte Agent */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.welcome}>
            Bonjour, {agent?.prenom} {agent?.nom}
          </Title>
          <Text style={styles.info}>Code: {agent?.code}</Text>
          <Text style={styles.info}>Téléphone: {agent?.telephone}</Text>
        </Card.Content>
      </Card>

      {/* Carte Synchronisation */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Synchronisation</Title>
          <View style={styles.syncRow}>
            <Text style={styles.syncLabel}>Statut:</Text>
            <Text style={[styles.syncValue, isOnline ? styles.online : styles.offline]}>
              {isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
            </Text>
          </View>
          <View style={styles.syncRow}>
            <Text style={styles.syncLabel}>En attente:</Text>
            <Text style={styles.syncValue}>{pendingCount} élément(s)</Text>
          </View>
          {pendingCount > 0 && (
            <Button
              mode="contained"
              onPress={syncData}
              loading={isSyncing}
              disabled={!isOnline || isSyncing}
              style={styles.syncButton}
            >
              {isSyncing ? 'Synchronisation...' : 'Synchroniser maintenant'}
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* Menu Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Actions Rapides</Title>
          <Divider style={styles.divider} />
          
          <Button
            mode="contained"
            icon="domain"
            onPress={() => navigation.navigate('Organisation')}
            style={styles.actionButton}
            buttonColor="#8B4513"
          >
            Créer une Organisation
          </Button>

          <Button
            mode="contained"
            icon="map-marker"
            onPress={() => navigation.navigate('Village')}
            style={styles.actionButton}
            buttonColor="#8B4513"
          >
            Enregistrer un Village
          </Button>

          <Button
            mode="contained"
            icon="account"
            onPress={() => navigation.navigate('Producteur')}
            style={styles.actionButton}
            buttonColor="#8B4513"
          >
            Enregistrer un Producteur
          </Button>

          <Button
            mode="contained"
            icon="map"
            onPress={() => navigation.navigate('Parcelle')}
            style={styles.actionButton}
            buttonColor="#8B4513"
          >
            Créer une Parcelle
          </Button>

          <Button
            mode="contained"
            icon="package-variant"
            onPress={() => navigation.navigate('Collecte')}
            style={styles.actionButton}
            buttonColor="#D2691E"
          >
            Nouvelle Collecte
          </Button>
        </Card.Content>
      </Card>

      {/* Déconnexion */}
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="#D32F2F"
      >
        Déconnexion
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  syncLabel: {
    fontSize: 14,
    color: '#666',
  },
  syncValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  online: {
    color: '#4CAF50',
  },
  offline: {
    color: '#F44336',
  },
  syncButton: {
    marginTop: 12,
  },
  divider: {
    marginVertical: 12,
  },
  actionButton: {
    marginTop: 12,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
    borderColor: '#D32F2F',
  },
});
