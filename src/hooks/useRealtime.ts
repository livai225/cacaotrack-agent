import { useEffect, useState } from 'react';
import { socketService } from '@/services/socket';
import { toast } from 'sonner';

interface UseRealtimeOptions<T> {
  resource: string; // 'organisation', 'village', 'producteur', etc.
  fetchData: () => Promise<T[]>;
  onCreated?: (item: T) => void;
  onUpdated?: (item: T) => void;
  onDeleted?: (data: { id: string }) => void;
  showToasts?: boolean;
}

export function useRealtime<T extends { id: string }>({
  resource,
  fetchData,
  onCreated,
  onUpdated,
  onDeleted,
  showToasts = true,
}: UseRealtimeOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Chargement initial
    const loadData = async () => {
      try {
        const items = await fetchData();
        setData(items);
      } catch (error) {
        console.error(`Erreur chargement ${resource}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Connexion Socket.IO
    socketService.connect();

    // Handlers temps réel
    const handleCreated = (item: T) => {
      console.log(`📡 ${resource} créé:`, item);
      setData(prev => [item, ...prev]);
      if (showToasts) {
        toast.success(`${capitalize(resource)} créé(e) !`);
      }
      onCreated?.(item);
    };

    const handleUpdated = (item: T) => {
      console.log(`📡 ${resource} mis à jour:`, item);
      setData(prev => prev.map(i => i.id === item.id ? item : i));
      if (showToasts) {
        toast.info(`${capitalize(resource)} mis(e) à jour`);
      }
      onUpdated?.(item);
    };

    const handleDeleted = (data: { id: string }) => {
      console.log(`📡 ${resource} supprimé:`, data.id);
      setData(prev => prev.filter(i => i.id !== data.id));
      if (showToasts) {
        toast.error(`${capitalize(resource)} supprimé(e)`);
      }
      onDeleted?.(data);
    };

    // Écouter les événements
    socketService.on(`${resource}:created`, handleCreated);
    socketService.on(`${resource}:updated`, handleUpdated);
    socketService.on(`${resource}:deleted`, handleDeleted);

    // Nettoyage
    return () => {
      socketService.off(`${resource}:created`, handleCreated);
      socketService.off(`${resource}:updated`, handleUpdated);
      socketService.off(`${resource}:deleted`, handleDeleted);
    };
  }, [resource, fetchData, onCreated, onUpdated, onDeleted, showToasts]);

  return { data, setData, isLoading };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
