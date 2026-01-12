import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api.service';
import { locationService } from '../services/locationService';

interface Agent {
  id: string;
  code: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  photo?: string;
}

interface AuthContextData {
  agent: Agent | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Démarrer le suivi si l'agent est déjà connecté au chargement
  useEffect(() => {
    if (agent?.id) {
      console.log('📍 [Auth] Agent connecté, démarrage du suivi de localisation pour:', agent.id);
      locationService.startTracking(agent.id).catch((error) => {
        console.error('❌ [Auth] Erreur démarrage suivi localisation:', error);
      });
    } else {
      console.log('📍 [Auth] Aucun agent connecté, arrêt du suivi de localisation');
      locationService.stopTracking();
    }
    
    // Cleanup: arrêter le suivi si l'agent se déconnecte
    return () => {
      if (!agent) {
        locationService.stopTracking();
      }
    };
  }, [agent]);

  const loadStoredAuth = async () => {
    try {
      const storedAgent = await AsyncStorage.getItem('agent');
      const storedToken = await AsyncStorage.getItem('auth_token');
      
      if (storedAgent && storedToken) {
        setAgent(JSON.parse(storedAgent));
      }
    } catch (error) {
      console.error('Erreur chargement auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await apiService.login(username, password);
      
      if (!response.agent || !response.token) {
        throw new Error('Réponse invalide du serveur');
      }
      
      await AsyncStorage.setItem('agent', JSON.stringify(response.agent));
      await AsyncStorage.setItem('auth_token', response.token);
      
      setAgent(response.agent);

      // Démarrer le suivi de localisation
      if (response.agent.id) {
        locationService.startTracking(response.agent.id);
      }
    } catch (error: any) {
      console.error('Erreur login:', error);
      // Propager l'erreur avec un message clair
      throw error instanceof Error ? error : new Error(error?.message || 'Erreur de connexion');
    }
  };

  const logout = async () => {
    try {
      // Arrêter le suivi de localisation
      locationService.stopTracking();
      
      await AsyncStorage.removeItem('agent');
      await AsyncStorage.removeItem('auth_token');
      setAgent(null);
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        agent,
        isLoading,
        isAuthenticated: !!agent,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

