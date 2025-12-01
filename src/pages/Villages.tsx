import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, MapPin, Loader2, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Village } from "@/types/organisation";

export default function Villages() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getVillages();
        setVillages(data);
      } catch (error) {
        console.error("Erreur chargement villages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "actif":
        return "bg-success text-success-foreground";
      case "inactif":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce village ?")) {
      try {
        await api.deleteVillage(id);
        setVillages(villages.filter(v => v.id !== id));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const filteredVillages = villages.filter(v =>
    v.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.localite.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Villages & Campements</h1>
          <p className="text-muted-foreground mt-1">Gestion des villages et campements ({villages.length})</p>
        </div>
        <Link to="/villages/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Village
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, code ou localité..."
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
        ) : filteredVillages.map((village) => (
          <Card
            key={village.id}
            className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
            onClick={() => navigate(`/villages/${village.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{village.nom}</h3>
                      <p className="text-xs text-muted-foreground">{village.localite}</p>
                    </div>
                    <Badge className={getStatusColor(village.statut)}>
                      {village.statut}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs mb-3">
                    <p className="text-muted-foreground">Chef: {village.chef_nom}</p>
                    <p className="font-mono text-primary">{village.code}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Habitants</p>
                      <p className="text-sm font-semibold text-foreground">{village.nombre_habitants}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Scolarisés</p>
                      <p className="text-sm font-semibold text-foreground">{village.nombre_enfants_scolarises}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hommes</p>
                      <p className="text-sm font-semibold text-foreground">{village.nombre_hommes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Femmes</p>
                      <p className="text-sm font-semibold text-foreground">{village.nombre_femmes}</p>
                    </div>
                  </div>

                  {village.eau_courante && (
                    <Badge variant="outline" className="mt-3 text-xs border-success text-success">
                      Accès eau
                    </Badge>
                  )}

                  <div className="mt-3 pt-3 border-t border-border">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(village.id);
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
