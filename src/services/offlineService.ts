/**
 * Service de gestion hors ligne pour la collecte en zone rurale
 * Permet de sauvegarder localement et synchroniser plus tard
 */

export interface PendingOperation {
  id: string;
  type: 'operation' | 'producteur' | 'parcelle' | 'agent';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  synced: boolean;
  error?: string;
}

const STORAGE_KEY = 'cacaotrack_pending_operations';
const LAST_SYNC_KEY = 'cacaotrack_last_sync';

export const offlineService = {
  /**
   * Vérifie si l'utilisateur est en ligne
   */
  isOnline: (): boolean => {
    return navigator.onLine;
  },

  /**
   * Sauvegarde une opération en attente de synchronisation
   */
  savePendingOperation: (
    type: PendingOperation['type'],
    action: PendingOperation['action'],
    data: any
  ): string => {
    const operations = offlineService.getPendingOperations();
    const id = `${type}_${action}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newOperation: PendingOperation = {
      id,
      type,
      action,
      data,
      timestamp: Date.now(),
      synced: false,
    };

    operations.push(newOperation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
    
    console.log('✅ Opération sauvegardée localement:', id);
    return id;
  },

  /**
   * Récupère toutes les opérations en attente
   */
  getPendingOperations: (): PendingOperation[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lecture opérations en attente:', error);
      return [];
    }
  },

  /**
   * Récupère les opérations non synchronisées
   */
  getUnsyncedOperations: (): PendingOperation[] => {
    return offlineService.getPendingOperations().filter(op => !op.synced);
  },

  /**
   * Compte le nombre d'opérations en attente
   */
  getPendingCount: (): number => {
    return offlineService.getUnsyncedOperations().length;
  },

  /**
   * Marque une opération comme synchronisée
   */
  markAsSynced: (id: string): void => {
    const operations = offlineService.getPendingOperations();
    const operation = operations.find(op => op.id === id);
    
    if (operation) {
      operation.synced = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
      console.log('✅ Opération synchronisée:', id);
    }
  },

  /**
   * Marque une opération comme échouée
   */
  markAsError: (id: string, error: string): void => {
    const operations = offlineService.getPendingOperations();
    const operation = operations.find(op => op.id === id);
    
    if (operation) {
      operation.error = error;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
      console.error('❌ Erreur synchronisation:', id, error);
    }
  },

  /**
   * Supprime une opération
   */
  deleteOperation: (id: string): void => {
    const operations = offlineService.getPendingOperations();
    const filtered = operations.filter(op => op.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log('🗑️ Opération supprimée:', id);
  },

  /**
   * Nettoie les opérations synchronisées
   */
  cleanSyncedOperations: (): void => {
    const operations = offlineService.getPendingOperations();
    const unsynced = operations.filter(op => !op.synced);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unsynced));
    console.log('🧹 Opérations synchronisées nettoyées');
  },

  /**
   * Efface toutes les opérations
   */
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
    console.log('🗑️ Toutes les opérations effacées');
  },

  /**
   * Enregistre la date de dernière synchronisation
   */
  setLastSync: (): void => {
    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  },

  /**
   * Récupère la date de dernière synchronisation
   */
  getLastSync: (): Date | null => {
    const timestamp = localStorage.getItem(LAST_SYNC_KEY);
    return timestamp ? new Date(parseInt(timestamp)) : null;
  },

  /**
   * Synchronise toutes les opérations en attente
   */
  syncAll: async (apiService: any): Promise<{
    success: number;
    failed: number;
    errors: Array<{ id: string; error: string }>;
  }> => {
    const operations = offlineService.getUnsyncedOperations();
    let success = 0;
    let failed = 0;
    const errors: Array<{ id: string; error: string }> = [];

    console.log(`🔄 Début synchronisation de ${operations.length} opérations...`);

    for (const operation of operations) {
      try {
        // Appeler l'API selon le type et l'action
        await offlineService.syncOperation(operation, apiService);
        offlineService.markAsSynced(operation.id);
        success++;
      } catch (error: any) {
        const errorMsg = error.message || 'Erreur inconnue';
        offlineService.markAsError(operation.id, errorMsg);
        errors.push({ id: operation.id, error: errorMsg });
        failed++;
      }
    }

    if (success > 0) {
      offlineService.setLastSync();
    }

    console.log(`✅ Synchronisation terminée: ${success} réussies, ${failed} échouées`);

    return { success, failed, errors };
  },

  /**
   * Synchronise une opération spécifique
   */
  syncOperation: async (operation: PendingOperation, apiService: any): Promise<void> => {
    const { type, action, data } = operation;

    switch (type) {
      case 'operation':
        if (action === 'create') {
          await apiService.createOperation(data);
        } else if (action === 'update') {
          await apiService.updateOperation(data.id, data);
        } else if (action === 'delete') {
          await apiService.deleteOperation(data.id);
        }
        break;

      case 'producteur':
        if (action === 'create') {
          await apiService.createProducteur(data);
        } else if (action === 'update') {
          await apiService.updateProducteur(data.id, data);
        } else if (action === 'delete') {
          await apiService.deleteProducteur(data.id);
        }
        break;

      case 'parcelle':
        if (action === 'create') {
          await apiService.createParcelle(data);
        } else if (action === 'update') {
          await apiService.updateParcelle(data.id, data);
        } else if (action === 'delete') {
          await apiService.deleteParcelle(data.id);
        }
        break;

      case 'agent':
        if (action === 'create') {
          await apiService.createAgent(data);
        } else if (action === 'update') {
          await apiService.updateAgent(data.id, data);
        } else if (action === 'delete') {
          await apiService.deleteAgent(data.id);
        }
        break;

      default:
        throw new Error(`Type d'opération non supporté: ${type}`);
    }
  },

  /**
   * Exporte les données en attente (pour backup)
   */
  exportPendingData: (): string => {
    const operations = offlineService.getPendingOperations();
    return JSON.stringify(operations, null, 2);
  },

  /**
   * Importe des données en attente (depuis backup)
   */
  importPendingData: (jsonData: string): void => {
    try {
      const operations = JSON.parse(jsonData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
      console.log('✅ Données importées avec succès');
    } catch (error) {
      console.error('❌ Erreur import données:', error);
      throw new Error('Format de données invalide');
    }
  },
};
