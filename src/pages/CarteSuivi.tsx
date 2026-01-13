import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MapView from "@/components/maps/MapView";
import { agentService } from "@/services/agentService";
import { Map as MapIcon, RefreshCw, Users, Battery, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type MapPoint = {
  id: string;
  latitude: number;
  longitude: number;
  type: 'organisation' | 'producteur' | 'parcelle' | 'village' | 'agent';
  nom: string;
  details?: string;
  produit?: 'cacao' | 'tomate' | 'hevea' | 'autre';
  agent?: {
    id: string;
    code: string;
    nom_complet: string;
    telephone?: string;
    statut?: string;
  };
  timestamp?: string;
  battery_level?: number;
  is_online?: boolean;
};

export default function CarteSuivi() {
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get('agentId'); // Pour centrer sur un agent spécifique
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadAgentLocations();
    // Rafraîchir les positions des agents toutes les 30 secondes
    const interval = setInterval(() => {
      loadAgentLocations();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, []);

  const loadAgentLocations = async () => {
    setIsLoading(true);
    try {
      console.log('📍 [Carte] Chargement des positions des agents...');
      const locations = await agentService.getAgentLocations(30); // Positions des 30 dernières minutes
      console.log(`📍 [Carte] ${locations.length} position(s) reçue(s) de l'API`);
      
      if (locations.length === 0) {
        console.warn('⚠️ [Carte] Aucune position reçue. Vérifiez que:');
        console.warn('  1. L\'agent mobile est connecté et a envoyé sa position');
        console.warn('  2. L\'endpoint /api/agents/location fonctionne');
        console.warn('  3. Les positions sont dans les 30 dernières minutes');
      }
      
      // Convertir les positions en points de carte
      const agentPoints: MapPoint[] = locations.map((loc: any) => {
        if (!loc.latitude || !loc.longitude) {
          console.error('❌ [Carte] Position invalide (latitude/longitude manquants):', loc);
          return null;
        }
        return {
          id: loc.id,
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
          type: 'agent' as const,
          nom: loc.agent?.nom_complet || `Agent ${loc.agent?.code || 'Inconnu'}`,
          details: `Agent ${loc.agent?.code || 'N/A'} - ${loc.agent?.telephone || 'N/A'}`,
          agent: {
            id: loc.agent?.id,
            code: loc.agent?.code,
            nom_complet: loc.agent?.nom_complet,
            telephone: loc.agent?.telephone,
            statut: loc.agent?.statut,
          },
          timestamp: loc.timestamp || loc.last_seen,
          battery_level: loc.battery_level,
          is_online: loc.is_online,
        };
      }).filter((p: MapPoint | null): p is MapPoint => p !== null);

      console.log(`✅ [Carte] ${agentPoints.length} point(s) agent créé(s) et valide(s)`);
      if (agentPoints.length > 0) {
        console.log(`📍 [Carte] Premier point:`, {
          nom: agentPoints[0].nom,
          lat: agentPoints[0].latitude,
          lng: agentPoints[0].longitude
        });
      }
      setPoints(agentPoints);
      setLastUpdate(new Date());
    } catch (error: any) {
      console.error('❌ [Carte] Erreur chargement positions agents:', error);
      console.error('❌ [Carte] Détails:', error?.response?.data || error.message);
      console.error('❌ [Carte] Stack:', error?.stack);
      setPoints([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer pour un agent spécifique si demandé
  const filteredPoints = agentId 
    ? points.filter(p => p.agent?.id === agentId)
    : points;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MapIcon className="h-8 w-8" />
            Position des Agents
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivi en temps réel de la localisation des agents connectés
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {lastUpdate && (
            <p className="text-sm text-muted-foreground">
              Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadAgentLocations()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <MapView 
        points={filteredPoints} 
        height="600px" 
        showLegend={true}
        centerOnAgentId={agentId || undefined}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Agents Connectés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {points.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun agent connecté pour le moment</p>
              <p className="text-sm mt-2">Les positions apparaîtront ici lorsque les agents se connecteront</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {points.map((point) => (
                  <Card key={point.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{point.nom}</h3>
                          <p className="text-sm text-muted-foreground">
                            {point.agent?.code || 'N/A'}
                          </p>
                          {point.agent?.telephone && (
                            <p className="text-sm text-muted-foreground mt-1">
                              📞 {point.agent.telephone}
                            </p>
                          )}
                        </div>
                        <Badge variant={point.is_online ? "default" : "secondary"}>
                          {point.is_online ? "En ligne" : "Hors ligne"}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        {point.battery_level !== null && point.battery_level !== undefined && (
                          <div className="flex items-center gap-2">
                            <Battery className="h-4 w-4 text-muted-foreground" />
                            <span>{point.battery_level}%</span>
                          </div>
                        )}
                        {point.timestamp && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">
                              {new Date(point.timestamp).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        📍 {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{points.length}</p>
              <p className="text-sm text-muted-foreground">Agents connectés</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {points.filter(p => p.is_online).length}
              </p>
              <p className="text-sm text-muted-foreground">En ligne</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {points.filter(p => p.battery_level !== null && p.battery_level !== undefined).length}
              </p>
              <p className="text-sm text-muted-foreground">Avec batterie</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
