import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PhotoCapture from "@/components/forms/PhotoCapture";
import GPSCapture from "@/components/forms/GPSCapture";
import MultiPhone from "@/components/forms/MultiPhone";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { generateOrganisationCode } from "@/utils/codeGenerators";

const organisationSchema = z.object({
  type: z.enum(["Coopérative", "Regroupement"]),
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  region: z.string().min(1, "La région est obligatoire"),
  departement: z.string().min(1, "Le département est obligatoire"),
  sousPrefecture: z.string().min(1, "La sous-préfecture est obligatoire"),
  localite: z.string().min(1, "La localité est obligatoire"),
  siegeSocial: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  presidentNom: z.string().min(1, "Le nom du président est obligatoire"),
  presidentContact: z.array(z.string()).min(1, "Au moins un numéro est requis"),
  secretaireNom: z.string().optional(),
  secretaireContact: z.array(z.string()).optional(),
  photo: z.string().optional(),
  potentielProduction: z.number().min(0).optional(),
});

type OrganisationFormData = z.infer<typeof organisationSchema>;

export default function OrganisationForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<OrganisationFormData>({
    resolver: zodResolver(organisationSchema),
    defaultValues: {
      presidentContact: [""],
      secretaireContact: [""],
    }
  });

  const onSubmit = (data: OrganisationFormData) => {
    const code = generateOrganisationCode(1);
    console.log("Organisation créée:", { code, ...data });
    toast.success(`Organisation ${code} créée avec succès`);
    navigate("/organisations");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/organisations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouvelle Organisation</h1>
          <p className="text-muted-foreground">Créer une coopérative ou un regroupement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type d'organisation *</Label>
                <Select onValueChange={(value) => setValue("type", value as "Coopérative" | "Regroupement")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coopérative">Coopérative</SelectItem>
                    <SelectItem value="Regroupement">Regroupement</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <Label htmlFor="nom">Nom de l'organisation *</Label>
                <Input id="nom" {...register("nom")} placeholder="Ex: SCOOP-CA Divo" />
                {errors.nom && <p className="text-sm text-destructive mt-1">{errors.nom.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Région *</Label>
                <Input id="region" {...register("region")} placeholder="Ex: Lôh-Djiboua" />
                {errors.region && <p className="text-sm text-destructive mt-1">{errors.region.message}</p>}
              </div>

              <div>
                <Label htmlFor="departement">Département *</Label>
                <Input id="departement" {...register("departement")} placeholder="Ex: Divo" />
                {errors.departement && <p className="text-sm text-destructive mt-1">{errors.departement.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sousPrefecture">Sous-Préfecture *</Label>
                <Input id="sousPrefecture" {...register("sousPrefecture")} />
                {errors.sousPrefecture && <p className="text-sm text-destructive mt-1">{errors.sousPrefecture.message}</p>}
              </div>

              <div>
                <Label htmlFor="localite">Localité *</Label>
                <Input id="localite" {...register("localite")} />
                {errors.localite && <p className="text-sm text-destructive mt-1">{errors.localite.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="siegeSocial">Siège Social</Label>
              <Textarea id="siegeSocial" {...register("siegeSocial")} placeholder="Adresse complète du siège social" />
            </div>

            <div>
              <Label htmlFor="potentielProduction">Potentiel de Production (tonnes)</Label>
              <Input 
                id="potentielProduction" 
                type="number" 
                step="0.1"
                {...register("potentielProduction", { valueAsNumber: true })} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localisation GPS</CardTitle>
          </CardHeader>
          <CardContent>
            <GPSCapture
              onChange={(coords) => {
                setValue("latitude", coords.latitude);
                setValue("longitude", coords.longitude);
              }}
              latitude={watch("latitude")}
              longitude={watch("longitude")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Président *</h3>
              <div>
                <Label htmlFor="presidentNom">Nom complet *</Label>
                <Input id="presidentNom" {...register("presidentNom")} placeholder="Nom et prénom(s)" />
                {errors.presidentNom && <p className="text-sm text-destructive mt-1">{errors.presidentNom.message}</p>}
              </div>
              <div>
                <MultiPhone
                  label="Numéros de téléphone *"
                  values={watch("presidentContact") || [""]}
                  onChange={(phones) => setValue("presidentContact", phones)}
                />
                {errors.presidentContact && <p className="text-sm text-destructive mt-1">{errors.presidentContact.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Secrétaire Général</h3>
              <div>
                <Label htmlFor="secretaireNom">Nom complet</Label>
                <Input id="secretaireNom" {...register("secretaireNom")} placeholder="Nom et prénom(s)" />
              </div>
              <div>
                <MultiPhone
                  label="Numéros de téléphone"
                  values={watch("secretaireContact") || [""]}
                  onChange={(phones) => setValue("secretaireContact", phones)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photo de l'organisation</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoCapture
              label="Photo de l'organisation"
              value={watch("photo")}
              onChange={(photo) => setValue("photo", photo)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/organisations")}>
            Annuler
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
