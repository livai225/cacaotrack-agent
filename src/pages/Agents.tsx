import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, User, MapPin, Loader2, Edit, Trash2, Navigation } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { agentService } from "@/services/agentService";
import type { Agent } from "@/types/agent";
import { toast } from "sonner";

export default function Agents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const data = await agentService.getAgents();
      setAgents(data);
    } catch (error) {
      console.error("Erreur chargement agents:", error);
      toast.error("Impossible de charger les agents");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactif":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspendu":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredAgents = agents.filter(agent => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      `${agent.nom} ${agent.prenom}`.toLowerCase().includes(query) ||
      agent.code.toLowerCase().includes(query) ||
      agent.telephone?.toLowerCase().includes(query) ||
      agent.email?.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'agent ${nom} ?`)) return;
    
    try {
      await agentService.deleteAgent(id);
      toast.success("Agent supprimé avec succès");
      loadAgents();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agents de Collecte</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des agents et affectations aux régions ({agents.length})
          </p>
        </div>
        <Link to="/agents/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvel Agent
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, code, téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? "Aucun agent trouvé" : "Aucun agent enregistré"}
          </p>
          {!searchQuery && (
            <Link to="/agents/nouveau">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Créer le premier agent
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="shadow-card hover:shadow-elevated transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {agent.nom} {agent.prenom}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono">{agent.code}</p>
                      </div>
                      <Badge className={getStatusColor(agent.statut)}>
                        {agent.statut}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground mb-3">
                      {agent.telephone && <p>📞 {agent.telephone}</p>}
                      {agent.email && <p>✉️ {agent.email}</p>}
                      {agent.regions && agent.regions.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {agent.regions.map((ar: any) => ar.region?.nom || '').filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => navigate(`/agents/${agent.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => navigate(`/carte?agentId=${agent.id}`)}
                        title="Voir la position sur la carte"
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(agent.id, `${agent.nom} ${agent.prenom}`)}
                      >
                        <Trash2 className="h-4 w-4" />
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

