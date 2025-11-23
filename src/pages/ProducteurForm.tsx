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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PhotoCapture from "@/components/forms/PhotoCapture";
import MultiPhone from "@/components/forms/MultiPhone";
import { ArrowLeft, Save, Info } from "lucide-react";
import { toast } from "sonner";
import { generateProducteurCode, calculateAge } from "@/utils/codification";
import { useState, useEffect } from "react";

const producteurSchema = z.object({
  // Rattachement
  organisationId: z.string().min(1, "Organisation requise"),
  sectionId: z.string().min(1, "Section requise"),
  villageId: z.string().min(1, "Village requis"),

  // Infos générales
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

  // Conditions de vie - Electricité
  electricite_reseau: z.boolean(),
  electricite_solaire: z.boolean(),
  electricite_lampe: z.boolean(),
  electricite_aucun: z.boolean(),

  // Logement
  materiaux_mur: z.enum(["Terre battue séchée", "Briques/Ciment", "Bois", "Paille/pisé", "Matériaux modernes"]).optional(),
  toiture: z.enum(["Tôle", "Bambou-Plastique", "Paille-Plastique", "Bambou-Paille"]).optional(),

  // Soins
  soins_plantes_tradi: z.enum(["Toujours", "Souvent", "Jamais"]).optional(),
  soins_dispensaire: z.enum(["Toujours", "Souvent", "Jamais"]).optional(),

  // Crédit / Epargne
  interet_compte_bancaire: z.boolean(),
  montant_compte_bancaire: z.number().optional(),
  interet_epargne: z.boolean(),
  montant_epargne: z.number().optional(),

  // Moyens paiement
  usage_mobile_money: z.enum(["Peu", "Souvent", "Toujours", "Jamais"]).optional(),
  usage_virement: z.enum(["Peu", "Souvent", "Toujours", "Jamais"]).optional(),
  usage_especes: z.enum(["Peu", "Souvent", "Toujours", "Jamais"]).optional(),
  usage_tontine: z.enum(["Peu", "Souvent", "Toujours", "Jamais"]).optional(),

  // Crédit Agricole
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

export default function ProducteurForm() {
  const navigate = useNavigate();
  const [age, setAge] = useState<number | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("---");
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProducteurFormData>({
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

  // Mise à jour du code généré en temps réel
  const watchedOrg = watch("organisationId");
  const watchedSec = watch("sectionId");
  const watchedVil = watch("villageId");

  useEffect(() => {
    if (watchedOrg && watchedSec && watchedVil) {
      // Extraction des codes (Mocké: on prend les 3 premières lettres ou la partie après le tiret)
      const org = watchedOrg.split("-")[1] || "ORG"; // Ex: ORG-001 -> 001
      const sec = watchedSec.split("-")[1] || "SEC";
      const vil = watchedVil.split("-")[1] || "VIL";
      // Le numéro d'ordre serait déterminé par le backend, ici on simule '001'
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

  const onSubmit = (data: ProducteurFormData) => {
    try {
      console.log("Producteur créé:", { code: generatedCode, age, ...data });
      toast.success(`Producteur ${generatedCode} enregistré avec succès`);
      navigate("/producteurs");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
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
          <Label>Montant souhaité:</Label>
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
          <h1 className="text-3xl font-bold text-foreground">Nouveau Producteur</h1>
          <p className="text-muted-foreground">Saisie détaillée du profil producteur</p>
        </div>
      </div>

      {/* Instructions (#11) */}
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4" />
        <AlertTitle>Instructions aux Enquêteurs</AlertTitle>
        <AlertDescription>
          1. Vérifiez que vous êtes dans le bon village avant de commencer.<br/>
          2. Demandez la pièce d'identité du producteur pour saisir le nom exact.<br/>
          3. Prenez des photos claires et bien cadrées.<br/>
          4. Tous les champs marqués d'un astérisque (*) sont obligatoires.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* 1. Rattachement & Infos Générales */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Informations Générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                 <Label>Organisation *</Label>
                 <Select onValueChange={(v) => setValue("organisationId", v)}>
                   <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="ORG-001">SCOOP-CA Divo</SelectItem>
                     <SelectItem value="ORG-002">CAVALLY COOP</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div>
                 <Label>Section *</Label>
                 <Select onValueChange={(v) => setValue("sectionId", v)}>
                   <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="SEC-001">Section Nord</SelectItem>
                     <SelectItem value="SEC-002">Section Sud</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div>
                 <Label>Village *</Label>
                 <Select onValueChange={(v) => setValue("villageId", v)}>
                   <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="VIL-001">Village Centre</SelectItem>
                     <SelectItem value="VIL-002">Campement A</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
            </div>
            
            {/* Code Généré (#10) */}
            {watchedOrg && watchedSec && watchedVil && (
              <div className="p-3 bg-muted/50 rounded-md border border-dashed border-primary">
                <span className="text-sm text-muted-foreground block mb-1">Code Producteur Généré :</span>
                <span className="text-xl font-mono font-bold text-primary tracking-wider">{generatedCode}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nom et Prénoms *</Label>
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
              </div>
              <div>
                <MultiPhone 
                  label="Numéros de téléphone" 
                  values={watch("telephones") || []} 
                  onChange={(vals) => setValue("telephones", vals)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhotoCapture label="Photo Pièce d'identité" value={watch("photo_cni")} onChange={(v) => setValue("photo_cni", v)} />
              <PhotoCapture label="Photo Planteur" value={watch("photo_planteur")} onChange={(v) => setValue("photo_planteur", v)} />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Composition Familiale</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                 <div><Label>Femmes</Label><Input type="number" {...register("nb_femmes", { valueAsNumber: true })} /></div>
                 <div><Label>Enfants Total</Label><Input type="number" {...register("nb_enfants", { valueAsNumber: true })} /></div>
                 <div><Label>Filles</Label><Input type="number" {...register("nb_filles", { valueAsNumber: true })} /></div>
                 <div><Label>Garçons</Label><Input type="number" {...register("nb_garcons", { valueAsNumber: true })} /></div>
                 <div><Label>Moins de 5 ans</Label><Input type="number" {...register("nb_moins_5_ans", { valueAsNumber: true })} /></div>
                 <div><Label>Scolarisés Total</Label><Input type="number" {...register("nb_enfants_scolarises", { valueAsNumber: true })} /></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-muted/20 p-3 rounded">
                <div>
                  <Label className="font-semibold block mb-2">Primaire</Label>
                  <div className="flex gap-2">
                    <div><Label className="text-xs">Filles</Label><Input type="number" {...register("scolarises_primaire_filles", { valueAsNumber: true })} /></div>
                    <div><Label className="text-xs">Garçons</Label><Input type="number" {...register("scolarises_primaire_garcons", { valueAsNumber: true })} /></div>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold block mb-2">Secondaire</Label>
                  <div className="flex gap-2">
                    <div><Label className="text-xs">Filles</Label><Input type="number" {...register("scolarises_secondaire_filles", { valueAsNumber: true })} /></div>
                    <div><Label className="text-xs">Garçons</Label><Input type="number" {...register("scolarises_secondaire_garcons", { valueAsNumber: true })} /></div>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold block mb-2">Supérieur</Label>
                  <div className="flex gap-2">
                    <div><Label className="text-xs">Filles</Label><Input type="number" {...register("scolarises_superieur_filles", { valueAsNumber: true })} /></div>
                    <div><Label className="text-xs">Garçons</Label><Input type="number" {...register("scolarises_superieur_garcons", { valueAsNumber: true })} /></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Conditions de vie */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Conditions de Vie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h3 className="font-semibold mb-2">Eau</h3>
                 <div className="space-y-2">
                   <div className="flex items-center gap-2"><Checkbox checked={watch("eau_courante")} onCheckedChange={(c) => setValue("eau_courante", !!c)} /><Label>Eau courante</Label></div>
                   <div className="flex items-center gap-2"><Checkbox checked={watch("pompe_hydraulique")} onCheckedChange={(c) => setValue("pompe_hydraulique", !!c)} /><Label>Pompe hydraulique</Label></div>
                   <div className="flex items-center gap-2"><Checkbox checked={watch("puits")} onCheckedChange={(c) => setValue("puits", !!c)} /><Label>Puits</Label></div>
                   <div className="flex items-center gap-2"><Checkbox checked={watch("riviere_marigot")} onCheckedChange={(c) => setValue("riviere_marigot", !!c)} /><Label>Rivière / Marigot</Label></div>
                 </div>
               </div>
               <div>
                 <h3 className="font-semibold mb-2">Electricité</h3>
                 <div className="space-y-2">
                   <div className="flex items-center gap-2"><Checkbox checked={watch("electricite_reseau")} onCheckedChange={(c) => setValue("electricite_reseau", !!c)} /><Label>Réseau national</Label></div>
                   <div className="flex items-center gap-2"><Checkbox checked={watch("electricite_solaire")} onCheckedChange={(c) => setValue("electricite_solaire", !!c)} /><Label>Solaire</Label></div>
                   <div className="flex items-center gap-2"><Checkbox checked={watch("electricite_lampe")} onCheckedChange={(c) => setValue("electricite_lampe", !!c)} /><Label>Lampe</Label></div>
                   <div className="flex items-center gap-2"><Checkbox checked={watch("electricite_aucun")} onCheckedChange={(c) => setValue("electricite_aucun", !!c)} /><Label>Pas du tout</Label></div>
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
               <div>
                 <Label>Matériaux de construction</Label>
                 <Select onValueChange={(v) => setValue("materiaux_mur", v as any)}>
                   <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Terre battue séchée">Terre battue séchée</SelectItem>
                     <SelectItem value="Briques/Ciment">Briques/Ciment</SelectItem>
                     <SelectItem value="Bois">Bois</SelectItem>
                     <SelectItem value="Paille/pisé">Paille/pisé</SelectItem>
                     <SelectItem value="Matériaux modernes">Matériaux modernes</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div>
                 <Label>Toiture</Label>
                 <Select onValueChange={(v) => setValue("toiture", v as any)}>
                   <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Tôle">Tôle</SelectItem>
                     <SelectItem value="Bambou-Plastique">Bambou-Plastique</SelectItem>
                     <SelectItem value="Paille-Plastique">Paille-Plastique</SelectItem>
                     <SelectItem value="Bambou-Paille">Bambou-Paille</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* 3. Accès aux soins & Moyens */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Santé & Finance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderRadioGroup("soins_plantes_tradi", "Plantes traditionnelles", ["Toujours", "Souvent", "Jamais"])}
              {renderRadioGroup("soins_dispensaire", "Dispensaire", ["Toujours", "Souvent", "Jamais"])}
            </div>

            <div className="border-t pt-4">
               <h3 className="font-semibold mb-3">Moyens utilisés</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {renderRadioGroup("usage_mobile_money", "Mobile Money", ["Peu", "Souvent", "Toujours", "Jamais"])}
                 {renderRadioGroup("usage_virement", "Virement Bancaire", ["Peu", "Souvent", "Toujours", "Jamais"])}
                 {renderRadioGroup("usage_especes", "Espèces", ["Peu", "Souvent", "Toujours", "Jamais"])}
                 {renderRadioGroup("usage_tontine", "Tontine commune", ["Peu", "Souvent", "Toujours", "Jamais"])}
               </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Crédit & Epargne</h3>
              <div className="space-y-2">
                 {renderCreditField("interet_compte_bancaire", "Intéressé par un compte bancaire", "montant_compte_bancaire")}
                 {renderCreditField("interet_epargne", "Intéressé par une épargne", "montant_epargne")}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Crédit Agricole (Intérêt)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {renderCreditField("credit_intrants", "Crédit intrants agricoles", "montant_credit_intrants")}
                 {renderCreditField("credit_soudure", "Crédit de soudure", "montant_credit_soudure")}
                 {renderCreditField("pret_scolaire", "Prêt scolaire", "montant_pret_scolaire")}
                 {renderCreditField("credit_acces_intrants", "Crédit accès aux intrants", "montant_credit_acces_intrants")}
                 {renderCreditField("credit_biens_conso", "Crédit biens consommation", "montant_credit_biens_conso")}
                 {renderCreditField("credit_assurance_maladie", "Assurance maladie", "montant_credit_assurance_maladie")}
                 {renderCreditField("credit_assurance_agricole", "Assurance agricole", "montant_credit_assurance_agricole")}
                 {renderCreditField("credit_assurance_retraite", "Assurance retraite", "montant_credit_assurance_retraite")}
                 {renderCreditField("credit_conseil_agricole", "Conseil agricole", "montant_credit_conseil_agricole")}
                 {renderCreditField("credit_rehabilitation", "Crédit réhabilitation", "montant_credit_rehabilitation")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Production Agricole */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Production Agricole</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Cacao (Toujours présent) */}
            <div className="border p-4 rounded-lg space-y-4 bg-muted/10">
              <h3 className="font-bold text-lg">Cacao</h3>
              <div className="grid grid-cols-3 gap-4">
                 <div>
                   <Label>Nb Plantations</Label>
                   <Input type="number" {...register("cacao_nb_plantations", { valueAsNumber: true })} />
                 </div>
                 <div>
                   <Label>Superficie Totale (Ha)</Label>
                   <Input type="number" step="0.01" {...register("cacao_superficie", { valueAsNumber: true })} />
                 </div>
                 <div>
                   <Label>Production Totale (T)</Label>
                   <Input type="number" step="0.01" {...register("cacao_production", { valueAsNumber: true })} />
                 </div>
              </div>
            </div>

            {renderCultureField("hevea", "Hévéa")}
            {renderCultureField("palmier", "Palmier à huile")}
            {renderCultureField("cafe", "Café")}
            {renderCultureField("mais", "Maïs")}
            {renderCultureField("riz", "Riz")}
            {renderCultureField("maraichere", "Culture Maraîchère")}

          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end pt-4">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/producteurs")}>
            Annuler
          </Button>
          <Button type="submit" size="lg" className="gap-2 bg-primary hover:bg-primary/90">
            <Save className="h-5 w-5" />
            Enregistrer le Producteur
          </Button>
        </div>
      </form>
    </div>
  );
}
