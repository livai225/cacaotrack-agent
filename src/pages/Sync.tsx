import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Wifi, WifiOff, Clock } from "lucide-react";

export default function Sync() {
  const isOnline = true;
  const pendingItems = 12;

  const syncItems = [
    { type: "Producteur", name: "Kouassi Jean", action: "Créé", date: "12/11/2024 14:23" },
    { type: "Plantation", name: "PROD-0287-P2", action: "Modifié", date: "12/11/2024 13:45" },
    { type: "Opération", name: "OP-2024-0459", action: "Créé", date: "12/11/2024 11:30" },
    { type: "Producteur", name: "Bamba Fatou", action: "Créé", date: "11/11/2024 16:12" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Synchronisation</h1>
        <p className="text-muted-foreground mt-1">Gestion des données hors ligne</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              État Connexion
            </CardTitle>
            {isOnline ? (
              <Wifi className="h-5 w-5 text-success" />
            ) : (
              <WifiOff className="h-5 w-5 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isOnline ? "En ligne" : "Hors ligne"}
            </div>
            <Badge className={isOnline ? "bg-success text-success-foreground mt-2" : "bg-destructive text-destructive-foreground mt-2"}>
              {isOnline ? "Connecté" : "Déconnecté"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Éléments en Attente
            </CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingItems}</div>
            <Badge className="bg-warning text-warning-foreground mt-2">
              À synchroniser
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dernière Sync
            </CardTitle>
            <RefreshCw className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">Il y a 2h</div>
            <p className="text-sm text-muted-foreground mt-2">67 éléments synchronisés</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Données en Attente</CardTitle>
          <Button className="gap-2" disabled={!isOnline}>
            <RefreshCw className="h-4 w-4" />
            Synchroniser
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">
                    {item.type}
                  </Badge>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.action}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{item.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
