import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import OrganisationScreen from '../screens/OrganisationScreen';
import SectionScreen from '../screens/SectionScreen';
import VillageScreen from '../screens/VillageScreen';
import ProducteurScreen from '../screens/ProducteurScreen';
import ParcelleScreen from '../screens/ParcelleScreen';
import ParcelleMapScreen from '../screens/ParcelleMapScreen';
import CollecteScreen from '../screens/CollecteScreen';
import SignatureScreen from '../screens/SignatureScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Ou un écran de chargement
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B4513',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          {/* Navigation principale avec onglets en bas */}
          <Stack.Screen 
            name="MainTabs" 
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          
          {/* Écrans modaux accessibles depuis les onglets */}
          <Stack.Screen 
            name="Organisation" 
            component={OrganisationScreen}
            options={{ title: 'Organisation' }}
          />
          <Stack.Screen 
            name="Section" 
            component={SectionScreen}
            options={{ title: 'Section' }}
          />
          <Stack.Screen 
            name="Village" 
            component={VillageScreen}
            options={{ title: 'Village' }}
          />
          <Stack.Screen 
            name="Producteur" 
            component={ProducteurScreen}
            options={{ title: 'Producteur' }}
          />
          <Stack.Screen 
            name="Parcelle" 
            component={ParcelleScreen}
            options={{ title: 'Parcelle' }}
          />
          <Stack.Screen 
            name="ParcelleMap" 
            component={ParcelleMapScreen}
            options={{ title: 'Cartographie GPS' }}
          />
          <Stack.Screen 
            name="Collecte" 
            component={CollecteScreen}
            options={{ title: 'Collecte' }}
          />
          <Stack.Screen 
            name="Signature" 
            component={SignatureScreen}
            options={{ title: 'Signature Producteur' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

