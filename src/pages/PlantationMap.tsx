import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Layers, User, Plus, Minus, MapPin as MapPinIcon, Trees, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import type { Parcelle, Producteur } from "@/types/organisation";

interface PlantationMapItem {
  id: string;
  code: string;
  producteur: string;
  x: number;
  y: number;
  surface: number;
  culture: string;
  statut: string;
  parcelle: Parcelle;
}

export default function PlantationMap() {
  const navigate = useNavigate();
  const [popupInfo, setPopupInfo] = useState<PlantationMapItem | null>(null);
  const [zoom, setZoom] = useState(1);
  const [plantations, setPlantations] = useState<PlantationMapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [producteurs, setProducteurs] = useState<Producteur[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [parcelles, prods] = await Promise.all([
        api.getParcelles(),
        api.getProducteurs(),
      ]);
      setProducteurs(prods);
      
      // Convertir les parcelles avec GPS en positions sur la carte
      const parcellesAvecGPS = parcelles.filter(p => p.latitude && p.longitude);
      
      // Calculer les limites géographiques pour normaliser les coordonnées
      const latitudes = parcellesAvecGPS.map(p => p.latitude!);
      const longitudes = parcellesAvecGPS.map(p => p.longitude!);
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      
      const latRange = maxLat - minLat || 1;
      const lngRange = maxLng - minLng || 1;
      
      const plantationsData: PlantationMapItem[] = parcellesAvecGPS.map(parcelle => {
        const producteur = prods.find(p => p.id === parcelle.id_producteur);
        // Normaliser les coordonnées GPS en pourcentages (0-100%)
        const x = ((parcelle.longitude! - minLng) / lngRange) * 100;
        const y = ((maxLat - parcelle.latitude!) / latRange) * 100; // Inverser Y car latitude augmente vers le nord
        
        return {
          id: parcelle.id,
          code: parcelle.code || `PARC-${parcelle.id.slice(0, 8)}`,
          producteur: producteur?.nom_complet || "Inconnu",
          x: Math.max(5, Math.min(95, x)), // Limiter entre 5% et 95%
          y: Math.max(5, Math.min(95, y)),
          surface: parcelle.superficie_declaree || 0,
          culture: parcelle.culture || "Cacao",
          statut: parcelle.statut === 'active' ? 'Actif' : 'Inactif',
          parcelle,
        };
      });
      
      setPlantations(plantationsData);
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b z-10 bg-card shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/plantations")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Cartographie des Plantations
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Chargement..." : `Visualisation géospatiale des parcelles (${plantations.length} parcelles)`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="gap-1"><div className="w-2 h-2 rounded-full bg-amber-700"></div> Cacao</Badge>
           <Badge variant="outline" className="gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Hévéa</Badge>
           <Badge variant="outline" className="gap-1"><div className="w-2 h-2 rounded-full bg-green-600"></div> Palmier</Badge>
        </div>
      </div>

      {/* Map Container Simulé */}
      <div className="flex-1 relative w-full bg-[#e5e7eb] overflow-hidden cursor-grab active:cursor-grabbing">
        {/* Fond de carte stylisé (Grille + Terrain abstrait) */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
            {/* Couche de fond style "Satellite/Terrain" abstrait */}
            <div className="w-[1000px] h-[800px] bg-[#dbeafe] relative rounded-xl border-4 border-white/50 shadow-2xl overflow-hidden">
                {/* Rivière */}
                <div className="absolute top-0 left-1/3 w-20 h-full bg-[#3b82f6]/20 transform -skew-x-12 blur-xl"></div>
                {/* Forêt */}
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#22c55e]/10 rounded-full blur-3xl"></div>
                {/* Routes */}
                <div className="absolute top-1/2 left-0 w-full h-2 bg-white/40"></div>
                <div className="absolute top-0 left-1/2 w-2 h-full bg-white/40"></div>

                {/* Pins */}
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  plantations.map((plant) => (
                    <div
                        key={plant.id}
                        className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                        style={{ left: `${plant.x}%`, top: `${plant.y}%` }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setPopupInfo(plant);
                        }}
                    >
                        <div className={`
                            relative z-10 p-2 rounded-full shadow-lg transition-transform group-hover:scale-110
                            ${plant.culture === 'Cacao' ? 'bg-amber-700 text-white' : 
                              plant.culture === 'Hévéa' ? 'bg-blue-600 text-white' : 
                              'bg-green-600 text-white'}
                        `}>
                            <MapPinIcon className="h-6 w-6" fill="currentColor" />
                        </div>
                        {/* Ombre du pin */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-1 bg-black/20 rounded-full blur-[1px]"></div>
                        
                        {/* Label au survol */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 whitespace-nowrap bg-black/75 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity">
                            {plant.code}
                        </div>
                    </div>
                  ))
                )}
            </div>
        </div>

        {/* Contrôles de Zoom */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-20">
            <Button variant="secondary" size="icon" onClick={handleZoomIn} disabled={zoom >= 3} className="shadow-lg">
                <Plus className="h-5 w-5" />
            </Button>
            <div className="bg-background/80 backdrop-blur px-2 py-1 text-xs font-mono text-center rounded shadow">
                {Math.round(zoom * 100)}%
            </div>
            <Button variant="secondary" size="icon" onClick={handleZoomOut} disabled={zoom <= 1} className="shadow-lg">
                <Minus className="h-5 w-5" />
            </Button>
        </div>

        {/* Popup Info */}
        {popupInfo && (
            <div className="absolute top-4 left-4 z-30 animate-in fade-in slide-in-from-left-5">
                <Card className="w-[280px] shadow-2xl border-l-4 border-l-primary">
                    <div className="p-4 relative">
                        <button 
                            onClick={() => setPopupInfo(null)}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Trees className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none">{popupInfo.code}</h3>
                                <p className="text-sm text-muted-foreground">{popupInfo.culture}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between py-1 border-b">
                                <span className="text-muted-foreground">Producteur</span>
                                <span className="font-medium">{popupInfo.producteur}</span>
                            </div>
                            <div className="flex items-center justify-between py-1 border-b">
                                <span className="text-muted-foreground">Surface</span>
                                <span className="font-medium">{popupInfo.surface} Ha</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <span className="text-muted-foreground">Statut</span>
                                <Badge variant="secondary" className="text-green-600 bg-green-50">{popupInfo.statut}</Badge>
                            </div>
                        </div>

                        <Button size="sm" className="w-full mt-4" onClick={() => navigate(`/plantations`)}>
                            Voir Détails
                        </Button>
                    </div>
                </Card>
            </div>
        )}

        {/* Légende */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur p-2 rounded text-xs text-muted-foreground pointer-events-none z-10">
            {plantations.length} parcelles mappées • Données GPS réelles
        </div>
      </div>
    </div>
  );
}
