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
import MultiPhone from "@/components/forms/MultiPhone";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { generateSectionCode } from "@/utils/codeGenerators";

const sectionSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  organisationId: z.string().min(1, "L'organisation est obligatoire"),
  localite: z.string().min(1, "La localité est obligatoire"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  presidentNom: z.string().min(1, "Le nom du président est obligatoire"),
  presidentContact: z.array(z.string()).min(1, "Au moins un numéro est requis"),
  tonnagePrecedent: z.number().min(0).optional(),
  tonnageEnCours: z.number().min(0).optional(),
  photo: z.string().optional(),
});

type SectionFormData = z.infer<typeof sectionSchema>;

export default function SectionForm() {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      presidentContact: [""],
      tonnagePrecedent: 0,
      tonnageEnCours: 0,
    }
  });

  const onSubmit = (data: SectionFormData) => {
    const code = generateSectionCode(12);
    console.log("Section créée:", { code, ...data });
    toast.success(`Section ${code} créée avec succès`);
    navigate("/sections");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/sections")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouvelle Section</h1>
          <p className="text-muted-foreground">Créer une nouvelle section de coopérative</p>
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
                <Label htmlFor="nom">Nom de la section *</Label>
                <Input id="nom" {...register("nom")} placeholder="Ex: Section Divo Nord" />
                {errors.nom && <p className="text-sm text-destructive mt-1">{errors.nom.message}</p>}
              </div>

              <div>
                <Label htmlFor="localite">Localité *</Label>
                <Input id="localite" {...register("localite")} placeholder="Ex: Divo" />
                {errors.localite && <p className="text-sm text-destructive mt-1">{errors.localite.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="organisationId">Organisation *</Label>
              <Select onValueChange={(value) => setValue("organisationId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une organisation..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORG-001">SCOOP-CA Divo</SelectItem>
                  <SelectItem value="ORG-002">Union des Planteurs de Gagnoa</SelectItem>
                  <SelectItem value="ORG-003">COOPAGRI Lakota</SelectItem>
                </SelectContent>
              </Select>
              {errors.organisationId && <p className="text-sm text-destructive mt-1">{errors.organisationId.message}</p>}
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
            <CardTitle>Président de Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="presidentNom">Nom complet du président *</Label>
              <Input id="presidentNom" {...register("presidentNom")} placeholder="Nom et prénom(s)" />
              {errors.presidentNom && <p className="text-sm text-destructive mt-1">{errors.presidentNom.message}</p>}
            </div>

            <div>
              <MultiPhone
                label="Numéros de téléphone *"
                values={watch("presidentContact") || [""]}
                onChange={(phones) => setValue("presidentContact", phones)}
                required
              />
              {errors.presidentContact && <p className="text-sm text-destructive mt-1">{errors.presidentContact.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tonnagePrecedent">Tonnage précédent (T)</Label>
                <Input 
                  id="tonnagePrecedent" 
                  type="number" 
                  step="0.1"
                  {...register("tonnagePrecedent", { valueAsNumber: true })} 
                />
              </div>

              <div>
                <Label htmlFor="tonnageEnCours">Tonnage en cours (T)</Label>
                <Input 
                  id="tonnageEnCours" 
                  type="number" 
                  step="0.1"
                  {...register("tonnageEnCours", { valueAsNumber: true })} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photo de la section</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoCapture
              label="Photo de la section"
              value={watch("photo")}
              onChange={(photo) => setValue("photo", photo)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/sections")}>
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
