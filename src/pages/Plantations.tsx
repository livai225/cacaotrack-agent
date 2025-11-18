import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin } from "lucide-react";

export default function Plantations() {
  const plantations = [
    {
      code: "PROD-0287-P1",
      producteur: "Kouassi Jean",
      superficie: "2.5 ha",
      age: "8 ans",
      distance: "3.2 km",
    },
    {
      code: "PROD-0287-P2",
      producteur: "Kouassi Jean",
      superficie: "1.8 ha",
      age: "5 ans",
      distance: "4.1 km",
    },
    {
      code: "PROD-0288-P1",
      producteur: "Koné Marie",
      superficie: "3.2 ha",
      age: "12 ans",
      distance: "2.8 km",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plantations</h1>
          <p className="text-muted-foreground mt-1">Gestion des plantations de cacao</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Plantation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plantations.map((plantation) => (
          <Card key={plantation.code} className="shadow-card hover:shadow-elevated transition-all cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{plantation.code}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{plantation.producteur}</p>
                </div>
                <MapPin className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Superficie</span>
                <span className="font-medium text-foreground">{plantation.superficie}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Âge</span>
                <span className="font-medium text-foreground">{plantation.age}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Distance</span>
                <span className="font-medium text-foreground">{plantation.distance}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
