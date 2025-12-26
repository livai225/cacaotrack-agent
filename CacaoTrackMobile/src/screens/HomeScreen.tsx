import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import Card from '../components/Card';
import Button from '../components/Button';

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

  const actionButtons = [
    {
      id: 'organisation',
      title: 'Créer une Organisation',
      icon: '🏢',
      color: colors.primary,
      onPress: () => navigation.navigate('Organisation'),
    },
    {
      id: 'section',
      title: 'Créer une Section',
      icon: '📍',
      color: colors.primary,
      onPress: () => navigation.navigate('Section'),
    },
    {
      id: 'village',
      title: 'Enregistrer un Village',
      icon: '🏘️',
      color: colors.primary,
      onPress: () => navigation.navigate('Village'),
    },
    {
      id: 'producteur',
      title: 'Enregistrer un Producteur',
      icon: '👤',
      color: colors.primary,
      onPress: () => navigation.navigate('Producteur'),
    },
    {
      id: 'parcelle',
      title: 'Créer une Parcelle',
      icon: '🗺️',
      color: colors.primary,
      onPress: () => navigation.navigate('Parcelle'),
    },
    {
      id: 'collecte',
      title: 'Nouvelle Collecte',
      icon: '📦',
      color: colors.secondary,
      onPress: () => navigation.navigate('Collecte'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec infos agent */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {agent?.prenom?.[0]?.toUpperCase() || 'A'}
            </Text>
          </View>
        </View>
        <View style={styles.agentInfo}>
          <Text style={styles.welcome}>Bonjour,</Text>
          <Text style={styles.agentName}>
            {agent?.prenom} {agent?.nom}
          </Text>
          <Text style={styles.agentCode}>Code: {agent?.code}</Text>
        </View>
      </View>

      {/* Carte Synchronisation */}
      <Card variant="elevated" style={styles.syncCard}>
        <View style={styles.syncHeader}>
          <Text style={styles.syncTitle}>Synchronisation</Text>
          <View style={[styles.statusBadge, isOnline ? styles.statusOnline : styles.statusOffline]}>
            <View style={[styles.statusDot, isOnline ? styles.statusDotOnline : styles.statusDotOffline]} />
            <Text style={[styles.statusText, isOnline ? styles.statusTextOnline : styles.statusTextOffline]}>
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </Text>
          </View>
        </View>
        
        <View style={styles.syncInfo}>
          <View style={styles.syncInfoRow}>
            <Text style={styles.syncLabel}>Éléments en attente:</Text>
            <View style={[styles.pendingBadge, pendingCount > 0 && styles.pendingBadgeActive]}>
              <Text style={styles.pendingCount}>{pendingCount}</Text>
            </View>
          </View>
        </View>

        {pendingCount > 0 && (
          <Button
            title={isSyncing ? 'Synchronisation...' : 'Synchroniser maintenant'}
            onPress={syncData}
            loading={isSyncing}
            disabled={!isOnline || isSyncing}
            variant="primary"
            size="md"
            style={styles.syncButton}
          />
        )}
      </Card>

      {/* Actions Rapides */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.actionsGrid}>
          {actionButtons.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Déconnexion */}
      <Button
        title="Déconnexion"
        onPress={handleLogout}
        variant="outline"
        size="md"
        style={[styles.logoutButton, { borderColor: colors.error }]}
        textStyle={{ color: colors.error }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
    marginBottom: spacing.md,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
  agentInfo: {
    flex: 1,
  },
  welcome: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  agentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  agentCode: {
    fontSize: 12,
    color: colors.textLight,
  },
  syncCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  syncTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceDark,
  },
  statusOnline: {
    backgroundColor: colors.successLight + '20',
  },
  statusOffline: {
    backgroundColor: colors.errorLight + '20',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
  },
  statusDotOnline: {
    backgroundColor: colors.success,
  },
  statusDotOffline: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextOnline: {
    color: colors.success,
  },
  statusTextOffline: {
    color: colors.error,
  },
  syncInfo: {
    marginBottom: spacing.md,
  },
  syncInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  pendingBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  pendingBadgeActive: {
    backgroundColor: colors.warning + '20',
  },
  pendingCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.warning,
  },
  syncButton: {
    marginTop: spacing.sm,
  },
  actionsSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
  },
  logoutButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
});
