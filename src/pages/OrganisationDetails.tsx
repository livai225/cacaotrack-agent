import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { Organisation } from "@/types/organisation";
import { useState, useEffect } from "react";

export default function OrganisationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState<Organisation | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        try {
          const data = await api.getOrganisation(id);
          setOrg(data);
        } catch (error) {
          console.error("Erreur chargement organisation:", error);
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

  if (!org) {
    return <div className="p-8 text-center">Organisation introuvable...</div>;
  }


  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/organisations")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-primary">
            <Building2 className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{org.nom}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Badge variant="outline">{org.code}</Badge>
              <span>•</span>
              <span>{org.type}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {org.siege_social || org.localite}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/organisations/${org.id}/membres`)}>Gérer Membres</Button>
            <Button variant="outline">Modifier</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <Card>
           <CardContent className="p-4 flex flex-col items-center justify-center text-center">
             <span className="text-3xl font-bold text-primary">{org.stats?.nbSections || 0}</span>
             <span className="text-sm text-muted-foreground">Sections</span>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4 flex flex-col items-center justify-center text-center">
             <span className="text-3xl font-bold text-primary">{org.stats?.nbVillages || 0}</span>
             <span className="text-sm text-muted-foreground">Villages</span>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4 flex flex-col items-center justify-center text-center">
             <span className="text-3xl font-bold text-primary">{org.stats?.nbProducteurs || 0}</span>
             <span className="text-sm text-muted-foreground">Producteurs</span>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4 flex flex-col items-center justify-center text-center">
             <span className="text-3xl font-bold text-primary">{org.stats?.nbParcelles || 0}</span>
             <span className="text-sm text-muted-foreground">Parcelles</span>
           </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
           <CardHeader><CardTitle>Informations Administratives</CardTitle></CardHeader>
           <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2"><span>Région</span> <b>{org.region}</b></div>
              <div className="flex justify-between border-b pb-2"><span>Département</span> <b>{org.departement}</b></div>
              <div className="flex justify-between border-b pb-2"><span>Sous-Préfecture</span> <b>{org.sous_prefecture}</b></div>
              <div className="flex justify-between border-b pb-2"><span>Date Création</span> <b>{new Date(org.date_creation).toLocaleDateString()}</b></div>
              <div className="flex justify-between"><span>Statut</span> <Badge variant={org.statut === 'actif' ? 'default' : 'secondary'}>{org.statut}</Badge></div>
           </CardContent>
        </Card>

        <Card>
           <CardHeader><CardTitle>Direction</CardTitle></CardHeader>
           <CardContent className="space-y-4">
              <div className="p-3 bg-muted/20 rounded">
                 <p className="text-xs uppercase text-muted-foreground font-bold">Président</p>
                 <p className="text-lg font-medium">{org.president_nom}</p>
                 <p className="text-sm text-muted-foreground">{org.president_contact.join(', ')}</p>
              </div>
              {org.secretaire_nom && (
                <div className="p-3 bg-muted/20 rounded">
                    <p className="text-xs uppercase text-muted-foreground font-bold">Secrétaire</p>
                    <p className="text-lg font-medium">{org.secretaire_nom}</p>
                    <p className="text-sm text-muted-foreground">{org.secretaire_contact?.join(', ')}</p>
                </div>
              )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
