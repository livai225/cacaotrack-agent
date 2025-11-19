import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Operations() {
  const navigate = useNavigate();
  
  const operations = [
    {
      code: "OP-2024-0456",
      producteur: "Kouassi Jean",
      plantation: "PROD-0287-P1",
      loyaute: 85,
      date: "12/11/2024",
      status: "complète",
    },
    {
      code: "OP-2024-0457",
      producteur: "Koné Marie",
      plantation: "PROD-0288-P1",
      loyaute: 73,
      date: "11/11/2024",
      status: "en cours",
    },
    {
      code: "OP-2024-0458",
      producteur: "Yao Kouadio",
      plantation: "PROD-0289-P1",
      loyaute: 92,
      date: "10/11/2024",
      status: "complète",
    },
  ];

  const getLoyauteBadge = (loyaute: number) => {
    if (loyaute >= 80) return { text: "Excellent", className: "bg-success text-success-foreground" };
    if (loyaute >= 60) return { text: "Bon", className: "bg-warning text-warning-foreground" };
    return { text: "À améliorer", className: "bg-destructive text-destructive-foreground" };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opérations de Collecte</h1>
          <p className="text-muted-foreground mt-1">Suivi des opérations terrain</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/operations/nouveau")}>
          <Plus className="h-4 w-4" />
          Nouvelle Opération
        </Button>
      </div>

      <div className="space-y-4">
        {operations.map((operation) => {
          const loyauteBadge = getLoyauteBadge(operation.loyaute);
          return (
            <Card key={operation.code} className="shadow-card hover:shadow-elevated transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{operation.code}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {operation.producteur} • {operation.plantation}
                    </p>
                  </div>
                  <Badge variant={operation.status === "complète" ? "default" : "outline"}>
                    {operation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{operation.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Loyauté</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-foreground">{operation.loyaute}%</span>
                      <Badge className={loyauteBadge.className}>
                        {loyauteBadge.text}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
