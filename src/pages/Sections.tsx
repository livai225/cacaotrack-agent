import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sections() {
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    {
      id: "SEC-012",
      nom: "Section Divo Nord",
      localite: "Divo",
      organisation: "SCOOP-CA Divo",
      presidentNom: "Koné Brahima",
      nombreProducteurs: 156,
      tonnagePrecedent: 450,
      tonnageEnCours: 520,
      status: "validé",
    },
    {
      id: "SEC-013",
      nom: "Section Gagnoa Sud",
      localite: "Gagnoa",
      organisation: "Union des Planteurs",
      presidentNom: "Ouattara Seydou",
      nombreProducteurs: 128,
      tonnagePrecedent: 380,
      tonnageEnCours: 410,
      status: "attente",
    },
    {
      id: "SEC-014",
      nom: "Section Lakota Est",
      localite: "Lakota",
      organisation: "COOPAGRI Lakota",
      presidentNom: "Yao N'Dri",
      nombreProducteurs: 92,
      tonnagePrecedent: 275,
      tonnageEnCours: 310,
      status: "validé",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validé":
        return "bg-success text-success-foreground";
      case "attente":
        return "bg-warning text-warning-foreground";
      case "rejeté":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sections</h1>
          <p className="text-muted-foreground mt-1">Gestion des sections des coopératives</p>
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
        {sections.map((section) => (
          <Card key={section.id} className="shadow-card hover:shadow-elevated transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Layers className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{section.nom}</h3>
                      <p className="text-xs text-muted-foreground">{section.organisation}</p>
                    </div>
                    <Badge className={getStatusColor(section.status)}>
                      {section.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs mb-3">
                    <p className="text-muted-foreground">Président: {section.presidentNom}</p>
                    <p className="text-muted-foreground">{section.localite}</p>
                    <p className="font-mono text-primary">{section.id}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Producteurs</p>
                      <p className="text-sm font-semibold text-foreground">{section.nombreProducteurs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Précédent</p>
                      <p className="text-sm font-semibold text-foreground">{section.tonnagePrecedent}T</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">En cours</p>
                      <p className="text-sm font-semibold text-foreground">{section.tonnageEnCours}T</p>
                    </div>
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
