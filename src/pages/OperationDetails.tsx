import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, Scale, Banknote, Calendar, CheckCircle2, Timer, Leaf, Box, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { Operation, Producteur, Parcelle } from "@/types/organisation";
import { useState, useEffect } from "react";

export default function OperationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [operation, setOperation] = useState<Operation | undefined>(undefined);
  const [producteur, setProducteur] = useState<Producteur | undefined>(undefined);
  const [parcelle, setParcelle] = useState<Parcelle | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        try {
            const data = await api.getOperation(id);
            setOperation(data);
            if (data) {
                if (data.id_producteur) {
                    const prod = await api.getProducteur(data.id_producteur);
                    setProducteur(prod);
                }
                if (data.id_parcelle) {
                    const parc = await api.getParcelle(data.id_parcelle);
                    setParcelle(parc);
                }
            }
        } catch (error) {
            console.error("Erreur chargement operation:", error);
        } finally {
            setIsLoading(false);
        }
      };
      loadData();
    }
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!operation) {
    return <div className="p-8 text-center">Operation introuvable...</div>;
  }


  const StepCard = ({ title, icon: Icon, date, details }: { title: string, icon: any, date: Date | undefined, details: React.ReactNode }) => (
    <Card className={`border-l-4 ${date ? 'border-l-green-500' : 'border-l-gray-200'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className={`h-5 w-5 ${date ? 'text-primary' : 'text-muted-foreground'}`} />
            {title}
          </CardTitle>
          {date && <Badge variant="outline" className="text-xs">{new Date(date).toLocaleDateString()}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        {details}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/operations")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Opération #{operation.id.slice(-6)}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <span className="font-medium text-foreground">{producteur?.nom_complet || operation.id_producteur}</span>
              <span>•</span>
              <span>Plantation {parcelle?.code || operation.id_parcelle}</span>
              <span>•</span>
              <Badge className={operation.statut === 'Payé' ? 'bg-green-600 hover:bg-green-700' : ''}>{operation.statut}</Badge>
            </div>
          </div>
        </div>
        <Button variant="outline">Imprimer Reçu</Button>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <StepCard 
          title="Récolte" 
          icon={Leaf} 
          date={operation.date_recolte_1} 
          details={
            <>
              <div>Début: {new Date(operation.date_recolte_1).toLocaleDateString()}</div>
            </>
          } 
        />

        <StepCard 
          title="Ecabossage" 
          icon={Timer} 
          date={operation.date_ecabossage} 
          details={
            <>
               <div>Durée: {operation.ecabossage_duree}</div>
               <div>Coût: {operation.cout_ecabossage} FCFA</div>
            </>
          } 
        />

        <StepCard 
          title="Fermentation" 
          icon={Box} 
          date={operation.fermentation_debut} 
          details={
            <>
               <div>Fin: {new Date(operation.fermentation_fin).toLocaleDateString()}</div>
               <div>Matériel: {operation.materiel_feuilles ? 'Feuilles' : ''} {operation.materiel_caisses ? 'Caisses' : ''}</div>
            </>
          } 
        />

        <StepCard 
          title="Séchage" 
          icon={Calendar} 
          date={operation.sechage_debut} 
          details={
            <>
               <div>Fin: {new Date(operation.sechage_fin).toLocaleDateString()}</div>
               <div>Méthode: {operation.aire_claie_bambou ? 'Claies Bambou' : 'Autre'}</div>
            </>
          } 
        />

        <StepCard 
          title="Ensachage & Transport" 
          icon={Truck} 
          date={operation.ensachage_debut} 
          details={
            <>
               <div>Sacs Brousse: <b>{operation.nb_sacs_brousse}</b></div>
               <div>Poids Estimatif: <b>{operation.poids_estimatif} Kg</b></div>
            </>
          } 
        />

        <StepCard 
          title="Pesée & Validation" 
          icon={Scale} 
          date={operation.date_livraison} 
          details={
            <>
               <div>Poids Net: <b className="text-green-600 text-lg">{operation.manutention_pesee} Kg</b></div>
               <div>Statut: <Badge variant="outline">{operation.validation_statut}</Badge></div>
            </>
          } 
        />

      </div>

      {/* Section Paiement */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Banknote className="h-6 w-6" />
            Paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
               <p className="text-sm text-muted-foreground uppercase font-bold">Montant Total</p>
               <p className="text-3xl font-bold text-green-700">{(operation.montant_cheque || 0) + (operation.montant_especes || 0)} FCFA</p>
            </div>
            <div>
               <p className="text-sm text-muted-foreground uppercase font-bold">Mode de Paiement</p>
               <div className="mt-1">
                 {operation.paiement_cheque && <Badge variant="secondary" className="mr-2">Chèque</Badge>}
                 {operation.paiement_especes && <Badge variant="secondary">Espèces</Badge>}
               </div>
               {operation.numero_cheque && <p className="text-sm mt-1">N° {operation.numero_cheque} ({operation.banque})</p>}
            </div>
            <div>
               <p className="text-sm text-muted-foreground uppercase font-bold">Retenues</p>
               <ul className="text-sm mt-1 space-y-1">
                 {operation.retenue_mec && <li>MEC: -{operation.retenue_mec_taux} FCFA</li>}
                 {operation.retenue_epargne && <li>Epargne: -{operation.retenue_epargne_taux} FCFA</li>}
               </ul>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
