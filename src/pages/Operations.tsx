import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, User, MapPin, CheckCircle2, Circle,
  Loader2, Search, Filter, Trash2, Clock, CheckCheck, List, BarChart3
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { socketService } from "@/services/socket";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Type étendu pour inclure les relations
interface OperationWithRelations {
  id: string;
  statut: string;
  campagne?: string;

  // Dates des étapes
  date_recolte_1?: string | Date;
  date_ecabossage?: string | Date;
  fermentation_debut?: string | Date;
  fermentation_fin?: string | Date;
  sechage_debut?: string | Date;
  sechage_fin?: string | Date;
  date_transport?: string | Date;
  date_livraison?: string | Date;
  date_paiement?: string | Date;

  // Données
  manutention_pesee?: number;
  montant_du?: number;

  // Relations
  producteur?: {
    nom_complet: string;
  };
  village?: {
    nom: string;
  };
  agent?: {
    nom: string;
    prenom: string;
    code: string;
  };

  createdAt: string | Date;
  [key: string]: any; // Pour les autres champs
}

// Définition des étapes du processus de collecte
const ETAPES = [
  { id: 1, nom: "Récolte", champs: ["date_recolte_1"] },
  { id: 2, nom: "Écabossage", champs: ["date_ecabossage"] },
  { id: 3, nom: "Fermentation", champs: ["fermentation_debut", "fermentation_fin"] },
  { id: 4, nom: "Séchage", champs: ["sechage_debut", "sechage_fin"] },
  { id: 5, nom: "Transport", champs: ["date_transport"] },
  { id: 6, nom: "Livraison", champs: ["date_livraison", "manutention_pesee"] },
  { id: 7, nom: "Paiement", champs: ["date_paiement", "montant_du"] },
];

