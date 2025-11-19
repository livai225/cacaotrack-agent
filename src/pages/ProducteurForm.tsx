import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import PhotoCapture from "@/components/forms/PhotoCapture";
import DateInput from "@/components/forms/DateInput";
import MultiPhone from "@/components/forms/MultiPhone";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { generateProducteurCode, calculateAge } from "@/utils/codeGenerators";
import { useState } from "react";

const producteurSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  dateNaissance: z.string().min(1, "La date de naissance est obligatoire"),
  sexe: z.enum(["M", "F"]),
  organisationId: z.string().min(1, "L'organisation est obligatoire"),
  sectionId: z.string().min(1, "La section est obligatoire"),
  villageId: z.string().min(1, "Le village est obligatoire"),
  contacts: z.array(z.string()).min(1, "Au moins un numéro est requis"),
  photoIdentite: z.string().optional(),
  photoPlanteur: z.string().optional(),
  photoLogement: z.string().optional(),
  nombreFemmes: z.number().min(0),
  nombreEnfants: z.number().min(0),
  enfantsPrimaire: z.number().min(0),
  enfantsSecondaire: z.number().min(0),
  hasElectricite: z.boolean(),
  hasEau: z.boolean(),
  hasVehicule: z.boolean(),
});

type ProducteurFormData = z.infer<typeof producteurSchema>;

export default function ProducteurForm() {
  const navigate = useNavigate();
  const [age, setAge] = useState<number | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProducteurFormData>({
    resolver: zodResolver(producteurSchema),
    defaultValues: {
      contacts: [""],
      nombreFemmes: 0,
      nombreEnfants: 0,
      enfantsPrimaire: 0,
      enfantsSecondaire: 0,
      hasElectricite: false,
      hasEau: false,
      hasVehicule: false,
    }
  });

  const dateNaissance = watch("dateNaissance");

  const handleDateChange = (date: string) => {
    setValue("dateNaissance", date);
    if (date) {
      const calculatedAge = calculateAge(new Date(date));
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  const onSubmit = (data: ProducteurFormData) => {
    const code = generateProducteurCode("ORG-001", "SEC-012", "VIL-045", 287);
    console.log("Producteur créé:", { code, age, ...data });
    toast.success(`Producteur ${code} créé avec succès`);
    navigate("/producteurs");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/producteurs")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouveau Producteur</h1>
          <p className="text-muted-foreground">Enregistrer un nouveau producteur de cacao</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input id="nom" {...register("nom")} placeholder="Kouassi" />
                {errors.nom && <p className="text-sm text-destructive mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input id="prenom" {...register("prenom")} placeholder="Jean" />
                {errors.prenom && <p className="text-sm text-destructive mt-1">{errors.prenom.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DateInput
                  label="Date de naissance *"
                  value={dateNaissance}
                  onChange={handleDateChange}
                  required
                />
                {errors.dateNaissance && <p className="text-sm text-destructive mt-1">{errors.dateNaissance.message}</p>}
                {age !== null && (
                  <p className="text-sm text-muted-foreground mt-1">Âge: {age} ans</p>
                )}
              </div>

              <div>
                <Label htmlFor="sexe">Sexe *</Label>
                <Select onValueChange={(value) => setValue("sexe", value as "M" | "F")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sexe && <p className="text-sm text-destructive mt-1">{errors.sexe.message}</p>}
              </div>
            </div>

            <div>
              <MultiPhone
                label="Numéros de téléphone *"
                values={watch("contacts") || [""]}
                onChange={(phones) => setValue("contacts", phones)}
                required
              />
              {errors.contacts && <p className="text-sm text-destructive mt-1">{errors.contacts.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rattachement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="organisationId">Organisation *</Label>
              <Select onValueChange={(value) => setValue("organisationId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une organisation..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORG-001">SCOOP-CA Divo</SelectItem>
                  <SelectItem value="ORG-002">Union des Planteurs de Gagnoa</SelectItem>
                </SelectContent>
              </Select>
              {errors.organisationId && <p className="text-sm text-destructive mt-1">{errors.organisationId.message}</p>}
            </div>

            <div>
              <Label htmlFor="sectionId">Section *</Label>
              <Select onValueChange={(value) => setValue("sectionId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une section..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEC-012">Section Divo Nord</SelectItem>
                  <SelectItem value="SEC-013">Section Gagnoa Sud</SelectItem>
                </SelectContent>
              </Select>
              {errors.sectionId && <p className="text-sm text-destructive mt-1">{errors.sectionId.message}</p>}
            </div>

            <div>
              <Label htmlFor="villageId">Village / Campement *</Label>
              <Select onValueChange={(value) => setValue("villageId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un village..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIL-045">Divo-Centre</SelectItem>
                  <SelectItem value="VIL-046">Campement N'Zikro</SelectItem>
                </SelectContent>
              </Select>
              {errors.villageId && <p className="text-sm text-destructive mt-1">{errors.villageId.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Composition Familiale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="nombreFemmes">Nombre de femmes</Label>
                <Input 
                  id="nombreFemmes" 
                  type="number" 
                  {...register("nombreFemmes", { valueAsNumber: true })} 
                />
              </div>

              <div>
                <Label htmlFor="nombreEnfants">Nombre d'enfants</Label>
                <Input 
                  id="nombreEnfants" 
                  type="number" 
                  {...register("nombreEnfants", { valueAsNumber: true })} 
                />
              </div>

              <div>
                <Label htmlFor="enfantsPrimaire">Enfants au primaire</Label>
                <Input 
                  id="enfantsPrimaire" 
                  type="number" 
                  {...register("enfantsPrimaire", { valueAsNumber: true })} 
                />
              </div>

              <div>
                <Label htmlFor="enfantsSecondaire">Enfants au secondaire</Label>
                <Input 
                  id="enfantsSecondaire" 
                  type="number" 
                  {...register("enfantsSecondaire", { valueAsNumber: true })} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conditions de Vie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasElectricite" 
                  checked={watch("hasElectricite")}
                  onCheckedChange={(checked) => setValue("hasElectricite", !!checked)}
                />
                <Label htmlFor="hasElectricite" className="cursor-pointer">Accès à l'électricité</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasEau" 
                  checked={watch("hasEau")}
                  onCheckedChange={(checked) => setValue("hasEau", !!checked)}
                />
                <Label htmlFor="hasEau" className="cursor-pointer">Accès à l'eau potable</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasVehicule" 
                  checked={watch("hasVehicule")}
                  onCheckedChange={(checked) => setValue("hasVehicule", !!checked)}
                />
                <Label htmlFor="hasVehicule" className="cursor-pointer">Possession d'un véhicule</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PhotoCapture
              label="Photo d'identité"
              value={watch("photoIdentite")}
              onChange={(photo) => setValue("photoIdentite", photo)}
            />

            <PhotoCapture
              label="Photo en tant que planteur"
              value={watch("photoPlanteur")}
              onChange={(photo) => setValue("photoPlanteur", photo)}
            />

            <PhotoCapture
              label="Photo du logement"
              value={watch("photoLogement")}
              onChange={(photo) => setValue("photoLogement", photo)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/producteurs")}>
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
