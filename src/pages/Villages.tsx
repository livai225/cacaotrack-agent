import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Villages() {
  const [searchQuery, setSearchQuery] = useState("");

  const villages = [
    {
      id: "VIL-045",
      nom: "Divo-Centre",
      localite: "Divo",
      chefNom: "Kouassi Yao",
      nombreHabitants: 850,
      nombreHommes: 380,
      nombreFemmes: 470,
      enfantsScolarises: 245,
      acces_eau: true,
      status: "validé",
    },
    {
      id: "VIL-046",
      nom: "Campement N'Zikro",
      localite: "Gagnoa",
      chefNom: "Bamba Ibrahim",
      nombreHabitants: 420,
      nombreHommes: 190,
      nombreFemmes: 230,
      enfantsScolarises: 110,
      acces_eau: false,
      status: "attente",
    },
    {
      id: "VIL-047",
      nom: "Lakota Village",
      localite: "Lakota",
      chefNom: "N'Guessan Kouadio",
      nombreHabitants: 650,
      nombreHommes: 300,
      nombreFemmes: 350,
      enfantsScolarises: 180,
      acces_eau: true,
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
          <h1 className="text-3xl font-bold text-foreground">Villages & Campements</h1>
          <p className="text-muted-foreground mt-1">Gestion des villages et campements</p>
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
        {villages.map((village) => (
          <Card key={village.id} className="shadow-card hover:shadow-elevated transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{village.nom}</h3>
                      <p className="text-xs text-muted-foreground">{village.localite}</p>
                    </div>
                    <Badge className={getStatusColor(village.status)}>
                      {village.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs mb-3">
                    <p className="text-muted-foreground">Chef: {village.chefNom}</p>
                    <p className="font-mono text-primary">{village.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Habitants</p>
                      <p className="text-sm font-semibold text-foreground">{village.nombreHabitants}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Scolarisés</p>
                      <p className="text-sm font-semibold text-foreground">{village.enfantsScolarises}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hommes</p>
                      <p className="text-sm font-semibold text-foreground">{village.nombreHommes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Femmes</p>
                      <p className="text-sm font-semibold text-foreground">{village.nombreFemmes}</p>
                    </div>
                  </div>

                  {village.acces_eau && (
                    <Badge variant="outline" className="mt-3 text-xs border-success text-success">
                      Accès eau
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
