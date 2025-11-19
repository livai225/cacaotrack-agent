import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PhotoCapture from "@/components/forms/PhotoCapture";
import GPSCapture from "@/components/forms/GPSCapture";
import SliderInput from "@/components/forms/SliderInput";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { generatePlantationCode } from "@/utils/codeGenerators";

const plantationSchema = z.object({
  producteurId: z.string().min(1, "Le producteur est obligatoire"),
  superficieDeclaree: z.number().min(0.1, "La superficie doit être supérieure à 0"),
  superficieReelle: z.number().min(0.1, "La superficie doit être supérieure à 0"),
  age: z.number().min(1, "L'âge doit être supérieur à 0"),
  distanceMagasin: z.number().min(0, "La distance ne peut pas être négative"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  pourritureBrune: z.number().min(0).max(3),
  swollenShoot: z.number().min(0).max(3),
  photo: z.string().optional(),
});

type PlantationFormData = z.infer<typeof plantationSchema>;

export default function PlantationForm() {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PlantationFormData>({
    resolver: zodResolver(plantationSchema),
    defaultValues: {
      pourritureBrune: 0,
      swollenShoot: 0,
    }
  });

  const onSubmit = (data: PlantationFormData) => {
    const code = generatePlantationCode(data.producteurId, 1);
    console.log("Plantation créée:", { code, ...data });
    toast.success(`Plantation ${code} créée avec succès`);
    navigate("/plantations");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/plantations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouvelle Plantation</h1>
          <p className="text-muted-foreground">Enregistrer une nouvelle plantation de cacao</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Producteur</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="producteurId">Sélectionner le producteur *</Label>
              <Select onValueChange={(value) => setValue("producteurId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un producteur..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORG-001-SEC-012-VIL-045-PROD-0287">Kouassi Jean (PROD-0287)</SelectItem>
                  <SelectItem value="ORG-001-SEC-012-VIL-045-PROD-0288">Koné Marie (PROD-0288)</SelectItem>
                  <SelectItem value="ORG-001-SEC-012-VIL-046-PROD-0289">Yao Kouadio (PROD-0289)</SelectItem>
                </SelectContent>
              </Select>
              {errors.producteurId && <p className="text-sm text-destructive mt-1">{errors.producteurId.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Caractéristiques de la Plantation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="superficieDeclaree">Superficie déclarée (ha) *</Label>
                <Input 
                  id="superficieDeclaree" 
                  type="number" 
                  step="0.1"
                  {...register("superficieDeclaree", { valueAsNumber: true })} 
                  placeholder="Ex: 5.2"
                />
                {errors.superficieDeclaree && <p className="text-sm text-destructive mt-1">{errors.superficieDeclaree.message}</p>}
              </div>

              <div>
                <Label htmlFor="superficieReelle">Superficie réelle (ha) *</Label>
                <Input 
                  id="superficieReelle" 
                  type="number" 
                  step="0.1"
                  {...register("superficieReelle", { valueAsNumber: true })} 
                  placeholder="Ex: 4.8"
                />
                {errors.superficieReelle && <p className="text-sm text-destructive mt-1">{errors.superficieReelle.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Âge de la plantation (années) *</Label>
                <Input 
                  id="age" 
                  type="number" 
                  {...register("age", { valueAsNumber: true })} 
                  placeholder="Ex: 15"
                />
                {errors.age && <p className="text-sm text-destructive mt-1">{errors.age.message}</p>}
              </div>

              <div>
                <Label htmlFor="distanceMagasin">Distance au magasin (km) *</Label>
                <Input 
                  id="distanceMagasin" 
                  type="number" 
                  step="0.1"
                  {...register("distanceMagasin", { valueAsNumber: true })} 
                  placeholder="Ex: 3.5"
                />
                {errors.distanceMagasin && <p className="text-sm text-destructive mt-1">{errors.distanceMagasin.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GPS Centroïde de la Plantation</CardTitle>
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
            <CardTitle>Maladies et Nuisibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SliderInput
              label="Pourritures brunes"
              value={watch("pourritureBrune")}
              onChange={(value) => setValue("pourritureBrune", value)}
              min={0}
              max={3}
              step={1}
              labels={["Absent", "Faible", "Modéré", "Élevé"]}
            />

            <SliderInput
              label="Swollen Shoot"
              value={watch("swollenShoot")}
              onChange={(value) => setValue("swollenShoot", value)}
              min={0}
              max={3}
              step={1}
              labels={["Absent", "Faible", "Modéré", "Élevé"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photo de la plantation</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoCapture
              label="Photo de la plantation"
              value={watch("photo")}
              onChange={(photo) => setValue("photo", photo)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/plantations")}>
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
