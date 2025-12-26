import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B4513" />
      <Text style={styles.title}>🍫 CacaoTrack</Text>
      <Text style={styles.subtitle}>Agent de Terrain</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
      <Text style={styles.description}>
        Application de collecte de données{'\n'}
        pour la filière cacao en Côte d'Ivoire
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B4513',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600',
  },
  version: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
});