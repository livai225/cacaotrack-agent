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
import GPSCapture from "@/components/forms/GPSCapture";
import MultiPhone from "@/components/forms/MultiPhone";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { generateVillageCode } from "@/utils/codeGenerators";

const villageSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  type: z.enum(["Village", "Campement"]),
  organisationId: z.string().min(1, "L'organisation est obligatoire"),
  sectionId: z.string().min(1, "La section est obligatoire"),
  localite: z.string().min(1, "La localité est obligatoire"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  chefNom: z.string().min(1, "Le nom du chef est obligatoire"),
  chefContact: z.array(z.string()).min(1, "Au moins un numéro est requis"),
  nombreHabitants: z.number().min(0),
  nombreHommes: z.number().min(0),
  nombreFemmes: z.number().min(0),
  enfantsScolarises: z.number().min(0),
  hasEcole: z.boolean(),
  hasDispensaire: z.boolean(),
  hasEau: z.boolean(),
  hasElectricite: z.boolean(),
  photo: z.string().optional(),
});

type VillageFormData = z.infer<typeof villageSchema>;

export default function VillageForm() {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<VillageFormData>({
    resolver: zodResolver(villageSchema),
    defaultValues: {
      chefContact: [""],
      nombreHabitants: 0,
      nombreHommes: 0,
      nombreFemmes: 0,
      enfantsScolarises: 0,
      hasEcole: false,
      hasDispensaire: false,
      hasEau: false,
      hasElectricite: false,
    }
  });

  const onSubmit = (data: VillageFormData) => {
    const code = generateVillageCode(45);
    console.log("Village créé:", { code, ...data });
    toast.success(`Village ${code} créé avec succès`);
    navigate("/villages");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/villages")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouveau Village / Campement</h1>
          <p className="text-muted-foreground">Enregistrer un nouveau village ou campement</p>
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
                <Label htmlFor="nom">Nom du village/campement *</Label>
                <Input id="nom" {...register("nom")} placeholder="Ex: Divo-Centre" />
                {errors.nom && <p className="text-sm text-destructive mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <Select onValueChange={(value) => setValue("type", value as "Village" | "Campement")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Village">Village</SelectItem>
                    <SelectItem value="Campement">Campement</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organisationId">Organisation *</Label>
                <Select onValueChange={(value) => setValue("organisationId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
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
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEC-012">Section Divo Nord</SelectItem>
                    <SelectItem value="SEC-013">Section Gagnoa Sud</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sectionId && <p className="text-sm text-destructive mt-1">{errors.sectionId.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="localite">Localité *</Label>
              <Input id="localite" {...register("localite")} placeholder="Ex: Divo" />
              {errors.localite && <p className="text-sm text-destructive mt-1">{errors.localite.message}</p>}
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
            <CardTitle>Chef du Village / Campement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chefNom">Nom complet du chef *</Label>
              <Input id="chefNom" {...register("chefNom")} placeholder="Nom et prénom(s)" />
              {errors.chefNom && <p className="text-sm text-destructive mt-1">{errors.chefNom.message}</p>}
            </div>

            <div>
              <MultiPhone
                label="Numéros de téléphone *"
                values={watch("chefContact") || [""]}
                onChange={(phones) => setValue("chefContact", phones)}
                required
              />
              {errors.chefContact && <p className="text-sm text-destructive mt-1">{errors.chefContact.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Données Sociologiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="nombreHabitants">Nombre d'habitants</Label>
                <Input 
                  id="nombreHabitants" 
                  type="number" 
                  {...register("nombreHabitants", { valueAsNumber: true })} 
                />
              </div>

              <div>
                <Label htmlFor="nombreHommes">Hommes</Label>
                <Input 
                  id="nombreHommes" 
                  type="number" 
                  {...register("nombreHommes", { valueAsNumber: true })} 
                />
              </div>

              <div>
                <Label htmlFor="nombreFemmes">Femmes</Label>
                <Input 
                  id="nombreFemmes" 
                  type="number" 
                  {...register("nombreFemmes", { valueAsNumber: true })} 
                />
              </div>

              <div>
                <Label htmlFor="enfantsScolarises">Enfants scolarisés</Label>
                <Input 
                  id="enfantsScolarises" 
                  type="number" 
                  {...register("enfantsScolarises", { valueAsNumber: true })} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Infrastructures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasEcole" 
                  checked={watch("hasEcole")}
                  onCheckedChange={(checked) => setValue("hasEcole", !!checked)}
                />
                <Label htmlFor="hasEcole" className="cursor-pointer">École primaire</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasDispensaire" 
                  checked={watch("hasDispensaire")}
                  onCheckedChange={(checked) => setValue("hasDispensaire", !!checked)}
                />
                <Label htmlFor="hasDispensaire" className="cursor-pointer">Dispensaire / Centre de santé</Label>
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
                  id="hasElectricite" 
                  checked={watch("hasElectricite")}
                  onCheckedChange={(checked) => setValue("hasElectricite", !!checked)}
                />
                <Label htmlFor="hasElectricite" className="cursor-pointer">Accès à l'électricité</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photo du village</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoCapture
              label="Photo du village / campement"
              value={watch("photo")}
              onChange={(photo) => setValue("photo", photo)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/villages")}>
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