export default function Operations() {
  const navigate = useNavigate();
  const [operations, setOperations] = useState<OperationWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("toutes");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getOperations();
        setOperations(data as any); // Cast temporaire en attendant la mise à jour du type API
      } catch (error) {
        console.error("Erreur chargement operations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Connexion Socket.IO pour le temps réel
    socketService.connect();

    // Écouter les événements temps réel
    const handleOperationCreated = (operation: any) => {
      console.log('📡 Nouvelle opération reçue:', operation);
      setOperations(prev => [operation, ...prev]);
      toast.success('Nouvelle collecte créée !', {
        description: `Par ${operation.producteur?.nom_complet || 'Producteur inconnu'}`
      });
    };

    const handleOperationUpdated = (operation: any) => {
      console.log('📡 Opération mise à jour:', operation);
      setOperations(prev => prev.map(op => op.id === operation.id ? operation : op));
      toast.info('Collecte mise à jour');
    };

    const handleOperationDeleted = (data: { id: string }) => {
      console.log('📡 Opération supprimée:', data.id);
      setOperations(prev => prev.filter(op => op.id !== data.id));
      toast.error('Collecte supprimée');
    };

    socketService.on('operation:created', handleOperationCreated);
    socketService.on('operation:updated', handleOperationUpdated);
    socketService.on('operation:deleted', handleOperationDeleted);

    // Nettoyage
    return () => {
      socketService.off('operation:created', handleOperationCreated);
      socketService.off('operation:updated', handleOperationUpdated);
      socketService.off('operation:deleted', handleOperationDeleted);
    };
  }, []);

  // Calculer la progression d'une opération
  const calculerProgression = (operation: any) => {
    let etapesCompletes = 0;

    ETAPES.forEach(etape => {
      const estComplete = etape.champs.every(champ => {
        const valeur = operation[champ];
        return valeur !== null && valeur !== undefined && valeur !== "";
      });
      if (estComplete) etapesCompletes++;
    });

    return {
      etapesCompletes,
      totalEtapes: ETAPES.length,
      pourcentage: Math.round((etapesCompletes / ETAPES.length) * 100),
      etapeActuelle: etapesCompletes < ETAPES.length ? ETAPES[etapesCompletes].nom : "Terminé"
    };
  };

  // Obtenir la couleur du badge selon le statut
  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Payé":
        return "bg-green-600 hover:bg-green-700";
      case "Validé":
        return "bg-blue-600 hover:bg-blue-700";
      case "Brouillon":
        return "bg-orange-500 hover:bg-orange-600";
      case "Annulé":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  // Filtrer les opérations par onglet et recherche
  const filteredOperations = operations.filter(op => {
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchSearch = (
        op.id.toLowerCase().includes(query) ||
        op.producteur?.nom_complet?.toLowerCase().includes(query) ||
        op.agent?.nom?.toLowerCase().includes(query) ||
        op.agent?.prenom?.toLowerCase().includes(query)
      );
      if (!matchSearch) return false;
    }

    // Filtre par onglet
    const progression = calculerProgression(op);
    if (activeTab === "en-cours") {
      return progression.pourcentage < 100 && op.statut !== "Annulé";
    } else if (activeTab === "terminees") {
      return progression.pourcentage === 100 || op.statut === "Payé";
    }
    // "toutes" affiche tout
    return true;
  });

  // Statistiques pour les badges
  const stats = {
    enCours: operations.filter(op => {
      const prog = calculerProgression(op);
      return prog.pourcentage < 100 && op.statut !== "Annulé";
    }).length,
    terminees: operations.filter(op => {
      const prog = calculerProgression(op);
      return prog.pourcentage === 100 || op.statut === "Payé";
    }).length,
    total: operations.length
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette opération ?")) {
      try {
        await api.deleteOperation(id);
        setOperations(operations.filter(op => op.id !== id));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opérations de Collecte</h1>
          <p className="text-muted-foreground mt-1">
            Gestion et suivi des collectes terrain
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => navigate("/operations/dashboard")}>
          <BarChart3 className="h-4 w-4" />
          Voir le Dashboard
        </Button>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="en-cours" className="gap-2">
              <Clock className="h-4 w-4" />
              En cours
              {stats.enCours > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.enCours}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="terminees" className="gap-2">
              <CheckCheck className="h-4 w-4" />
              Terminées
              {stats.terminees > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.terminees}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="toutes" className="gap-2">
              <List className="h-4 w-4" />
              Toutes
              <Badge variant="secondary" className="ml-1">
                {stats.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="nouvelle" className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Collecte
            </TabsTrigger>
          </TabsList>

          {/* Barre de recherche */}
          {activeTab !== "nouvelle" && (
            <div className="flex gap-4 flex-1 max-w-md ml-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
        </div>

        {/* Contenu des onglets */}
        <TabsContent value="en-cours" className="space-y-4">
          {renderOperationsList(filteredOperations, isLoading, searchQuery)}
        </TabsContent>

        <TabsContent value="terminees" className="space-y-4">
          {renderOperationsList(filteredOperations, isLoading, searchQuery)}
        </TabsContent>

        <TabsContent value="toutes" className="space-y-4">
          {renderOperationsList(filteredOperations, isLoading, searchQuery)}
        </TabsContent>

        <TabsContent value="nouvelle" className="space-y-4">
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Créer une Nouvelle Collecte</h3>
                <p className="text-muted-foreground mb-6">
                  Utilisez ce formulaire uniquement si l'agent n'a pas accès à l'application mobile.
                  <br />
                  Les collectes sont normalement créées depuis l'application mobile terrain.
                </p>
              </div>
              <Button size="lg" className="gap-2" onClick={() => navigate("/operations/nouveau")}>
                <Plus className="h-5 w-5" />
                Ouvrir le Formulaire de Collecte
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Fonction pour rendre la liste des opérations
  function renderOperationsList(
    ops: OperationWithRelations[],
    loading: boolean,
    query: string
  ) {
    return (
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredOperations.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              {searchQuery ? "Aucune opération trouvée" : "Aucune opération enregistrée"}
            </p>
          </div>
        ) : (
          filteredOperations.map((operation) => {
            const progression = calculerProgression(operation);

            return (
              <Card
                key={operation.id}
                className="shadow-card hover:shadow-elevated transition-all cursor-pointer"
                onClick={() => navigate(`/operations/${operation.id}`)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* En-tête de la card */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            #{operation.id.slice(-8).toUpperCase()}
                          </h3>
                          <Badge className={getStatutColor(operation.statut)}>
                            {operation.statut}
                          </Badge>
                          {operation.campagne && (
                            <Badge variant="outline" className="font-mono text-xs">
                              {operation.campagne}
                            </Badge>
                          )}
                        </div>

                        {/* Producteur */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="font-medium">
                            {operation.producteur?.nom_complet || "Producteur inconnu"}
                          </span>
                        </div>

                        {/* Village */}
                        {operation.village && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{operation.village.nom}</span>
                          </div>
                        )}
                      </div>

                      {/* Agent */}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Agent collecteur</p>
                        {operation.agent ? (
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">
                                {operation.agent.nom} {operation.agent.prenom}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {operation.agent.code}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Non assigné</p>
                        )}
                      </div>
                    </div>

                    {/* Progression */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progression : {progression.etapesCompletes}/{progression.totalEtapes} étapes
                        </span>
                        <span className="font-medium text-primary">
                          {progression.pourcentage}%
                        </span>
                      </div>

                      <Progress value={progression.pourcentage} className="h-2" />

                      {/* Étapes */}
                      <div className="flex items-center justify-between pt-2">
                        {ETAPES.map((etape, index) => {
                          const estComplete = index < progression.etapesCompletes;
                          const estEnCours = index === progression.etapesCompletes;

                          return (
                            <div key={etape.id} className="flex flex-col items-center gap-1">
                              {estComplete ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : estEnCours ? (
                                <Circle className="h-5 w-5 text-primary fill-primary/20" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground/30" />
                              )}
                              <span
                                className={`text-xs ${estComplete
                                  ? "text-green-600 font-medium"
                                  : estEnCours
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground/50"
                                  }`}
                              >
                                {etape.nom}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {operation.manutention_pesee && (
                          <div>
                            <span className="font-medium text-foreground">
                              {operation.manutention_pesee} Kg
                            </span>
                          </div>
                        )}
                        {operation.montant_du && (
                          <div>
                            <span className="font-medium text-foreground">
                              {operation.montant_du.toLocaleString()} FCFA
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Créé le {new Date(operation.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(operation.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    );
  }
}
