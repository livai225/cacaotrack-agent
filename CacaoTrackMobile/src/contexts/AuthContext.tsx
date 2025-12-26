import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api.service';

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
      
      await AsyncStorage.setItem('agent', JSON.stringify(response.agent));
      await AsyncStorage.setItem('auth_token', response.token);
      
      setAgent(response.agent);
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
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
