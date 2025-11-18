import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Producteurs() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const producteurs = [
    {
      id: "ORG-001-SEC-012-VIL-045-PROD-0287",
      nom: "Kouassi",
      prenom: "Jean",
      village: "Divo",
      status: "validé",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
    },
    {
      id: "ORG-001-SEC-012-VIL-045-PROD-0288",
      nom: "Koné",
      prenom: "Marie",
      village: "Divo",
      status: "attente",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    },
    {
      id: "ORG-001-SEC-012-VIL-046-PROD-0289",
      nom: "Yao",
      prenom: "Kouadio",
      village: "Gagnoa",
      status: "rejeté",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kouadio",
    },
    {
      id: "ORG-001-SEC-012-VIL-046-PROD-0290",
      nom: "Bamba",
      prenom: "Fatou",
      village: "Gagnoa",
      status: "validé",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatou",
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
          <h1 className="text-3xl font-bold text-foreground">Producteurs</h1>
          <p className="text-muted-foreground mt-1">Gestion des producteurs de cacao</p>
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
            placeholder="Rechercher par nom, prénom ou code..."
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {producteurs.map((producteur) => (
          <Card key={producteur.id} className="shadow-card hover:shadow-elevated transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={producteur.photo}
                  alt={`${producteur.prenom} ${producteur.nom}`}
                  className="w-16 h-16 rounded-full bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {producteur.prenom} {producteur.nom}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{producteur.village}</p>
                    </div>
                    <Badge className={getStatusColor(producteur.status)}>
                      {producteur.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-mono truncate">
                    {producteur.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
