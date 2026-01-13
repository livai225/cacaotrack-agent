import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, MapPin, Building, Calendar, Briefcase, HeartPulse, Home, Zap, Droplets, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { Producteur } from "@/types/organisation";
import { useState, useEffect } from "react";
import { calculateAge } from "@/utils/codification";

export default function ProducteurDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producteur, setProducteur] = useState<Producteur | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        try {
          const data = await api.getProducteur(id);
          setProducteur(data);
        } catch (error) {
          console.error("Erreur chargement producteur:", error);
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

  if (!producteur) {
    return <div className="p-8 text-center">Producteur introuvable...</div>;
  }


  const age = calculateAge(producteur.date_naissance);

  const InfoItem = ({ icon: Icon, label, value, sub }: { icon: any, label: string, value: string | number | undefined | null, sub?: string }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
      <div className="p-2 bg-primary/10 rounded-full text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="font-semibold text-foreground">{value || 'N/A'}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary border-b pb-2">
      <Icon className="h-5 w-5" />
      {title}
    </h3>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/producteurs")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <img
              src={producteur.photo_planteur || `https://api.dicebear.com/7.x/avataaars/svg?seed=${producteur.nom_complet}`}
              alt={producteur.nom_complet}
              className="w-20 h-20 rounded-full border-4 border-background shadow-lg bg-white"
            />
            <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${producteur.statut === 'actif' ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{producteur.nom_complet}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="outline" className="font-mono bg-muted">{producteur.code}</Badge>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {producteur.lieu_naissance}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/producteurs/${id}/edit`)}>Modifier</Button>
          <Button variant="destructive">Archiver</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Colonne Gauche: Identité & Localisation */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Identité</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <InfoItem icon={User} label="Âge" value={`${age} ans`} sub={`Né le ${new Date(producteur.date_naissance).toLocaleDateString()}`} />
              <InfoItem icon={MapPin} label="Lieu de Naissance" value={producteur.lieu_naissance} />
              {/* Note: telephones n'est pas dans l'interface seed actuelle, à ajouter si besoin */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Localisation</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <InfoItem icon={Building} label="Organisation" value={producteur.id_organisation} sub="Code ORG" />
              <InfoItem icon={MapPin} label="Section" value={producteur.id_section} sub="Code SEC" />
              <InfoItem icon={Home} label="Village" value={producteur.id_village} sub="Code VIL" />
            </CardContent>
          </Card>
        </div>

        {/* Colonne Centrale: Ménage & Social */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Ménage & Famille</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <span className="block text-3xl font-bold text-blue-600">{producteur.nb_enfants}</span>
                <span className="text-xs text-blue-800 font-semibold uppercase">Enfants</span>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <span className="block text-3xl font-bold text-green-600">{producteur.nb_enfants_scolarises}</span>
                <span className="text-xs text-green-800 font-semibold uppercase">Scolarisés</span>
              </div>
              <div className="col-span-2 space-y-2 mt-2">
                <div className="flex justify-between text-sm border-b pb-1"><span>Filles</span> <span className="font-bold">{producteur.nb_filles}</span></div>
                <div className="flex justify-between text-sm border-b pb-1"><span>Garçons</span> <span className="font-bold">{producteur.nb_garcons}</span></div>
                <div className="flex justify-between text-sm border-b pb-1"><span>Moins de 5 ans</span> <span className="font-bold">{producteur.nb_moins_5_ans}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Conditions de Vie</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Droplets className="h-4 w-4 text-cyan-500" /> Accès à l'Eau</h4>
                <div className="flex flex-wrap gap-2">
                  {producteur.eau_courante && <Badge variant="secondary">Eau Courante</Badge>}
                  {producteur.pompe_hydraulique && <Badge variant="secondary">Pompe Hydraulique</Badge>}
                  {producteur.puits && <Badge variant="secondary">Puits</Badge>}
                  {producteur.riviere_marigot && <Badge variant="destructive">Rivière / Marigot</Badge>}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-500" /> Électricité</h4>
                <div className="flex flex-wrap gap-2">
                  {producteur.electricite_reseau && <Badge variant="secondary">Réseau</Badge>}
                  {producteur.electricite_solaire && <Badge variant="secondary">Solaire</Badge>}
                  {producteur.electricite_lampe && <Badge variant="outline">Lampe</Badge>}
                  {producteur.electricite_aucun && <Badge variant="destructive">Aucun</Badge>}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Home className="h-4 w-4 text-orange-500" /> Habitat</h4>
                <div className="text-sm grid grid-cols-2 gap-2">
                  <div className="bg-muted p-2 rounded">Mur: <b>{producteur.materiaux_mur}</b></div>
                  <div className="bg-muted p-2 rounded">Toit: <b>{producteur.toiture}</b></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne Droite: Production & Finances */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader><CardTitle className="text-primary">Production Cacao</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded shadow-sm">
                <span className="text-muted-foreground">Plantations</span>
                <span className="text-xl font-bold">{producteur.cacao_nb_plantations}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded shadow-sm">
                <span className="text-muted-foreground">Superficie Totale</span>
                <span className="text-xl font-bold">{producteur.cacao_superficie} Ha</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded shadow-sm">
                <span className="text-muted-foreground">Dernière Récolte</span>
                <span className="text-xl font-bold text-green-600">{producteur.cacao_production} T</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Inclusion Financière</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Compte Bancaire</span> {producteur.interet_compte_bancaire ? <Badge className="bg-green-500">Oui</Badge> : <Badge variant="outline">Non</Badge>}</div>
                <div className="flex justify-between text-sm"><span>Épargne</span> {producteur.interet_epargne ? <Badge className="bg-green-500">Oui</Badge> : <Badge variant="outline">Non</Badge>}</div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs font-semibold mb-2 uppercase text-muted-foreground">Moyens de Paiement</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between"><span>Mobile Money</span> <b>{producteur.usage_mobile_money}</b></div>
                  <div className="flex justify-between"><span>Espèces</span> <b>{producteur.usage_especes}</b></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations système */}
          {(producteur as any).agent_creation && (
            <Card>
              <CardHeader><CardTitle>Informations Système</CardTitle></CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Créé par</span>
                  <b className="text-sm">{(producteur as any).agent_creation.nom} {(producteur as any).agent_creation.prenom} ({(producteur as any).agent_creation.code})</b>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
