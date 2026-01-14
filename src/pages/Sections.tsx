import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Layers, Loader2, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Section } from "@/types/organisation";

export default function Sections() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getSections();
        setSections(data);
      } catch (error) {
        console.error("Erreur chargement sections:", error);
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
    if (confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) {
      try {
        await api.deleteSection(id);
        setSections(sections.filter(s => s.id !== id));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const filteredSections = sections.filter(s =>
    s.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.localite.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sections</h1>
          <p className="text-muted-foreground mt-1">Gestion des sections des coopératives ({sections.length})</p>
        </div>
        <Link to="/sections/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Section
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
        ) : filteredSections.map((section) => (
          <Card
            key={section.id}
            className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
            onClick={() => navigate(`/sections/${section.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                  <Layers className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{section.nom}</h3>
                      <p className="text-xs text-muted-foreground">{section.id_organisation}</p>
                    </div>
                    <Badge className={getStatusColor(section.statut)}>
                      {section.statut}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs mb-3">
                    <p className="text-muted-foreground">Président: {section.president_nom}</p>
                    <p className="text-muted-foreground">{section.localite}</p>
                    <p className="font-mono text-primary">{section.code}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Producteurs</p>
                      <p className="text-sm font-semibold text-foreground">{section.nb_producteurs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Précédent</p>
                      <p className="text-sm font-semibold text-foreground">{section.tonnage_c_precedente}T</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">En cours</p>
                      <p className="text-sm font-semibold text-foreground">{section.tonnage_c_cours}T</p>
                    </div>
                  </div>

                  {(section as any).agent_creation && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Créé par</p>
                      <p className="text-sm font-medium text-foreground">
                        {(section as any).agent_creation.nom} {(section as any).agent_creation.prenom} ({(section as any).agent_creation.code})
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
                        handleDelete(section.id);
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
