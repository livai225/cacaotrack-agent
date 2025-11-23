import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Scale, Truck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Operation } from "@/types/organisation";
import { useState, useEffect } from "react";

export default function Operations() {
  const navigate = useNavigate();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getOperations();
        setOperations(data);
      } catch (error) {
        console.error("Erreur chargement operations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opérations de Collecte</h1>
          <p className="text-muted-foreground mt-1">Suivi des opérations terrain ({operations.length})</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/operations/nouveau")}>
          <Plus className="h-4 w-4" />
          Nouvelle Opération
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : operations.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed rounded-lg">
             <p className="text-muted-foreground">Aucune opération enregistrée.</p>
          </div>
        ) : (
          operations.map((operation) => (
            <Card 
              key={operation.id} 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer"
              onClick={() => navigate(`/operations/${operation.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Opération #{operation.id.slice(-6)}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Producteur: {operation.id_producteur} • Plantation: {operation.id_parcelle}
                    </p>
                  </div>
                  <Badge className={operation.statut === "Payé" ? "bg-green-600" : "bg-blue-600"}>
                    {operation.statut}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(operation.date_creation).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Scale className="h-4 w-4" />
                        <span>{operation.manutention_pesee} Kg</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-muted px-3 py-1 rounded text-sm font-mono">
                        {operation.montant_cheque ? 'Chèque' : 'Espèces'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

