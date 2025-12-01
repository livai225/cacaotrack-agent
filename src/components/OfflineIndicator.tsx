import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wifi, WifiOff, RefreshCw, Download, Upload, 
  CheckCircle, XCircle, Clock, Trash2 
} from "lucide-react";
import { offlineService, type PendingOperation } from "@/services/offlineService";
import { toast } from "sonner";
import { api } from "@/services/api";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [pendingOps, setPendingOps] = useState<PendingOperation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    // Écouter les changements de connexion
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connexion rétablie !");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Mode hors ligne activé");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Charger les données initiales
    updatePendingData();

    // Rafraîchir toutes les 5 secondes
    const interval = setInterval(updatePendingData, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const updatePendingData = () => {
    setPendingCount(offlineService.getPendingCount());
    setPendingOps(offlineService.getUnsyncedOperations());
    setLastSync(offlineService.getLastSync());
  };

  const handleSync = async () => {
    if (!isOnline) {
      toast.error("Impossible de synchroniser : pas de connexion internet");
      return;
    }

    setIsSyncing(true);
    try {
      const result = await offlineService.syncAll(api);
      
      if (result.success > 0) {
        toast.success(`${result.success} opération(s) synchronisée(s) avec succès`);
      }
      
      if (result.failed > 0) {
        toast.error(`${result.failed} opération(s) échouée(s)`);
      }

      updatePendingData();
    } catch (error: any) {
      toast.error("Erreur lors de la synchronisation");
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCleanSynced = () => {
    offlineService.cleanSyncedOperations();
    updatePendingData();
    toast.success("Opérations synchronisées nettoyées");
  };

  const handleDeleteOperation = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette opération ?")) {
      offlineService.deleteOperation(id);
      updatePendingData();
      toast.success("Opération supprimée");
    }
  };

  const handleExport = () => {
    const data = offlineService.exportPendingData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cacaotrack_backup_${Date.now()}.json`;
    a.click();
    toast.success("Données exportées");
  };

  const getOperationLabel = (op: PendingOperation) => {
    const typeLabels = {
      operation: 'Opération',
      producteur: 'Producteur',
      parcelle: 'Parcelle',
      agent: 'Agent',
    };

    const actionLabels = {
      create: 'Création',
      update: 'Modification',
      delete: 'Suppression',
    };

    return `${typeLabels[op.type]} - ${actionLabels[op.action]}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Indicateur compact */}
      <div className="flex items-center gap-2">
        <Badge
          variant={isOnline ? "default" : "destructive"}
          className="cursor-pointer flex items-center gap-2 px-3 py-2"
          onClick={() => setShowDetails(!showDetails)}
        >
          {isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <span>{isOnline ? "En ligne" : "Hors ligne"}</span>
          {pendingCount > 0 && (
            <span className="ml-2 bg-white text-primary rounded-full px-2 py-0.5 text-xs font-bold">
              {pendingCount}
            </span>
          )}
        </Badge>

        {pendingCount > 0 && isOnline && (
          <Button
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2"
          >
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Synchroniser
          </Button>
        )}
      </div>

      {/* Panneau détaillé */}
      {showDetails && (
        <Card className="absolute bottom-16 right-0 w-96 max-h-96 overflow-hidden shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Synchronisation</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Statut */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Statut :</span>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "En ligne" : "Hors ligne"}
              </Badge>
            </div>

            {lastSync && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dernière sync :</span>
                <span className="text-xs">
                  {lastSync.toLocaleString('fr-FR')}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSync}
                disabled={!isOnline || isSyncing || pendingCount === 0}
                className="flex-1 gap-2"
              >
                {isSyncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Synchroniser
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExport}
                disabled={pendingCount === 0}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCleanSynced}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Liste des opérations */}
            {pendingOps.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <p className="text-sm font-medium">
                  Opérations en attente ({pendingOps.length})
                </p>
                {pendingOps.map((op) => (
                  <div
                    key={op.id}
                    className="flex items-start gap-2 p-2 border rounded text-xs"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{getOperationLabel(op)}</p>
                      <p className="text-muted-foreground">
                        {new Date(op.timestamp).toLocaleString('fr-FR')}
                      </p>
                      {op.error && (
                        <p className="text-destructive mt-1">{op.error}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {op.synced ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : op.error ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOperation(op.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune opération en attente
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
