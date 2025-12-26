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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PhotoCapture from "@/components/forms/PhotoCapture";
import GPSCapture from "@/components/forms/GPSCapture";
import { ArrowLeft, ArrowRight, Save, Loader2, MapPin, Heart, Sprout, Wrench, ShoppingCart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { generatePlantationCode } from "@/utils/codeGenerators";
import { api } from "@/services/api";

const niveauxMaladie = ["Inexistant", "TrÃ¨s peu", "Peu", "Important"] as const;
const niveauxIntrant = ["Peu", "Moyen", "A dose recommandÃ©e", "Jamais"] as const;
const frequencesConseil = ["Jamais", "01 fois par an", "01 fois par semestre", "01 fois trimestre", "01 par mois"] as const;

const parcelleSchema = z.object({
  id_producteur: z.string().min(1, "Producteur requis"),

  // Infos GÃ©nÃ©rales
  age_plantation: z.number().min(0),
  superficie_declaree: z.number().min(0),
  superficie_reelle: z.number().optional(),
  distance_magasin: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  production_declaree: z.number().min(0),
  densite: z.number().optional(),
  nb_arbres_ombrage: z.number().optional(),
  photo: z.string().optional(),

  // Maladies
  maladie_pourriture_brune: z.enum(niveauxMaladie),
  maladie_swollen_shoot: z.enum(niveauxMaladie),
  maladie_parasites: z.enum(niveauxMaladie),
  maladie_autre: z.enum(niveauxMaladie),

  // Intrants
  engrais: z.enum(niveauxIntrant),
  pesticides: z.enum(niveauxIntrant),
  insecticides: z.enum(niveauxIntrant),
  fongicides: z.enum(niveauxIntrant),
  herbicides: z.enum(niveauxIntrant),

  // Conseil
  conseil_anader: z.boolean(),
  conseil_partenaires: z.boolean(),
  conseil_prives: z.boolean(),
  conseil_frequence: z.enum(frequencesConseil),
  conseil_interet: z.boolean(),

  // SÃ©chage
  sechage_claie_hauteur: z.boolean(),
  sechage_claie_sol: z.boolean(),
  sechage_plastique_sol: z.boolean(),
  sechage_ciment: z.boolean(),

  // Equipements
  equipement_machettes: z.boolean(),
  equipement_gourdins: z.boolean(),
  equipement_limes: z.boolean(),
  equipement_houe: z.boolean(),
  equipement_secateur: z.boolean(),
  equipement_combinaison: z.boolean(),
  equipement_gants: z.boolean(),
  equipement_lunettes: z.boolean(),
  equipement_masque: z.boolean(),
  equipement_bottes: z.boolean(),

  // Commercialisation
  comm_coop: z.boolean(),
  comm_coop_pct: z.number().optional(),
  comm_coop_loyaute: z.number().optional(),
  comm_coop_lieu: z.string().optional(),
  comm_coop_prix_campagne: z.number().optional(),
  comm_coop_prix_intermediaire: z.number().optional(),

  comm_pisteur: z.boolean(),
  comm_pisteur_noms: z.string().optional(),
  comm_pisteur_pct: z.number().optional(),
  comm_pisteur_loyaute: z.number().optional(),
  comm_pisteur_lieu: z.string().optional(),
  comm_pisteur_prix_campagne: z.number().optional(),
  comm_pisteur_prix_intermediaire: z.number().optional(),

  comm_autre_coop: z.boolean(),
  comm_autre_coop_noms: z.string().optional(),
  comm_autre_coop_pct: z.number().optional(),
  comm_autre_coop_loyaute: z.number().optional(),
  comm_autre_coop_lieu: z.string().optional(),
  comm_autre_coop_prix_campagne: z.number().optional(),
  comm_autre_coop_prix_intermediaire: z.number().optional(),

  comm_autre_acheteur: z.boolean(),
  comm_autre_acheteur_noms: z.string().optional(),
  comm_autre_acheteur_pct: z.number().optional(),
  comm_autre_acheteur_loyaute: z.number().optional(),
  comm_autre_acheteur_lieu: z.string().optional(),
  comm_autre_acheteur_prix_campagne: z.number().optional(),
  comm_autre_acheteur_prix_intermediaire: z.number().optional(),
});

type ParcelleFormData = z.infer<typeof parcelleSchema>;

const steps = [
  { id: 1, name: "Informations GÃ©nÃ©rales", icon: MapPin },
  { id: 2, name: "SantÃ© de la Plantation", icon: Heart },
  { id: 3, name: "Pratiques Agricoles", icon: Sprout },
  { id: 4, name: "Ã‰quipements", icon: Wrench },
  { id: 5, name: "Commercialisation", icon: ShoppingCart },
];

export default function ParcelleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [producteurs, setProducteurs] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset, trigger } = useForm<ParcelleFormData>({
    resolver: zodResolver(parcelleSchema),
    defaultValues: {
      age_plantation: 0,
      superficie_declaree: 0,
      production_declaree: 0,
      maladie_pourriture_brune: "Inexistant",
      maladie_swollen_shoot: "Inexistant",
      maladie_parasites: "Inexistant",
      maladie_autre: "Inexistant",
      engrais: "Jamais",
      pesticides: "Jamais",
      insecticides: "Jamais",
      fongicides: "Jamais",
      herbicides: "Jamais",
      conseil_anader: false,
      conseil_partenaires: false,
      conseil_prives: false,
      conseil_frequence: "Jamais",
      conseil_interet: false,
      sechage_claie_hauteur: false,
      sechage_claie_sol: false,
      sechage_plastique_sol: false,
      sechage_ciment: false,
      equipement_machettes: false,
      equipement_gourdins: false,
      equipement_limes: false,
      equipement_houe: false,
      equipement_secateur: false,
      equipement_combinaison: false,
      equipement_gants: false,
      equipement_lunettes: false,
      equipement_masque: false,
      equipement_bottes: false,
      comm_coop: false,
      comm_pisteur: false,
      comm_autre_coop: false,
      comm_autre_acheteur: false,
    }
  });

  // Load producteurs
  useEffect(() => {
    api.getProducteurs()
      .then(setProducteurs)
      .catch((error) => {
        console.error("Error loading producteurs:", error);
      });
  }, []);

  // Load existing data when editing
  useEffect(() => {
    if (isEdit && id) {
      setIsLoading(true);
      api.getParcelle(id)
        .then((parcelle: any) => {
          reset(parcelle);
        })
        .catch((error) => {
          console.error("Error loading parcelle:", error);
          toast.error("Erreur lors du chargement de la plantation");
          navigate("/plantations");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEdit, reset, navigate]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof ParcelleFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["id_producteur", "age_plantation", "superficie_declaree", "production_declaree"];
        break;
      case 2:
        // Pas de validation obligatoire pour la santÃ©
        break;
      case 3:
        // Pas de validation obligatoire pour les pratiques
        break;
      case 4:
        // Pas de validation obligatoire pour les Ã©quipements
        break;
      case 5:
        // Pas de validation obligatoire pour la commercialisation
        break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
    }

    if (currentStep < steps.length) {
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

  const onSubmit = async (data: ParcelleFormData) => {
    setIsLoading(true);
    try {
      if (isEdit && id) {
        await api.updateParcelle(id, data);
        toast.success("Plantation mise Ã  jour avec succÃ¨s");
        navigate(`/plantations/${id}`);
      } else {
        const code = generatePlantationCode("PROD-001", Math.floor(Math.random() * 10));
        await api.createParcelle({ ...data, code });
        toast.success(`Plantation ${code} enregistrÃ©e avec succÃ¨s`);
        navigate("/plantations");
      }
    } catch (error) {
      console.error("Error saving parcelle:", error);
      toast.error(isEdit ? "Erreur lors de la mise Ã  jour" : "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  const renderRadioBlock = (name: string, label: string, options: readonly string[]) => (
    <div className="space-y-2 border-b pb-2">
      <Label className="font-medium">{label}</Label>
      <RadioGroup onValueChange={(val) => setValue(name as any, val)} defaultValue={watch(name as any)} className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <div key={opt} className="flex items-center space-x-2">
            <RadioGroupItem value={opt} id={`${name}-${opt}`} />
            <Label htmlFor={`${name}-${opt}`} className="text-sm font-normal">{opt}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const renderCommFields = (prefix: string, title: string, hasNameField: boolean = false) => (
    <div className="border p-4 rounded space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox checked={watch(`${prefix}` as any)} onCheckedChange={(chk) => setValue(`${prefix}` as any, !!chk)} />
        <Label className="font-bold">{title}</Label>
      </div>

      {watch(`${prefix}` as any) && (
        <div className="space-y-3 pl-6 border-l-2 border-primary/20">
          {hasNameField && (
            <div>
              <Label>Noms (sÃ©parÃ©s par virgule)</Label>
              <Input {...register(`${prefix}_noms` as any)} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>% QuantitÃ© concernÃ©e</Label>
              <Input type="number" {...register(`${prefix}_pct` as any, { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Taux LoyautÃ© (%)</Label>
              <Input type="number" {...register(`${prefix}_loyaute` as any, { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Lieu de vente</Label>
              <Input {...register(`${prefix}_lieu` as any)} />
            </div>
            <div>
              <Label>Prix Campagne (FCFA)</Label>
              <Input type="number" {...register(`${prefix}_prix_campagne` as any, { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Prix IntermÃ©diaire (FCFA)</Label>
              <Input type="number" {...register(`${prefix}_prix_intermediaire` as any, { valueAsNumber: true })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Producteur PropriÃ©taire *</Label>
                <Select onValueChange={(v) => setValue("id_producteur", v)} value={watch("id_producteur")}>
                  <SelectTrigger><SelectValue placeholder="SÃ©lectionner un producteur..." /></SelectTrigger>
                  <SelectContent>
                    {producteurs.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id}>{prod.nom_complet}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_producteur && <p className="text-destructive text-sm">Requis</p>}
              </div>
              <div>
                <Label>Ã‚ge de la plantation (annÃ©es)</Label>
                <Input type="number" {...register("age_plantation", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Superficie DÃ©clarÃ©e (Ha) *</Label>
                <Input type="number" step="0.01" {...register("superficie_declaree", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Superficie RÃ©elle GPS (Ha)</Label>
                <Input type="number" step="0.01" {...register("superficie_reelle", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Production DÃ©clarÃ©e (T) *</Label>
                <Input type="number" step="0.01" {...register("production_declaree", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Distance Magasin (Km)</Label>
                <Input type="number" step="0.1" {...register("distance_magasin", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>DensitÃ© (plants/ha)</Label>
                <Input type="number" {...register("densite", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Arbres d'ombrage (Nb)</Label>
                <Input type="number" {...register("nb_arbres_ombrage", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="mb-2 block font-semibold">Localisation (CentroÃ¯de)</Label>
              <GPSCapture
                onChange={(c) => { setValue("latitude", c.latitude); setValue("longitude", c.longitude); }}
                latitude={watch("latitude")}
                longitude={watch("longitude")}
              />
            </div>

            <PhotoCapture label="Photo Plantation" value={watch("photo")} onChange={(v) => setValue("photo", v)} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4 text-destructive/80">Principales Maladies</h3>
                <div className="space-y-4">
                  {renderRadioBlock("maladie_pourriture_brune", "Pourritures brunes", niveauxMaladie)}
                  {renderRadioBlock("maladie_swollen_shoot", "Swollen shoot", niveauxMaladie)}
                  {renderRadioBlock("maladie_parasites", "Parasites", niveauxMaladie)}
                  {renderRadioBlock("maladie_autre", "Autres", niveauxMaladie)}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-blue-600">Utilisation Intrants</h3>
                <div className="space-y-4">
                  {renderRadioBlock("engrais", "Engrais", niveauxIntrant)}
                  {renderRadioBlock("pesticides", "Pesticides", niveauxIntrant)}
                  {renderRadioBlock("insecticides", "Insecticides", niveauxIntrant)}
                  {renderRadioBlock("fongicides", "Fongicides", niveauxIntrant)}
                  {renderRadioBlock("herbicides", "Herbicides", niveauxIntrant)}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Conseil Agricole</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><Checkbox checked={watch("conseil_anader")} onCheckedChange={(c) => setValue("conseil_anader", !!c)} /><Label>Anader</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("conseil_partenaires")} onCheckedChange={(c) => setValue("conseil_partenaires", !!c)} /><Label>Partenaires Commerciaux</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("conseil_prives")} onCheckedChange={(c) => setValue("conseil_prives", !!c)} /><Label>Cabinets privÃ©s</Label></div>
                </div>
                <div>
                  <Label>FrÃ©quence</Label>
                  <Select onValueChange={(v) => setValue("conseil_frequence", v as any)} value={watch("conseil_frequence")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {frequencesConseil.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox checked={watch("conseil_interet")} onCheckedChange={(c) => setValue("conseil_interet", !!c)} />
                  <Label className="font-medium">IntÃ©rÃªt pour le conseil agricole</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">SÃ©chage</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2"><Checkbox checked={watch("sechage_claie_hauteur")} onCheckedChange={(c) => setValue("sechage_claie_hauteur", !!c)} /><Label>Claie en hauteur</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("sechage_claie_sol")} onCheckedChange={(c) => setValue("sechage_claie_sol", !!c)} /><Label>Claie au sol</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("sechage_plastique_sol")} onCheckedChange={(c) => setValue("sechage_plastique_sol", !!c)} /><Label>Plastique au sol</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("sechage_ciment")} onCheckedChange={(c) => setValue("sechage_ciment", !!c)} /><Label>Ciment (terrasse)</Label></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["equipement_machettes", "Machettes"],
                ["equipement_gourdins", "Gourdins"],
                ["equipement_limes", "Limes"],
                ["equipement_houe", "Houe"],
                ["equipement_secateur", "SÃ©cateur"],
                ["equipement_combinaison", "Combinaison (Phyto)"],
                ["equipement_gants", "Gants Nitrile"],
                ["equipement_lunettes", "Lunettes protection"],
                ["equipement_masque", "Masque protection"],
                ["equipement_bottes", "Bottes"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-2 p-2 border rounded hover:bg-accent">
                  <Checkbox checked={watch(key as any)} onCheckedChange={(c) => setValue(key as any, !!c)} />
                  <Label>{label}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            {renderCommFields("comm_coop", "Produits livrÃ©s Ã  la CoopÃ©rative")}
            {renderCommFields("comm_pisteur", "Produits livrÃ©s aux Pisteurs", true)}
            {renderCommFields("comm_autre_coop", "Produits livrÃ©s aux autres CoopÃ©ratives", true)}
            {renderCommFields("comm_autre_acheteur", "Produits livrÃ©s aux autres acheteurs", true)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/plantations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{isEdit ? "Modifier Plantation" : "Nouvelle Plantation"}</h1>
          <p className="text-muted-foreground">Enregistrement d'une parcelle de cacao</p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Ã‰tape {currentStep} sur {steps.length}</span>
          <span className="font-medium">{steps[currentStep - 1].name}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Contenu de l'Ã©tape actuelle */}
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
            PrÃ©cÃ©dent
          </Button>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/plantations")}>
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
                {isEdit ? "Mettre Ã  jour" : "Enregistrer la Plantation"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
