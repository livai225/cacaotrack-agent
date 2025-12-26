import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PhotoCapture from "@/components/forms/PhotoCapture";
import MultiPhone from "@/components/forms/MultiPhone";
import { ArrowLeft, ArrowRight, Save, Info, Loader2, User, Home, Heart, Sprout, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { generateProducteurCode, calculateAge } from "@/utils/codification";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

const producteurSchema = z.object({
  // Rattachement
  organisationId: z.string().min(1, "Organisation requise"),
  sectionId: z.string().min(1, "Section requise"),
  villageId: z.string().min(1, "Village requis"),

  // Infos gÃ©nÃ©rales
  nom_complet: z.string().min(2, "Nom complet requis"),
  date_naissance: z.string().min(1, "Date de naissance requise"),
  lieu_naissance: z.string().optional(),
  telephones: z.array(z.string()).optional(),
  photo_cni: z.string().optional(),
  photo_planteur: z.string().optional(),

  nb_femmes: z.number().min(0),
  nb_enfants: z.number().min(0),
  nb_filles: z.number().min(0),
  nb_garcons: z.number().min(0),
  nb_moins_5_ans: z.number().min(0),
  nb_enfants_scolarises: z.number().min(0),

  // Scolarisation
  scolarises_primaire_filles: z.number().min(0),
  scolarises_primaire_garcons: z.number().min(0),
  scolarises_secondaire_filles: z.number().min(0),
  scolarises_secondaire_garcons: z.number().min(0),
  scolarises_superieur_filles: z.number().min(0),
  scolarises_superieur_garcons: z.number().min(0),

  // Conditions de vie - Eau
  eau_courante: z.boolean(),
  pompe_hydraulique: z.boolean(),
  puits: z.boolean(),
  riviere_marigot: z.boolean(),

  // Conditions de vie - ElectricitÃ©
  electricite_reseau: z.boolean(),
  electricite_solaire: z.boolean(),
  electricite_lampe: z.boolean(),
  electricite_aucun: z.boolean(),

  // Logement
  materiaux_mur: z.enum(["Terre battue sÃ©chÃ©e", "Briques/Ciment", "Bois", "Paille/pisÃ©", "MatÃ©riaux modernes"]).optional(),
  toiture: z.enum(["TÃ´le", "Bambou-Plastique", "Paille-Plastique", "Bambou-Paille"]).optional(),

  // Soins
  soins_plantes_tradi: z.enum(["Toujours", "Souvent", "Jamais"]).optional(),
  soins_dispensaire: z.enum(["Toujours", "Souvent", "Jamais"]).optional(),

  // CrÃ©dit / Epargne
  interet_compte_bancaire: z.boolean(),
  montant_compte_bancaire: z.number().optional(),
  interet_epargne: z.boolean(),
  montant_epargne: z.number().optional(),

  // Moyens paiement
  usage_mobile_money: z.enum(["Peu", "Souvent", "Toujours", "Jamais"]).optional(),
  usage_virement: z.enum(["Peu", "Souvent", "Toujours", "Jamais"]).optional(),
  usage_especes: z.enum(["Peu", "Souvent", "Toujours", "Jamais"]).optional(),
  usage_tontine: z.enum(["Peu", "Souvent", "Toujours", "Jamais"]).optional(),

  // CrÃ©dit Agricole
  credit_intrants: z.boolean(), montant_credit_intrants: z.number().optional(),
  credit_soudure: z.boolean(), montant_credit_soudure: z.number().optional(),
  pret_scolaire: z.boolean(), montant_pret_scolaire: z.number().optional(),
  credit_acces_intrants: z.boolean(), montant_credit_acces_intrants: z.number().optional(),
  credit_biens_conso: z.boolean(), montant_credit_biens_conso: z.number().optional(),
  credit_assurance_maladie: z.boolean(), montant_credit_assurance_maladie: z.number().optional(),
  credit_assurance_agricole: z.boolean(), montant_credit_assurance_agricole: z.number().optional(),
  credit_assurance_retraite: z.boolean(), montant_credit_assurance_retraite: z.number().optional(),
  credit_conseil_agricole: z.boolean(), montant_credit_conseil_agricole: z.number().optional(),
  credit_rehabilitation: z.boolean(), montant_credit_rehabilitation: z.number().optional(),

  // Production Agricole
  cacao_nb_plantations: z.number().min(0),
  cacao_superficie: z.number().min(0),
  cacao_production: z.number().min(0),

  hevea: z.boolean(), hevea_nb_plantations: z.number().optional(), hevea_superficie: z.number().optional(), hevea_production: z.number().optional(),
  palmier: z.boolean(), palmier_nb_plantations: z.number().optional(), palmier_superficie: z.number().optional(), palmier_production: z.number().optional(),
  cafe: z.boolean(), cafe_nb_plantations: z.number().optional(), cafe_superficie: z.number().optional(), cafe_production: z.number().optional(),
  mais: z.boolean(), mais_nb_plantations: z.number().optional(), mais_superficie: z.number().optional(), mais_production: z.number().optional(),
  riz: z.boolean(), riz_nb_plantations: z.number().optional(), riz_superficie: z.number().optional(), riz_production: z.number().optional(),
  maraichere: z.boolean(), maraichere_nb_plantations: z.number().optional(), maraichere_superficie: z.number().optional(), maraichere_production: z.number().optional(),
});

type ProducteurFormData = z.infer<typeof producteurSchema>;

const steps = [
  { id: 1, name: "Informations GÃ©nÃ©rales", icon: User },
  { id: 2, name: "Conditions de Vie", icon: Home },
  { id: 3, name: "SantÃ© & Finance", icon: Heart },
  { id: 4, name: "Production Agricole", icon: Sprout },
];

export default function ProducteurForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("---");

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset, trigger } = useForm<ProducteurFormData>({
    resolver: zodResolver(producteurSchema),
    defaultValues: {
      nb_femmes: 0,
      nb_enfants: 0,
      nb_filles: 0,
      nb_garcons: 0,
      nb_moins_5_ans: 0,
      nb_enfants_scolarises: 0,
      scolarises_primaire_filles: 0,
      scolarises_primaire_garcons: 0,
      scolarises_secondaire_filles: 0,
      scolarises_secondaire_garcons: 0,
      scolarises_superieur_filles: 0,
      scolarises_superieur_garcons: 0,
      eau_courante: false,
      pompe_hydraulique: false,
      puits: false,
      riviere_marigot: false,
      electricite_reseau: false,
      electricite_solaire: false,
      electricite_lampe: false,
      electricite_aucun: false,
      interet_compte_bancaire: false,
      interet_epargne: false,
      credit_intrants: false,
      credit_soudure: false,
      pret_scolaire: false,
      credit_acces_intrants: false,
      credit_biens_conso: false,
      credit_assurance_maladie: false,
      credit_assurance_agricole: false,
      credit_assurance_retraite: false,
      credit_conseil_agricole: false,
      credit_rehabilitation: false,
      cacao_nb_plantations: 0,
      cacao_superficie: 0,
      cacao_production: 0,
      hevea: false,
      palmier: false,
      cafe: false,
      mais: false,
      riz: false,
      maraichere: false,
      telephones: [""],
    }
  });

  // Load existing data when editing
  useEffect(() => {
    if (isEdit && id) {
      setIsLoading(true);
      api.getProducteur(id)
        .then((producteur: any) => {
          reset(producteur);
          if (producteur.date_naissance) {
            const calculatedAge = calculateAge(new Date(producteur.date_naissance));
            setAge(calculatedAge);
          }
        })
        .catch((error) => {
          console.error("Error loading producteur:", error);
          toast.error("Erreur lors du chargement du producteur");
          navigate("/producteurs");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEdit, reset, navigate]);

  // Mise Ã  jour du code gÃ©nÃ©rÃ© en temps rÃ©el
  const watchedOrg = watch("organisationId");
  const watchedSec = watch("sectionId");
  const watchedVil = watch("villageId");

  useEffect(() => {
    if (watchedOrg && watchedSec && watchedVil) {
      // Extraction des codes (MockÃ©: on prend les 3 premiÃ¨res lettres ou la partie aprÃ¨s le tiret)
      const org = watchedOrg.split("-")[1] || "ORG"; // Ex: ORG-001 -> 001
      const sec = watchedSec.split("-")[1] || "SEC";
      const vil = watchedVil.split("-")[1] || "VIL";
      // Le numÃ©ro d'ordre serait dÃ©terminÃ© par le backend, ici on simule '001'
      setGeneratedCode(generateProducteurCode(org, sec, vil, 1));
    }
  }, [watchedOrg, watchedSec, watchedVil]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setValue("date_naissance", date);
    if (date) {
      const calculatedAge = calculateAge(new Date(date));
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof ProducteurFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["organisationId", "sectionId", "villageId", "nom_complet", "date_naissance"];
        break;
      case 2:
        // Pas de validation obligatoire pour les conditions de vie
        break;
      case 3:
        // Pas de validation obligatoire pour santÃ© & finance
        break;
      case 4:
        fieldsToValidate = ["cacao_nb_plantations", "cacao_superficie", "cacao_production"];
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Organisation *</Label>
                <Select onValueChange={(v) => setValue("organisationId", v)} value={watch("organisationId")}>
                  <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORG-001">SCOOP-CA Divo</SelectItem>
                    <SelectItem value="ORG-002">CAVALLY COOP</SelectItem>
                  </SelectContent>
                </Select>
                {errors.organisationId && <p className="text-destructive text-sm">{errors.organisationId.message}</p>}
              </div>
              <div>
                <Label>Section *</Label>
                <Select onValueChange={(v) => setValue("sectionId", v)} value={watch("sectionId")}>
                  <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEC-001">Section Nord</SelectItem>
                    <SelectItem value="SEC-002">Section Sud</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sectionId && <p className="text-destructive text-sm">{errors.sectionId.message}</p>}
              </div>
              <div>
                <Label>Village *</Label>
                <Select onValueChange={(v) => setValue("villageId", v)} value={watch("villageId")}>
                  <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIL-001">Village Centre</SelectItem>
                    <SelectItem value="VIL-002">Campement A</SelectItem>
                  </SelectContent>
                </Select>
                {errors.villageId && <p className="text-destructive text-sm">{errors.villageId.message}</p>}
              </div>
            </div>

            {/* Code GÃ©nÃ©rÃ© */}
            {watchedOrg && watchedSec && watchedVil && (
              <div className="p-3 bg-muted/50 rounded-md border border-dashed border-primary">
                <span className="text-sm text-muted-foreground block mb-1">Code Producteur GÃ©nÃ©rÃ© :</span>
                <span className="text-xl font-mono font-bold text-primary tracking-wider">{generatedCode}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nom et PrÃ©noms *</Label>
                <Input {...register("nom_complet")} className="uppercase" placeholder="Ex: KOUASSI JEAN" />
                {errors.nom_complet && <p className="text-destructive text-sm">{errors.nom_complet.message}</p>}
              </div>
              <div>
                <Label>Lieu de naissance</Label>
                <Input {...register("lieu_naissance")} className="uppercase" />
              </div>
              <div>
                <Label>Date de naissance *</Label>
                <div className="flex gap-4 items-center">
                  <Input type="date" {...register("date_naissance")} onChange={handleDateChange} />
                  {age !== null && (
                    <div className="bg-primary/10 text-primary px-3 py-2 rounded font-bold min-w-[100px] text-center">
                      {age} ans
                    </div>
                  )}
                </div>
                {errors.date_naissance && <p className="text-destructive text-sm">{errors.date_naissance.message}</p>}
              </div>
              <div>
                <MultiPhone
                  label="NumÃ©ros de tÃ©lÃ©phone"
                  values={watch("telephones") || []}
                  onChange={(vals) => setValue("telephones", vals)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhotoCapture label="Photo PiÃ¨ce d'identitÃ©" value={watch("photo_cni")} onChange={(v) => setValue("photo_cni", v)} />
              <PhotoCapture label="Photo Planteur" value={watch("photo_planteur")} onChange={(v) => setValue("photo_planteur", v)} />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Composition Familiale</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div><Label>Femmes</Label><Input type="number" {...register("nb_femmes", { valueAsNumber: true })} /></div>
                <div><Label>Enfants Total</Label><Input type="number" {...register("nb_enfants", { valueAsNumber: true })} /></div>
                <div><Label>Filles</Label><Input type="number" {...register("nb_filles", { valueAsNumber: true })} /></div>
                <div><Label>GarÃ§ons</Label><Input type="number" {...register("nb_garcons", { valueAsNumber: true })} /></div>
                <div><Label>Moins de 5 ans</Label><Input type="number" {...register("nb_moins_5_ans", { valueAsNumber: true })} /></div>
                <div><Label>ScolarisÃ©s Total</Label><Input type="number" {...register("nb_enfants_scolarises", { valueAsNumber: true })} /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-muted/20 p-3 rounded">
                <div>
                  <Label className="font-semibold block mb-2">Primaire</Label>
                  <div className="flex gap-2">
                    <div><Label className="text-xs">Filles</Label><Input type="number" {...register("scolarises_primaire_filles", { valueAsNumber: true })} /></div>
                    <div><Label className="text-xs">GarÃ§ons</Label><Input type="number" {...register("scolarises_primaire_garcons", { valueAsNumber: true })} /></div>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold block mb-2">Secondaire</Label>
                  <div className="flex gap-2">
                    <div><Label className="text-xs">Filles</Label><Input type="number" {...register("scolarises_secondaire_filles", { valueAsNumber: true })} /></div>
                    <div><Label className="text-xs">GarÃ§ons</Label><Input type="number" {...register("scolarises_secondaire_garcons", { valueAsNumber: true })} /></div>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold block mb-2">SupÃ©rieur</Label>
                  <div className="flex gap-2">
                    <div><Label className="text-xs">Filles</Label><Input type="number" {...register("scolarises_superieur_filles", { valueAsNumber: true })} /></div>
                    <div><Label className="text-xs">GarÃ§ons</Label><Input type="number" {...register("scolarises_superieur_garcons", { valueAsNumber: true })} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Eau</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><Checkbox checked={watch("eau_courante")} onCheckedChange={(c) => setValue("eau_courante", !!c)} /><Label>Eau courante</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("pompe_hydraulique")} onCheckedChange={(c) => setValue("pompe_hydraulique", !!c)} /><Label>Pompe hydraulique</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("puits")} onCheckedChange={(c) => setValue("puits", !!c)} /><Label>Puits</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("riviere_marigot")} onCheckedChange={(c) => setValue("riviere_marigot", !!c)} /><Label>RiviÃ¨re / Marigot</Label></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">ElectricitÃ©</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><Checkbox checked={watch("electricite_reseau")} onCheckedChange={(c) => setValue("electricite_reseau", !!c)} /><Label>RÃ©seau national</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("electricite_solaire")} onCheckedChange={(c) => setValue("electricite_solaire", !!c)} /><Label>Solaire</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("electricite_lampe")} onCheckedChange={(c) => setValue("electricite_lampe", !!c)} /><Label>Lampe</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={watch("electricite_aucun")} onCheckedChange={(c) => setValue("electricite_aucun", !!c)} /><Label>Pas du tout</Label></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
              <div>
                <Label>MatÃ©riaux de construction</Label>
                <Select onValueChange={(v) => setValue("materiaux_mur", v as any)} value={watch("materiaux_mur")}>
                  <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Terre battue sÃ©chÃ©e">Terre battue sÃ©chÃ©e</SelectItem>
                    <SelectItem value="Briques/Ciment">Briques/Ciment</SelectItem>
                    <SelectItem value="Bois">Bois</SelectItem>
                    <SelectItem value="Paille/pisÃ©">Paille/pisÃ©</SelectItem>
                    <SelectItem value="MatÃ©riaux modernes">MatÃ©riaux modernes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Toiture</Label>
                <Select onValueChange={(v) => setValue("toiture", v as any)} value={watch("toiture")}>
                  <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TÃ´le">TÃ´le</SelectItem>
                    <SelectItem value="Bambou-Plastique">Bambou-Plastique</SelectItem>
                    <SelectItem value="Paille-Plastique">Paille-Plastique</SelectItem>
                    <SelectItem value="Bambou-Paille">Bambou-Paille</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderRadioGroup("soins_plantes_tradi", "Plantes traditionnelles", ["Toujours", "Souvent", "Jamais"])}
              {renderRadioGroup("soins_dispensaire", "Dispensaire", ["Toujours", "Souvent", "Jamais"])}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Moyens utilisÃ©s</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderRadioGroup("usage_mobile_money", "Mobile Money", ["Peu", "Souvent", "Toujours", "Jamais"])}
                {renderRadioGroup("usage_virement", "Virement Bancaire", ["Peu", "Souvent", "Toujours", "Jamais"])}
                {renderRadioGroup("usage_especes", "EspÃ¨ces", ["Peu", "Souvent", "Toujours", "Jamais"])}
                {renderRadioGroup("usage_tontine", "Tontine commune", ["Peu", "Souvent", "Toujours", "Jamais"])}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">CrÃ©dit & Epargne</h3>
              <div className="space-y-2">
                {renderCreditField("interet_compte_bancaire", "IntÃ©ressÃ© par un compte bancaire", "montant_compte_bancaire")}
                {renderCreditField("interet_epargne", "IntÃ©ressÃ© par une Ã©pargne", "montant_epargne")}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">CrÃ©dit Agricole (IntÃ©rÃªt)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCreditField("credit_intrants", "CrÃ©dit intrants agricoles", "montant_credit_intrants")}
                {renderCreditField("credit_soudure", "CrÃ©dit de soudure", "montant_credit_soudure")}
                {renderCreditField("pret_scolaire", "PrÃªt scolaire", "montant_pret_scolaire")}
                {renderCreditField("credit_acces_intrants", "CrÃ©dit accÃ¨s aux intrants", "montant_credit_acces_intrants")}
                {renderCreditField("credit_biens_conso", "CrÃ©dit biens consommation", "montant_credit_biens_conso")}
                {renderCreditField("credit_assurance_maladie", "Assurance maladie", "montant_credit_assurance_maladie")}
                {renderCreditField("credit_assurance_agricole", "Assurance agricole", "montant_credit_assurance_agricole")}
                {renderCreditField("credit_assurance_retraite", "Assurance retraite", "montant_credit_assurance_retraite")}
                {renderCreditField("credit_conseil_agricole", "Conseil agricole", "montant_credit_conseil_agricole")}
                {renderCreditField("credit_rehabilitation", "CrÃ©dit rÃ©habilitation", "montant_credit_rehabilitation")}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            {/* Cacao (Toujours prÃ©sent) */}
            <div className="border p-4 rounded-lg space-y-4 bg-muted/10">
              <h3 className="font-bold text-lg">Cacao</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Nb Plantations *</Label>
                  <Input type="number" {...register("cacao_nb_plantations", { valueAsNumber: true })} />
                  {errors.cacao_nb_plantations && <p className="text-destructive text-sm">{errors.cacao_nb_plantations.message}</p>}
                </div>
                <div>
                  <Label>Superficie Totale (Ha) *</Label>
                  <Input type="number" step="0.01" {...register("cacao_superficie", { valueAsNumber: true })} />
                  {errors.cacao_superficie && <p className="text-destructive text-sm">{errors.cacao_superficie.message}</p>}
                </div>
                <div>
                  <Label>Production Totale (T) *</Label>
                  <Input type="number" step="0.01" {...register("cacao_production", { valueAsNumber: true })} />
                  {errors.cacao_production && <p className="text-destructive text-sm">{errors.cacao_production.message}</p>}
                </div>
              </div>
            </div>

            {renderCultureField("hevea", "HÃ©vÃ©a")}
            {renderCultureField("palmier", "Palmier Ã  huile")}
            {renderCultureField("cafe", "CafÃ©")}
            {renderCultureField("mais", "MaÃ¯s")}
            {renderCultureField("riz", "Riz")}
            {renderCultureField("maraichere", "Culture MaraÃ®chÃ¨re")}
          </div>
        );
      default:
        return null;
    }
  };

  const onSubmit = async (data: ProducteurFormData) => {
    setIsLoading(true);
    try {
      if (isEdit && id) {
        await api.updateProducteur(id, data);
        toast.success("Producteur mis Ã  jour avec succÃ¨s");
        navigate(`/producteurs/${id}`);
      } else {
        console.log("Producteur crÃ©Ã©:", { code: generatedCode, age, ...data });
        toast.success(`Producteur ${generatedCode} enregistrÃ© avec succÃ¨s`);
        navigate("/producteurs");
      }
    } catch (error) {
      console.error("Error saving producteur:", error);
      toast.error(isEdit ? "Erreur lors de la mise Ã  jour" : "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  const renderRadioGroup = (name: string, label: string, options: string[]) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup onValueChange={(val) => setValue(name as any, val)} className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <div key={opt} className="flex items-center space-x-2">
            <RadioGroupItem value={opt} id={`${name}-${opt}`} />
            <Label htmlFor={`${name}-${opt}`}>{opt}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const renderCreditField = (name: string, label: string, montantName: string) => (
    <div className="flex flex-col md:flex-row md:items-center gap-4 p-2 border rounded-md hover:bg-accent/5">
      <div className="flex items-center gap-2 w-1/3">
        <Checkbox checked={watch(name as any)} onCheckedChange={(chk) => setValue(name as any, !!chk)} />
        <Label className="cursor-pointer" onClick={() => setValue(name as any, !watch(name as any))}>{label}</Label>
      </div>
      {watch(name as any) && (
        <div className="flex items-center gap-2 flex-1 animate-in fade-in slide-in-from-left-5">
          <Label>Montant souhaitÃ©:</Label>
          <Input
            type="number"
            className="w-40"
            {...register(montantName as any, { valueAsNumber: true })}
            placeholder="FCFA"
          />
        </div>
      )}
    </div>
  );

  const renderCultureField = (name: string, label: string) => (
    <div className="border p-4 rounded-lg space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox checked={watch(name as any)} onCheckedChange={(chk) => setValue(name as any, !!chk)} />
        <Label className="font-bold text-lg">{label}</Label>
      </div>
      {watch(name as any) && (
        <div className="grid grid-cols-3 gap-4 pl-6 border-l-2 border-primary/20">
          <div>
            <Label>Nb Plantations</Label>
            <Input type="number" {...register(`${name}_nb_plantations` as any, { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Superficie (Ha)</Label>
            <Input type="number" step="0.01" {...register(`${name}_superficie` as any, { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Production (T)</Label>
            <Input type="number" step="0.01" {...register(`${name}_production` as any, { valueAsNumber: true })} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/producteurs")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isEdit ? "Modifier Producteur" : "Nouveau Producteur"}</h1>
          <p className="text-muted-foreground">Saisie dÃ©taillÃ©e du profil producteur</p>
        </div>
      </div>

      {/* Instructions (#11) */}
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4" />
        <AlertTitle>Instructions aux EnquÃªteurs</AlertTitle>
        <AlertDescription>
          1. VÃ©rifiez que vous Ãªtes dans le bon village avant de commencer.<br />
          2. Demandez la piÃ¨ce d'identitÃ© du producteur pour saisir le nom exact.<br />
          3. Prenez des photos claires et bien cadrÃ©es.<br />
          4. Tous les champs marquÃ©s d'un astÃ©risque (*) sont obligatoires.
        </AlertDescription>
      </Alert>

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
          <CardContent className="space-y-6">
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
            <Button type="button" variant="outline" onClick={() => navigate("/producteurs")}>
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
                {isEdit ? "Mettre Ã  jour" : "Enregistrer le Producteur"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
