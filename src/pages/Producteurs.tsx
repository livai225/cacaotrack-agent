import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Loader2, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Producteur } from "@/types/organisation";

export default function Producteurs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [producteurs, setProducteurs] = useState<Producteur[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Chargement des données depuis l'API
    const loadData = async () => {
      try {
        const data = await api.getProducteurs();
        setProducteurs(data);
      } catch (error) {
        console.error("Erreur chargement producteurs:", error);
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
      case "suspendu":
        return "bg-warning text-warning-foreground";
      case "inactif":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce producteur ?")) {
      try {
        await api.deleteProducteur(id);
        setProducteurs(producteurs.filter(p => p.id !== id));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Filtrage
  const filteredProducteurs = producteurs.filter(p =>
    p.nom_complet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Producteurs</h1>
          <p className="text-muted-foreground mt-1">Gestion des producteurs de cacao ({producteurs.length})</p>
        </div>
        <Link to="/producteurs/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Producteur
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou code..."
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

      {/* Producteurs Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProducteurs.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Aucun producteur trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducteurs.map((producteur) => (
            <Card
              key={producteur.id}
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
              onClick={() => navigate(`/producteurs/${producteur.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={producteur.photo_planteur || `https://api.dicebear.com/7.x/avataaars/svg?seed=${producteur.nom_complet}`}
                    alt={producteur.nom_complet}
                    className="w-16 h-16 rounded-full bg-muted border group-hover:border-primary transition-colors"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {producteur.nom_complet}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{producteur.id_village}</p>
                      </div>
                      <Badge className={getStatusColor(producteur.statut)}>
                        {producteur.statut}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 font-mono truncate bg-muted/50 p-1 rounded w-fit">
                      {producteur.code}
                    </p>
                    <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{producteur.cacao_nb_plantations} Plantation(s)</span>
                      <span>•</span>
                      <span>{producteur.cacao_superficie} Ha</span>
                    </div>

                    {(producteur as any).agent_creation && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">Créé par</p>
                        <p className="text-sm font-medium text-foreground">
                          {(producteur as any).agent_creation.nom} {(producteur as any).agent_creation.prenom} ({(producteur as any).agent_creation.code})
                        </p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-border">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(producteur.id);
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
      )}
    </div>
  );
}
