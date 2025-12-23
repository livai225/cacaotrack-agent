import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PhotoCapture from "@/components/forms/PhotoCapture";
import GPSCapture from "@/components/forms/GPSCapture";
import MultiPhone from "@/components/forms/MultiPhone";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateOrganisationCode } from "@/utils/codeGenerators";
import type { Organisation } from "@/types/organisation";
import { api } from "@/services/api";

const organisationSchema = z.object({
  type: z.enum(["Coopérative", "Regroupement"]),
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  region: z.string().min(1, "La région est obligatoire"),
  departement: z.string().min(1, "Le département est obligatoire"),
  sous_prefecture: z.string().min(1, "La sous-préfecture est obligatoire"),
  localite: z.string().min(1, "La localité est obligatoire"),
  siege_social: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  president_nom: z.string().min(1, "Le nom du président est obligatoire"),
  president_contact: z.array(z.string()).min(1, "Au moins un numéro est requis"),
  secretaire_nom: z.string().optional(),
  secretaire_contact: z.array(z.string()).optional(),
  photo: z.string().optional(),
  potentiel_production: z.number().min(0).optional(),
  statut: z.enum(["actif", "inactif", "suspendu"]).default("actif"),
});

type OrganisationFormData = z.infer<typeof organisationSchema>;

export default function OrganisationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<OrganisationFormData>({
    resolver: zodResolver(organisationSchema),
    defaultValues: {
      president_contact: [""],
      secretaire_contact: [""],
      statut: "actif",
    }
  });

  // Load existing data when editing
  useEffect(() => {
    if (isEdit && id) {
      setIsLoading(true);
      api.getOrganisation(id)
        .then((org: any) => {
          reset({
            type: org.type,
            nom: org.nom,
            region: org.region,
            departement: org.departement,
            sous_prefecture: org.sous_prefecture,
            localite: org.localite,
            siege_social: org.siege_social,
            latitude: org.latitude,
            longitude: org.longitude,
            president_nom: org.president_nom,
            president_contact: org.president_contact || [""],
            secretaire_nom: org.secretaire_nom,
            secretaire_contact: org.secretaire_contact || [""],
            photo: org.photo,
            potentiel_production: org.potentiel_production,
            statut: org.statut,
          });
        })
        .catch((error) => {
          console.error("Erreur chargement organisation:", error);
          toast.error("Erreur lors du chargement de l'organisation");
          navigate("/organisations");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data: OrganisationFormData) => {
    try {
      setIsLoading(true);

      if (isEdit && id) {
        // Update existing organisation
        await api.updateOrganisation(id, data);
        toast.success("Organisation modifiée avec succès");
      } else {
        // Create new organisation
        const orgs = await api.getOrganisations();
        const nextNumber = orgs.length + 1;
        const code = generateOrganisationCode(nextNumber);

        await api.createOrganisation({ ...data, code });
        toast.success(`Organisation ${code} créée avec succès`);
      }

      navigate("/organisations");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(isEdit ? "Erreur lors de la modification" : "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/organisations")} disabled={isLoading}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? "Modifier l'Organisation" : "Nouvelle Organisation"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Mettre à jour les informations" : "Créer une coopérative ou un regroupement"}
          </p>
        </div>
      </div>

      {isLoading && !isEdit ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
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
                  <Label htmlFor="sous_prefecture">Sous-Préfecture *</Label>
                  <Input id="sous_prefecture" {...register("sous_prefecture")} />
                  {errors.sous_prefecture && <p className="text-sm text-destructive mt-1">{errors.sous_prefecture.message}</p>}
                </div>

                <div>
                  <Label htmlFor="localite">Localité *</Label>
                  <Input id="localite" {...register("localite")} />
                  {errors.localite && <p className="text-sm text-destructive mt-1">{errors.localite.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="siege_social">Siège Social</Label>
                <Textarea id="siege_social" {...register("siege_social")} placeholder="Adresse complète du siège social" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="potentiel_production">Potentiel de Production (tonnes)</Label>
                  <Input
                    id="potentiel_production"
                    type="number"
                    step="0.1"
                    {...register("potentiel_production", { valueAsNumber: true })}
                    placeholder="Ex: 1250"
                  />
                </div>

                <div>
                  <Label htmlFor="statut">Statut *</Label>
                  <Select
                    value={watch("statut")}
                    onValueChange={(value) => setValue("statut", value as "actif" | "inactif" | "suspendu")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                      <SelectItem value="suspendu">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.statut && <p className="text-sm text-destructive mt-1">{errors.statut.message}</p>}
                </div>
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
                  <Label htmlFor="president_nom">Nom complet *</Label>
                  <Input id="president_nom" {...register("president_nom")} placeholder="Nom et prénom(s)" />
                  {errors.president_nom && <p className="text-sm text-destructive mt-1">{errors.president_nom.message}</p>}
                </div>
                <div>
                  <MultiPhone
                    label="Numéros de téléphone *"
                    values={watch("president_contact") || [""]}
                    onChange={(phones) => setValue("president_contact", phones)}
                  />
                  {errors.president_contact && <p className="text-sm text-destructive mt-1">{errors.president_contact.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Secrétaire Général</h3>
                <div>
                  <Label htmlFor="secretaire_nom">Nom complet</Label>
                  <Input id="secretaire_nom" {...register("secretaire_nom")} placeholder="Nom et prénom(s)" />
                </div>
                <div>
                  <MultiPhone
                    label="Numéros de téléphone"
                    values={watch("secretaire_contact") || [""]}
                    onChange={(phones) => setValue("secretaire_contact", phones)}
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
            <Button type="button" variant="outline" onClick={() => navigate("/organisations")} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" className="gap-2" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEdit ? "Modifier" : "Enregistrer"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
