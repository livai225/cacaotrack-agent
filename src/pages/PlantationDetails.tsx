import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trees, MapPin, Sprout, AlertTriangle, Info, FlaskConical, Tractor, DollarSign, User, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { Parcelle, Producteur } from "@/types/organisation";
import { useState, useEffect } from "react";

export default function PlantationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcelle, setParcelle] = useState<Parcelle | undefined>(undefined);
  const [producteur, setProducteur] = useState<Producteur | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        try {
            const data = await api.getParcelle(id);
            setParcelle(data);
            if (data && data.id_producteur) {
                const prod = await api.getProducteur(data.id_producteur);
                setProducteur(prod);
            }
        } catch (error) {
            console.error("Erreur chargement plantation:", error);
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

  if (!parcelle) {
    return <div className="p-8 text-center">Plantation introuvable...</div>;
  }


  const InfoItem = ({ label, value, sub }: { label: string, value: string | number | undefined | null, sub?: string }) => (
    <div className="p-3 bg-muted/20 rounded-md border border-muted/30">
      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">{label}</p>
      <p className="text-lg font-bold text-foreground">{value || 'N/A'}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/plantations")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200 text-green-700">
            <Trees className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Plantation {parcelle.code}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> {producteur?.nom_complet || parcelle.id_producteur}</span>
              <span>•</span>
              <Badge variant={parcelle.statut === 'active' ? 'default' : 'secondary'}>{parcelle.statut}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/plantations/carte`)}>Voir sur la Carte</Button>
            <Button variant="outline">Modifier</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Infos Générales & Géographie */}
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Caractéristiques</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoItem label="Superficie Déclarée" value={`${parcelle.superficie_declaree} Ha`} />
                        <InfoItem label="Superficie GPS" value={`${parcelle.superficie_reelle || '-'} Ha`} />
                        <InfoItem label="Âge Plantation" value={`${parcelle.age_plantation} ans`} />
                        <InfoItem label="Distance Magasin" value={`${parcelle.distance_magasin || '-'} km`} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-500"/> Géolocalisation</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded text-center font-mono text-sm">
                        Lat: {parcelle.latitude || 'N/A'} | Lon: {parcelle.longitude || 'N/A'}
                    </div>
                    {/* Placeholder Carte Statique */}
                    <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center text-muted-foreground">
                        Aperçu Carte Mini
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Col 2: Agronomie & Maladies */}
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-orange-500"/> État Sanitaire</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 rounded bg-red-50 border border-red-100">
                            <span className="font-medium text-red-900">Swollen Shoot</span>
                            <Badge variant={parcelle.maladie_swollen_shoot === 'Inexistant' ? 'outline' : 'destructive'}>{parcelle.maladie_swollen_shoot}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-orange-50 border border-orange-100">
                            <span className="font-medium text-orange-900">Pourriture Brune</span>
                            <Badge variant={parcelle.maladie_pourriture_brune === 'Inexistant' ? 'outline' : 'secondary'} className={parcelle.maladie_pourriture_brune !== 'Inexistant' ? 'bg-orange-500 hover:bg-orange-600' : ''}>{parcelle.maladie_pourriture_brune}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-yellow-50 border border-yellow-100">
                            <span className="font-medium text-yellow-900">Parasites / Insectes</span>
                            <Badge variant="outline">{parcelle.maladie_parasites}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><FlaskConical className="h-5 w-5 text-purple-500"/> Intrants</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Engrais:</span> <div className="font-medium">{parcelle.engrais}</div></div>
                    <div><span className="text-muted-foreground">Pesticides:</span> <div className="font-medium">{parcelle.pesticides}</div></div>
                    <div><span className="text-muted-foreground">Fongicides:</span> <div className="font-medium">{parcelle.fongicides}</div></div>
                    <div><span className="text-muted-foreground">Herbicides:</span> <div className="font-medium">{parcelle.herbicides}</div></div>
                </CardContent>
            </Card>
        </div>

        {/* Col 3: Pratiques & Équipements */}
        <div className="space-y-6">
             <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Tractor className="h-5 w-5 text-green-600"/> Pratiques & Équipements</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Équipements Protection (EPI)</h4>
                        <div className="flex flex-wrap gap-2">
                            {parcelle.equipement_bottes && <Badge variant="secondary">Bottes</Badge>}
                            {parcelle.equipement_combinaison && <Badge variant="secondary">Combinaison</Badge>}
                            {parcelle.equipement_gants && <Badge variant="secondary">Gants</Badge>}
                            {parcelle.equipement_lunettes && <Badge variant="secondary">Lunettes</Badge>}
                            {parcelle.equipement_masque && <Badge variant="secondary">Masque</Badge>}
                            {!parcelle.equipement_bottes && !parcelle.equipement_combinaison && <span className="text-sm text-muted-foreground italic">Aucun EPI déclaré</span>}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Séchage</h4>
                        <div className="flex flex-wrap gap-2">
                             {parcelle.sechage_claie_hauteur && <Badge variant="outline">Claies Hautes</Badge>}
                             {parcelle.sechage_ciment && <Badge variant="outline">Ciment</Badge>}
                             {parcelle.sechage_claie_sol && <Badge variant="destructive">Sol (Claies)</Badge>}
                             {parcelle.sechage_plastique_sol && <Badge variant="destructive">Plastique Sol</Badge>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-600"/> Commercialisation</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span>Coopérative</span>
                        {parcelle.comm_coop ? <Badge className="bg-emerald-600">Oui</Badge> : <Badge variant="outline">Non</Badge>}
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span>Pisteurs</span>
                        {parcelle.comm_pisteur ? <Badge variant="destructive">Oui</Badge> : <Badge variant="outline">Non</Badge>}
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Autres Acheteurs</span>
                        {parcelle.comm_autre_acheteur ? <Badge variant="secondary">Oui</Badge> : <Badge variant="outline">Non</Badge>}
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
