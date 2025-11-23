import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapView from "@/components/maps/MapView";
import { organisationService } from "@/services/organisationService";
import { Map as MapIcon, Filter } from "lucide-react";

type MapPoint = {
  id: string;
  latitude: number;
  longitude: number;
  type: 'organisation' | 'producteur' | 'parcelle' | 'village';
  nom: string;
  details?: string;
  produit?: 'cacao' | 'tomate' | 'hevea' | 'autre';
};

export default function CarteSuivi() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterProduit, setFilterProduit] = useState<string>("all");

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = () => {
    const organisations = organisationService.getAll();
    
    // Convertir les organisations en points de carte
    const orgPoints: MapPoint[] = organisations
      .filter(org => org.latitude && org.longitude)
      .map(org => ({
        id: org.id,
        latitude: org.latitude!,
        longitude: org.longitude!,
        type: 'organisation' as const,
        nom: org.nom,
        details: `${org.type} - ${org.region}, ${org.departement}`,
        produit: 'cacao' as const, // Par défaut, toutes les organisations sont liées au cacao
      }));

    setPoints(orgPoints);
  };

  // Filtrer les points
  const filteredPoints = points.filter(point => {
    const typeMatch = filterType === "all" || point.type === filterType;
    const produitMatch = filterProduit === "all" || point.produit === filterProduit;
    return typeMatch && produitMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MapIcon className="h-8 w-8" />
            Carte de Suivi
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualisation géographique des organisations et producteurs
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type d'entité</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="organisation">Organisations</SelectItem>
                  <SelectItem value="producteur">Producteurs</SelectItem>
                  <SelectItem value="parcelle">Parcelles</SelectItem>
                  <SelectItem value="village">Villages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type de produit</label>
              <Select value={filterProduit} onValueChange={setFilterProduit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les produits</SelectItem>
                  <SelectItem value="cacao">Cacao</SelectItem>
                  <SelectItem value="tomate">Tomate</SelectItem>
                  <SelectItem value="hevea">Hévéa</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterType("all");
                setFilterProduit("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      <MapView points={filteredPoints} height="600px" showLegend={true} />

      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{points.length}</p>
              <p className="text-sm text-muted-foreground">Points total</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {points.filter(p => p.type === 'organisation').length}
              </p>
              <p className="text-sm text-muted-foreground">Organisations</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {points.filter(p => p.produit === 'cacao').length}
              </p>
              <p className="text-sm text-muted-foreground">Cacao</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{filteredPoints.length}</p>
              <p className="text-sm text-muted-foreground">Points filtrés</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
