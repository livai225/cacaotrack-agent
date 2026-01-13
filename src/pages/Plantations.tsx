import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Trees, MapPin, TrendingUp, Map, Loader2, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Parcelle } from "@/types/organisation";

export default function Plantations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [plantations, setPlantations] = useState<Parcelle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getParcelles();
        setPlantations(data);
      } catch (error) {
        console.error("Erreur chargement plantations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette plantation ?")) {
      try {
        await api.deleteParcelle(id);
        setPlantations(plantations.filter(p => p.id !== id));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const filteredPlantations = plantations.filter(p =>
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id_producteur.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plantations</h1>
          <p className="text-muted-foreground mt-1">Gestion des plantations de cacao ({plantations.length})</p>
        </div>
        <div className="flex gap-2">
          <Link to="/plantations/business-plan">
            <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 text-primary">
              <TrendingUp className="h-4 w-4" />
              Farm Business Plan
            </Button>
          </Link>
          <Link to="/plantations/carte">
            <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 text-primary">
              <Map className="h-4 w-4" />
              Cartographie
            </Button>
          </Link>
          <Link to="/plantations/nouveau">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Plantation
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par code ou producteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPlantations.map((plantation) => (
          <Card
            key={plantation.id}
            className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
            onClick={() => navigate(`/plantations/${plantation.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center shrink-0 group-hover:bg-success/20 transition-colors">
                  <Trees className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{plantation.code}</h3>
                      <p className="text-xs text-muted-foreground truncate">{plantation.id_producteur}</p>
                    </div>
                    <Badge className={getStatusColor(plantation.statut)}>
                      {plantation.statut}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Déclarée</p>
                      <p className="text-sm font-semibold text-foreground">{plantation.superficie_declaree} ha</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Réelle</p>
                      <p className="text-sm font-semibold text-foreground">{plantation.superficie_reelle || '-'} ha</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Âge</p>
                      <p className="text-sm font-semibold text-foreground">{plantation.age_plantation} ans</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="text-sm font-semibold text-foreground">{plantation.distance_magasin || '-'} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">
                      {plantation.latitude?.toFixed(4) || 'N/A'}, {plantation.longitude?.toFixed(4) || 'N/A'}
                    </span>
                  </div>

                  {(plantation as any).agent_creation && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Créé par</p>
                      <p className="text-sm font-medium text-foreground">
                        {(plantation as any).agent_creation.nom} {(plantation as any).agent_creation.prenom} ({(plantation as any).agent_creation.code})
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {plantation.maladie_pourriture_brune !== 'Inexistant' && (
                      <Badge variant="outline" className="text-[10px] border-orange-200 text-orange-700 bg-orange-50">
                        Pourr. brune ({plantation.maladie_pourriture_brune})
                      </Badge>
                    )}
                    {plantation.maladie_swollen_shoot !== 'Inexistant' && (
                      <Badge variant="outline" className="text-[10px] border-destructive text-destructive bg-destructive/10">
                        Swollen ({plantation.maladie_swollen_shoot})
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(plantation.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
