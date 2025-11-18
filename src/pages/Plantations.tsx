import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Trees, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Plantations() {
  const [searchQuery, setSearchQuery] = useState("");

  const plantations = [
    {
      id: "PROD-0287-P1",
      producteur: "Kouassi Jean",
      superficieDeclaree: 5.2,
      superficieReelle: 4.8,
      age: 15,
      distanceMagasin: 3.5,
      latitude: 5.8374,
      longitude: -5.3579,
      maladies: {
        pourritureBrune: 2,
        swollenShoot: 1,
      },
      status: "validé",
    },
    {
      id: "PROD-0288-P1",
      producteur: "Koné Marie",
      superficieDeclaree: 3.8,
      superficieReelle: 3.5,
      age: 8,
      distanceMagasin: 2.1,
      latitude: 6.1234,
      longitude: -5.9456,
      maladies: {
        pourritureBrune: 1,
        swollenShoot: 0,
      },
      status: "attente",
    },
    {
      id: "PROD-0289-P1",
      producteur: "Yao Kouadio",
      superficieDeclaree: 7.5,
      superficieReelle: 7.2,
      age: 22,
      distanceMagasin: 5.8,
      latitude: 5.9876,
      longitude: -5.6543,
      maladies: {
        pourritureBrune: 3,
        swollenShoot: 2,
      },
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
          <h1 className="text-3xl font-bold text-foreground">Plantations</h1>
          <p className="text-muted-foreground mt-1">Gestion des plantations de cacao</p>
        </div>
        <Link to="/plantations/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Plantation
          </Button>
        </Link>
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
        {plantations.map((plantation) => (
          <Card key={plantation.id} className="shadow-card hover:shadow-elevated transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <Trees className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{plantation.id}</h3>
                      <p className="text-xs text-muted-foreground">{plantation.producteur}</p>
                    </div>
                    <Badge className={getStatusColor(plantation.status)}>
                      {plantation.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Déclarée</p>
                      <p className="text-sm font-semibold text-foreground">{plantation.superficieDeclaree} ha</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Réelle</p>
                      <p className="text-sm font-semibold text-foreground">{plantation.superficieReelle} ha</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Âge</p>
                      <p className="text-sm font-semibold text-foreground">{plantation.age} ans</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="text-sm font-semibold text-foreground">{plantation.distanceMagasin} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">
                      {plantation.latitude.toFixed(4)}, {plantation.longitude.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {plantation.maladies.pourritureBrune > 0 && (
                      <Badge variant="outline" className="text-xs border-warning text-warning">
                        Pourr. brune ({plantation.maladies.pourritureBrune})
                      </Badge>
                    )}
                    {plantation.maladies.swollenShoot > 0 && (
                      <Badge variant="outline" className="text-xs border-destructive text-destructive">
                        Swollen ({plantation.maladies.swollenShoot})
                      </Badge>
                    )}
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
