import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProducteursListScreen from '../screens/ProducteursListScreen';
import PlantationsListScreen from '../screens/PlantationsListScreen';
import RecoltesListScreen from '../screens/RecoltesListScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B4513', // Marron foncé
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#FF6B35', // Orange
        tabBarInactiveTintColor: '#8B4513',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Tableau de bord"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Icon name="view-dashboard" size={24} color={color} />
              {focused && <View style={[styles.badge, { backgroundColor: color }]} />}
            </View>
          ),
          tabBarBadge: 3, // Badge de notification
          tabBarBadgeStyle: {
            backgroundColor: '#FF6B35',
            color: '#fff',
            fontSize: 10,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
          },
        }}
      />
      <Tab.Screen
        name="Producteurs"
        component={ProducteursListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account-group" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Plantations"
        component={PlantationsListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="map-marker" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Récoltes"
        component={RecoltesListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="tractor" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

