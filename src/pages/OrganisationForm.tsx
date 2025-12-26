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
import { ArrowLeft, ArrowRight, Save, Loader2, MapPin, Users, Camera, Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { generateOrganisationCode } from "@/utils/codeGenerators";
import type { Organisation } from "@/types/organisation";
import { api } from "@/services/api";
import GeographicSelect from "@/components/forms/GeographicSelect";

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

  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: "Informations Générales", icon: Building2 },
    { id: 2, name: "Localisation GPS", icon: MapPin },
    { id: 3, name: "Responsables", icon: Users },
    { id: 4, name: "Photo", icon: Camera },
  ];

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset, trigger } = useForm<OrganisationFormData>({
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

  const handleNext = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = await trigger(["type", "nom", "region", "departement", "sous_prefecture", "localite", "statut"]);
        break;
      case 2:
        // Pas de validation obligatoire pour GPS
        isValid = true;
        break;
      case 3:
        isValid = await trigger(["president_nom", "president_contact"]);
        break;
      case 4:
        // Pas de validation obligatoire pour photo
        isValid = true;
        break;
    }

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepIcon = steps[currentStep - 1].icon;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type d'organisation *</Label>
                <Select onValueChange={(value) => setValue("type", value as "Coopérative" | "Regroupement")} value={watch("type")}>
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

            <GeographicSelect
              region={watch("region")}
              departement={watch("departement")}
              sousPrefecture={watch("sous_prefecture")}
              localite={watch("localite")}
              onRegionChange={(val) => {
                setValue("region", val);
                setValue("departement", "");
                setValue("sous_prefecture", "");
                setValue("localite", "");
              }}
              onDepartementChange={(val) => {
                setValue("departement", val);
                setValue("sous_prefecture", "");
                setValue("localite", "");
              }}
              onSousPrefectureChange={(val) => {
                setValue("sous_prefecture", val);
                setValue("localite", "");
              }}
              onLocaliteChange={(val) => setValue("localite", val)}
            />
            {errors.region && <p className="text-sm text-destructive mt-1">{errors.region.message}</p>}
            {errors.departement && <p className="text-sm text-destructive mt-1">{errors.departement.message}</p>}
            {errors.sous_prefecture && <p className="text-sm text-destructive mt-1">{errors.sous_prefecture.message}</p>}
            {errors.localite && <p className="text-sm text-destructive mt-1">{errors.localite.message}</p>}

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
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <GPSCapture
              onChange={(coords) => {
                setValue("latitude", coords.latitude);
                setValue("longitude", coords.longitude);
              }}
              latitude={watch("latitude")}
              longitude={watch("longitude")}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <PhotoCapture
              label="Photo de l'organisation"
              value={watch("photo")}
              onChange={(photo) => setValue("photo", photo)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const onSubmit = async (data: OrganisationFormData) => {
    try {
      setIsLoading(true);

      // Filtrer les valeurs vides des arrays de contacts
      const cleanData = {
        ...data,
        president_contact: data.president_contact.filter(phone => phone && phone.trim() !== ""),
        secretaire_contact: data.secretaire_contact?.filter(phone => phone && phone.trim() !== "") || [],
      };

      if (isEdit && id) {
        // Update existing organisation
        await api.updateOrganisation(id, cleanData);
        toast.success("Organisation modifiée avec succès");
      } else {
        // Create new organisation
        let code: string;
        try {
          const orgs = await api.getOrganisations();
          const nextNumber = orgs.length + 1;
          code = generateOrganisationCode(nextNumber);
        } catch (error) {
          // Si la récupération des organisations échoue, générer un code basé sur la date
          console.warn("Impossible de récupérer les organisations, génération d'un code basé sur la date");
          code = `ORG-${Date.now()}`;
        }

        await api.createOrganisation({ ...cleanData, code });
        toast.success(`Organisation ${code} créée avec succès`);
      }

      navigate("/organisations");
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      const errorMessage = error?.message || (isEdit ? "Erreur lors de la modification" : "Erreur lors de la création");
      toast.error(errorMessage);
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

      {/* Barre de progression */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Étape {currentStep} sur {steps.length}</span>
          <span className="font-medium">{steps[currentStep - 1].name}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {isLoading && !isEdit ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contenu de l'étape actuelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CurrentStepIcon className="h-5 w-5" />
                {steps[currentStep - 1].name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/organisations")} disabled={isLoading}>
                Annuler
              </Button>
              {currentStep < steps.length ? (
                <Button type="button" onClick={handleNext} className="gap-2">
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {isEdit ? "Mettre à jour" : "Enregistrer l'Organisation"}
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
