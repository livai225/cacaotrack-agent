import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building, Truck, Scale, Users, ShoppingCart, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { Section } from "@/types/organisation";
import { useState, useEffect } from "react";

export default function SectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        try {
          const data = await api.getSection(id);
          setSection(data);
        } catch (error) {
          console.error("Erreur chargement section:", error);
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

  if (!section) {
    return <div className="p-8 text-center">Section introuvable...</div>;
  }


  const ContactItem = ({ role, nom, contact }: { role: string, nom: string, contact: string[] }) => (
    <div className="flex justify-between items-center p-2 rounded bg-muted/10">
        <div>
            <p className="text-xs uppercase font-semibold text-muted-foreground">{role}</p>
            <p className="font-medium">{nom}</p>
        </div>
        <Badge variant="outline">{contact[0]}</Badge>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/sections")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{section.nom}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-mono">{section.code}</span>
              <span>•</span>
              <span>{section.localite}</span>
              <span>•</span>
              <Badge>{section.statut}</Badge>
            </div>
          </div>
        </div>
        <Button variant="outline">Modifier</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Equipe */}
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-600"/> Équipe & Personnel</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <ContactItem role="Président" nom={section.president_nom} contact={section.president_contact} />
                <ContactItem role="Secrétaire" nom={section.secretaire_nom} contact={section.secretaire_contact} />
                <ContactItem role="Magasinier" nom={section.magasinier_nom} contact={section.magasinier_contact} />
                <ContactItem role="Peseur" nom={section.peseur_nom} contact={section.peseur_contact} />
            </CardContent>
        </Card>

        {/* Equipements */}
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-orange-600"/> Logistique & Matériel</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-sm font-semibold mb-2">Véhicules</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>Camionnettes</span> <b>{section.vehicule_camionnette_nombre}</b></div>
                        <div className="flex justify-between"><span>Tricycles</span> <b>{section.vehicule_tricycle_nombre}</b></div>
                        <div className="flex justify-between"><span>Motos</span> <b>{section.vehicule_moto_nombre}</b></div>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-semibold mb-2">Pesage & Qualité</h4>
                    <div className="flex flex-wrap gap-2">
                        {section.materiel_bascule && <Badge variant="secondary">Bascule</Badge>}
                        {section.materiel_dickey_john && <Badge variant="secondary">Dickey John</Badge>}
                        {section.materiel_sondes && <Badge variant="secondary">Sondes</Badge>}
                        {section.materiel_couteaux && <Badge variant="secondary">Couteaux</Badge>}
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Performance */}
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5 text-green-600"/> Performance & Production</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded text-center">
                    <p className="text-3xl font-bold text-green-700">{section.tonnage_c_cours} T</p>
                    <p className="text-xs text-green-800 uppercase font-bold">Production Campagne</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-2 bg-muted/30 rounded">
                        <p className="text-xl font-bold">{section.nb_producteurs}</p>
                        <p className="text-xs text-muted-foreground">Producteurs</p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                        <p className="text-xl font-bold">{section.tonnage_potentiel} T</p>
                        <p className="text-xs text-muted-foreground">Potentiel</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Commercialisation */}
        <Card className="md:col-span-3">
            <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-purple-600"/> Circuits de Commercialisation</CardTitle></CardHeader>
            <CardContent className="flex gap-4">
                {section.comm_coop && <Badge className="text-sm py-1 bg-purple-600">Coopérative</Badge>}
                {section.comm_pisteur && <Badge variant="outline" className="text-sm py-1">Pisteurs</Badge>}
                {section.comm_autre_coop && <Badge variant="outline" className="text-sm py-1">Autres Coops</Badge>}
                {!section.comm_coop && !section.comm_pisteur && !section.comm_autre_coop && <span className="text-muted-foreground italic">Aucun circuit déclaré</span>}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
