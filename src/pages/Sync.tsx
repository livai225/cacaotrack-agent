import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, Wifi, WifiOff, Clock, Download, Upload, 
  Trash2, CheckCircle, XCircle, AlertCircle 
} from "lucide-react";
import { offlineService, type PendingOperation } from "@/services/offlineService";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function Sync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
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

    // Charger les données
    loadData();

    // Rafraîchir toutes les 5 secondes
    const interval = setInterval(loadData, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const loadData = () => {
    setPendingOps(offlineService.getPendingOperations());
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
        result.errors.forEach(err => {
          console.error(`Erreur ${err.id}:`, err.error);
        });
      }

      loadData();
    } catch (error: any) {
      toast.error("Erreur lors de la synchronisation");
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCleanSynced = () => {
    offlineService.cleanSyncedOperations();
    loadData();
    toast.success("Opérations synchronisées nettoyées");
  };

  const handleClearAll = () => {
    if (confirm("Êtes-vous sûr de vouloir effacer toutes les opérations en attente ?")) {
      offlineService.clearAll();
      loadData();
      toast.success("Toutes les opérations effacées");
    }
  };

  const handleDeleteOperation = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette opération ?")) {
      offlineService.deleteOperation(id);
      loadData();
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

  const unsyncedOps = pendingOps.filter(op => !op.synced);
  const syncedOps = pendingOps.filter(op => op.synced);
  const errorOps = pendingOps.filter(op => op.error);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Synchronisation</h1>
          <p className="text-muted-foreground mt-1">Gestion des données hors ligne</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={pendingOps.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button
            variant="outline"
            onClick={handleCleanSynced}
            disabled={syncedOps.length === 0}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Nettoyer
          </Button>
          <Button
            variant="destructive"
            onClick={handleClearAll}
            disabled={pendingOps.length === 0}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Tout effacer
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              État Connexion
            </CardTitle>
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isOnline ? "En ligne" : "Hors ligne"}
            </div>
            <Badge className={isOnline ? "bg-green-500 mt-2" : "bg-destructive mt-2"}>
              {isOnline ? "Connecté" : "Déconnecté"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Attente
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{unsyncedOps.length}</div>
            <Badge className="bg-orange-500 mt-2">
              À synchroniser
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Synchronisées
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{syncedOps.length}</div>
            <Badge className="bg-green-500 mt-2">
              Réussies
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Erreurs
            </CardTitle>
            <XCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{errorOps.length}</div>
            <Badge className="bg-destructive mt-2">
              Échouées
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Dernière synchronisation */}
      {lastSync && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Dernière synchronisation</p>
                  <p className="text-sm text-muted-foreground">
                    {lastSync.toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSync}
                disabled={!isOnline || isSyncing || unsyncedOps.length === 0}
                className="gap-2"
              >
                {isSyncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Synchroniser maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des opérations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Opérations en attente ({pendingOps.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingOps.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-muted-foreground">
                Aucune opération en attente de synchronisation
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOps.map((op) => (
                <div
                  key={op.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {op.synced ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : op.error ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-500" />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {getOperationLabel(op)}
                        </Badge>
                        {op.synced && (
                          <Badge className="bg-green-500">Synchronisée</Badge>
                        )}
                        {op.error && (
                          <Badge className="bg-destructive">Erreur</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(op.timestamp).toLocaleString('fr-FR')}
                      </p>
                      {op.error && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          <span>{op.error}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteOperation(op.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
