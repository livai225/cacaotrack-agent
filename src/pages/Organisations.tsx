import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Organisations() {
  const [searchQuery, setSearchQuery] = useState("");

  const organisations = [
    {
      id: "ORG-001",
      type: "Coopérative",
      nom: "SCOOP-CA Divo",
      region: "Lôh-Djiboua",
      departement: "Divo",
      localite: "Divo Centre",
      nombreProducteurs: 450,
      potentielProduction: 1250,
      status: "validé",
    },
    {
      id: "ORG-002",
      type: "Regroupement",
      nom: "Union des Planteurs de Gagnoa",
      region: "Gôh",
      departement: "Gagnoa",
      localite: "Gagnoa",
      nombreProducteurs: 320,
      potentielProduction: 890,
      status: "attente",
    },
    {
      id: "ORG-003",
      type: "Coopérative",
      nom: "COOPAGRI Lakota",
      region: "Lôh-Djiboua",
      departement: "Lakota",
      localite: "Lakota Centre",
      nombreProducteurs: 275,
      potentielProduction: 650,
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
          <h1 className="text-3xl font-bold text-foreground">Organisations</h1>
          <p className="text-muted-foreground mt-1">Gestion des coopératives et regroupements</p>
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
        {organisations.map((org) => (
          <Card key={org.id} className="shadow-card hover:shadow-elevated transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{org.nom}</h3>
                      <p className="text-xs text-muted-foreground">{org.type}</p>
                    </div>
                    <Badge className={getStatusColor(org.status)}>
                      {org.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>{org.departement}, {org.region}</p>
                    <p className="font-mono text-primary">{org.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Producteurs</p>
                      <p className="text-sm font-semibold text-foreground">{org.nombreProducteurs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Potentiel</p>
                      <p className="text-sm font-semibold text-foreground">{org.potentielProduction}T</p>
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
