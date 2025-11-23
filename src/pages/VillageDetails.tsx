import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, Users, Droplets, Zap, Stethoscope, GraduationCap, ShoppingBag, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { Village, Section } from "@/types/organisation";
import { useState, useEffect } from "react";

export default function VillageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [village, setVillage] = useState<Village | undefined>(undefined);
  const [section, setSection] = useState<Section | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        try {
            const data = await api.getVillage(id);
            setVillage(data);
            if (data && data.id_section) {
                const sec = await api.getSection(data.id_section);
                setSection(sec);
            }
        } catch (error) {
            console.error("Erreur chargement village:", error);
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

  if (!village) {
    return <div className="p-8 text-center">Village introuvable...</div>;
  }


  const InfoItem = ({ label, value }: { label: string, value: any }) => (
    <div className="flex justify-between items-center border-b pb-1 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/villages")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-200 text-amber-700">
            <Home className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{village.nom}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{village.type}</span>
              <span>•</span>
              <span>Section: {section?.nom || village.id_section}</span>
              <span>•</span>
              <Badge>{village.statut}</Badge>
            </div>
          </div>
        </div>
        <Button variant="outline">Modifier</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Démographie */}
        <Card>
           <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-600"/> Démographie</CardTitle></CardHeader>
           <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                 <p className="text-3xl font-bold text-blue-700">{village.nombre_habitants}</p>
                 <p className="text-xs text-blue-600 uppercase font-semibold">Habitants</p>
              </div>
              <div className="space-y-2">
                 <InfoItem label="Hommes" value={village.nombre_hommes} />
                 <InfoItem label="Femmes" value={village.nombre_femmes} />
                 <InfoItem label="Enfants Scolarisés" value={village.nombre_enfants_scolarises} />
              </div>
           </CardContent>
        </Card>

        {/* Infrastructures de Base */}
        <Card>
           <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-600"/> Infrastructures</CardTitle></CardHeader>
           <CardContent className="space-y-6">
              <div>
                 <h4 className="text-sm font-semibold flex items-center gap-2 mb-2"><Droplets className="h-4 w-4 text-cyan-600"/> Eau</h4>
                 <div className="flex flex-wrap gap-2">
                    {village.eau_courante && <Badge variant="secondary">Eau Courante</Badge>}
                    {village.pompe_hydraulique && <Badge variant="secondary">Pompe</Badge>}
                    {village.puits && <Badge variant="outline">Puits</Badge>}
                    {village.riviere_marigot && <Badge variant="destructive">Rivière</Badge>}
                 </div>
              </div>
              <div>
                 <h4 className="text-sm font-semibold flex items-center gap-2 mb-2"><Zap className="h-4 w-4 text-yellow-600"/> Électricité</h4>
                 <div className="flex flex-wrap gap-2">
                    {village.electricite_reseau && <Badge variant="secondary">Réseau</Badge>}
                    {village.electricite_solaire && <Badge variant="secondary">Solaire</Badge>}
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Services Sociaux */}
        <Card>
           <CardHeader><CardTitle className="flex items-center gap-2"><Stethoscope className="h-5 w-5 text-red-600"/> Services Sociaux</CardTitle></CardHeader>
           <CardContent className="space-y-6">
              <div>
                 <h4 className="text-sm font-semibold flex items-center gap-2 mb-2"><Stethoscope className="h-4 w-4 text-red-500"/> Santé</h4>
                 <div className="space-y-1">
                    <InfoItem label="Dispensaire" value={village.dispensaire ? "Oui" : "Non"} />
                    <InfoItem label="Pharmacie" value={village.pharmacie ? "Oui" : "Non"} />
                 </div>
              </div>
              <div>
                 <h4 className="text-sm font-semibold flex items-center gap-2 mb-2"><GraduationCap className="h-4 w-4 text-indigo-500"/> Éducation</h4>
                 <div className="space-y-1">
                    <InfoItem label="École Primaire" value={village.ecole_primaire ? "Oui" : "Non"} />
                    <InfoItem label="Collège / Lycée" value={village.college_lycee ? "Oui" : "Non"} />
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Activités Economiques */}
        <Card className="md:col-span-2">
           <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-emerald-600"/> Économie Locale</CardTitle></CardHeader>
           <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h4 className="font-semibold mb-2">Cultures</h4>
                    <div className="flex flex-wrap gap-2">
                       {village.culture_cacao && <Badge className="bg-emerald-600">Cacao</Badge>}
                       {village.culture_cafe && <Badge className="bg-emerald-600">Café</Badge>}
                       {village.culture_hevea && <Badge className="bg-emerald-600">Hévéa</Badge>}
                       {village.culture_palmier && <Badge className="bg-emerald-600">Palmier</Badge>}
                       {village.culture_riz && <Badge variant="outline">Riz</Badge>}
                       {village.culture_mais && <Badge variant="outline">Maïs</Badge>}
                    </div>
                 </div>
                 <div>
                    <h4 className="font-semibold mb-2">Services Financiers</h4>
                    <div className="flex flex-wrap gap-2">
                       {village.om_orange && <Badge variant="secondary" className="bg-orange-100 text-orange-800">Orange Money</Badge>}
                       {village.momo_mtn && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">MTN Momo</Badge>}
                       {village.flooz_moov && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Moov Flooz</Badge>}
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>

      </div>
    </div>
  );
}
