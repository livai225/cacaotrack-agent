import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Building2, Users, Loader2, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Organisation } from "@/types/organisation";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function Organisations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les organisations au montage du composant
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await api.getOrganisations();
        console.log("Organisations chargées:", data.length, data);
        setOrganisations(data);
      } catch (error) {
        console.error("Erreur chargement organisations:", error);
        toast.error("Erreur lors du chargement des organisations");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "actif":
        return "bg-success text-success-foreground";
      case "inactif":
        return "bg-muted text-muted-foreground";
      case "suspendu":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette organisation ?")) {
      try {
        await api.deleteOrganisation(id);
        setOrganisations(organisations.filter(org => org.id !== id));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Filtrer les organisations selon la recherche
  const filteredOrganisations = organisations.filter(org => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return org.nom.toLowerCase().includes(query) ||
      org.code.toLowerCase().includes(query) ||
      org.region.toLowerCase().includes(query) ||
      org.departement.toLowerCase().includes(query) ||
      org.localite.toLowerCase().includes(query);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organisations</h1>
          <p className="text-muted-foreground mt-1">Gestion des coopératives et regroupements ({organisations.length})</p>
        </div>
        <Link to="/organisations/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Organisation
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
        ) : filteredOrganisations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "Aucune organisation trouvée" : "Aucune organisation enregistrée"}
            </p>
            {!searchQuery && (
              <Link to="/organisations/nouveau">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Créer la première organisation
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredOrganisations.map((org) => (
            <Card
              key={org.id}
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
              onClick={() => navigate(`/organisations/${org.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{org.nom}</h3>
                        <p className="text-xs text-muted-foreground">{org.type}</p>
                      </div>
                      <Badge className={getStatusColor(org.statut)}>
                        {org.statut}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>{org.departement}, {org.sous_prefecture}</p>
                      <p className="font-mono text-primary">{org.code}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Région</p>
                        <p className="text-sm font-semibold text-foreground">{org.region}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Potentiel</p>
                        <p className="text-sm font-semibold text-foreground">{org.potentiel_production ? `${org.potentiel_production}T` : 'N/A'}</p>
                      </div>
                    </div>

                    {(org as any).agent_creation && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">Créé par</p>
                        <p className="text-sm font-medium text-foreground">
                          {(org as any).agent_creation.nom} {(org as any).agent_creation.prenom} ({(org as any).agent_creation.code})
                        </p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/organisations/${org.id}/membres`);
                        }}
                      >
                        <Users className="h-4 w-4" />
                        Gérer les Membres
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2 mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(org.id);
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
          ))
        )}
      </div>
    </div>
  );
}
