import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { apiService } from '../services/api.service';

interface SyncContextData {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  syncData: () => Promise<void>;
  savePending: (type: string, data: any) => Promise<void>;
}

const SyncContext = createContext<SyncContextData>({} as SyncContextData);

export const useSync = () => useContext(SyncContext);

interface SyncProviderProps {
  children: ReactNode;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Écouter les changements de connexion
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      
      // Auto-sync quand la connexion revient
      if (state.isConnected && pendingCount > 0) {
        syncData();
      }
    });

    loadPendingCount();

    return () => unsubscribe();
  }, []);

  const loadPendingCount = async () => {
    try {
      const pending = await AsyncStorage.getItem('pending_sync');
      if (pending) {
        const items = JSON.parse(pending);
        setPendingCount(items.length);
      }
    } catch (error) {
      console.error('Erreur chargement pending:', error);
    }
  };

  const savePending = async (type: string, data: any) => {
    try {
      const pending = await AsyncStorage.getItem('pending_sync');
      const items = pending ? JSON.parse(pending) : [];
      
      items.push({
        id: Date.now().toString(),
        type,
        data,
        timestamp: new Date().toISOString(),
      });

      await AsyncStorage.setItem('pending_sync', JSON.stringify(items));
      setPendingCount(items.length);

      // Essayer de synchroniser immédiatement si en ligne
      if (isOnline) {
        await syncData();
      }
    } catch (error) {
      console.error('Erreur sauvegarde pending:', error);
    }
  };

  const syncData = async () => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);
    try {
      const pending = await AsyncStorage.getItem('pending_sync');
      if (!pending) {
        setPendingCount(0);
        return;
      }

      const items = JSON.parse(pending);
      const synced: string[] = [];

      for (const item of items) {
        try {
          // Envoyer selon le type
          switch (item.type) {
            case 'organisation':
              await apiService.createOrganisation(item.data);
              break;
            case 'section':
              await apiService.createSection(item.data);
              break;
            case 'village':
              await apiService.createVillage(item.data);
              break;
            case 'producteur':
              await apiService.createProducteur(item.data);
              break;
            case 'parcelle':
              await apiService.createParcelle(item.data);
              break;
            case 'operation':
              await apiService.createOperation(item.data);
              break;
          }
          
          synced.push(item.id);
        } catch (error) {
          console.error(`Erreur sync ${item.type}:`, error);
        }
      }

      // Retirer les items synchronisés
      const remaining = items.filter((item: any) => !synced.includes(item.id));
      await AsyncStorage.setItem('pending_sync', JSON.stringify(remaining));
      setPendingCount(remaining.length);

    } catch (error) {
      console.error('Erreur synchronisation:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingCount,
        syncData,
        savePending,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

