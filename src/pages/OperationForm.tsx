import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Leaf, Scissors, Truck, Wind, Sun, Package, Scale, Banknote, User } from "lucide-react";
import PhotoCapture from "@/components/forms/PhotoCapture";
import DateInput from "@/components/forms/DateInput";
import { generateOperationCode } from "@/utils/codeGenerators";

// 0. Identification
const identificationSchema = z.object({
  idProducteur: z.string().min(1, "Producteur requis"),
  idPlantation: z.string().min(1, "Plantation requise"),
});

// 1. Récolte
const recolteSchema = z.object({
  dateRecolte1: z.string().min(1, "Date 1 requise"), photoRecolte1: z.string().optional(),
  dateRecolte2: z.string().optional(), photoRecolte2: z.string().optional(),
  dateRecolte3: z.string().optional(), photoRecolte3: z.string().optional(),
});

// 2. Ecabossage
const ecabossageSchema = z.object({
  dateEcabossage: z.string().min(1, "Date requise"),
  heureDebut: z.string().min(1, "Début requis"),
  heureFin: z.string().min(1, "Fin requise"),
  cout: z.number().min(0),
  outils_machette: z.boolean(),
  outils_gourdin: z.boolean(),
  outils_couteau: z.boolean(),
  outils_autres: z.string().optional(),
});

// 3. Transport (Champ -> Village/Ferm)
const transportSchema = z.object({
  dateTransport: z.string().min(1, "Date requise"),
});

// 4. Fermentation
const fermentationSchema = z.object({
  dateDebut: z.string().min(1, "Début requis"),
  dateFin: z.string().min(1, "Fin requise"),
  materiel_feuilles: z.boolean(),
  materiel_caisses: z.boolean(),
  materiel_autres: z.string().optional(),
});

// 5. Séchage
const sechageSchema = z.object({
  dateDebut: z.string().min(1, "Début requis"),
  dateFin: z.string().min(1, "Fin requise"),
  aire_claie_bambou: z.boolean(),
  aire_plastique_sol: z.boolean(),
  aire_plastique_ciment: z.boolean(),
  aire_cimentee: z.boolean(),
  aire_ensachage: z.boolean(),
});

// 6. Ensachage
const ensachageSchema = z.object({
  dateDebut: z.string().min(1, "Début requis"),
  dateFin: z.string().min(1, "Fin requise"),
  nbSacs: z.number().min(1, "Au moins 1 sac"),
  poidsEstimatif: z.number().min(0),
  lieuStockage: z.enum(["Bon", "Acceptable", "Mauvais"]),
  dateLivraison: z.string().min(1, "Date livraison requise"),
});

// 7. Manutention (Réception)
const manutentionSchema = z.object({
  dechargement: z.boolean(),
  sonde: z.boolean(),
  pesee: z.number().min(0, "Poids requis"),
  analyse: z.boolean(),
  validation: z.enum(["Accepté", "Refoulé", "A reconditionner"]),
});

// 8. Paiement
const paiementSchema = z.object({
  especes: z.boolean(), montantEspeces: z.number().optional(),
  cheque: z.boolean(), montantCheque: z.number().optional(), numeroCheque: z.string().optional(), banque: z.string().optional(),
  
  retenueMec: z.boolean(), tauxMec: z.number().optional(),
  retenueEpargne: z.boolean(), tauxEpargne: z.number().optional(),
});

const steps = [
  { id: 1, name: "Ident.", icon: User },
  { id: 2, name: "Récolte", icon: Leaf },
  { id: 3, name: "Écabossage", icon: Scissors },
  { id: 4, name: "Transport", icon: Truck },
  { id: 5, name: "Fermentation", icon: Wind },
  { id: 6, name: "Séchage", icon: Sun },
  { id: 7, name: "Ensachage", icon: Package },
  { id: 8, name: "Manutention", icon: Scale },
  { id: 9, name: "Paiement", icon: Banknote },
];

export default function OperationForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const form0 = useForm({ resolver: zodResolver(identificationSchema) });
  const form1 = useForm({ resolver: zodResolver(recolteSchema) });
  const form2 = useForm({ resolver: zodResolver(ecabossageSchema), defaultValues: { outils_machette: false, outils_gourdin: false, outils_couteau: false, cout: 0 } });
  const form3 = useForm({ resolver: zodResolver(transportSchema) });
  const form4 = useForm({ resolver: zodResolver(fermentationSchema), defaultValues: { materiel_feuilles: false, materiel_caisses: false } });
  const form5 = useForm({ resolver: zodResolver(sechageSchema), defaultValues: { aire_claie_bambou: false, aire_plastique_sol: false, aire_plastique_ciment: false, aire_cimentee: false, aire_ensachage: false } });
  const form6 = useForm({ resolver: zodResolver(ensachageSchema), defaultValues: { nbSacs: 0, poidsEstimatif: 0 } });
  const form7 = useForm({ resolver: zodResolver(manutentionSchema), defaultValues: { dechargement: false, sonde: false, analyse: false, pesee: 0, validation: "Accepté" } });
  const form8 = useForm({ resolver: zodResolver(paiementSchema), defaultValues: { especes: false, cheque: false, retenueMec: false, retenueEpargne: false } });

  const handleNext = async () => {
    let isValid = false;
    switch (currentStep) {
      case 1: isValid = await form0.trigger(); break;
      case 2: isValid = await form1.trigger(); break;
      case 3: isValid = await form2.trigger(); break;
      case 4: isValid = await form3.trigger(); break;
      case 5: isValid = await form4.trigger(); break;
      case 6: isValid = await form5.trigger(); break;
      case 7: isValid = await form6.trigger(); break;
      case 8: isValid = await form7.trigger(); break;
      case 9: isValid = await form8.trigger(); break;
    }
    if (isValid) {
      if (currentStep < 9) setCurrentStep(c => c + 1);
      else handleSubmit();
    }
  };

  const handleSubmit = () => {
    const data = {
      identification: form0.getValues(),
      recolte: form1.getValues(),
      ecabossage: form2.getValues(),
      transport: form3.getValues(),
      fermentation: form4.getValues(),
      sechage: form5.getValues(),
      ensachage: form6.getValues(),
      manutention: form7.getValues(),
      paiement: form8.getValues(),
    };
    const code = generateOperationCode(new Date().getFullYear(), Math.floor(Math.random() * 100));
    console.log("Opération Complète:", { code, ...data });
    toast.success(`Opération ${code} enregistrée avec succès`);
    navigate("/operations");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Identification
        return (
          <div className="space-y-6">
             <div className="space-y-2">
               <Label>Producteur *</Label>
               <Select onValueChange={v => form0.setValue("idProducteur", v)}>
                 <SelectTrigger><SelectValue placeholder="Rechercher un producteur..." /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="PROD-001">Kouassi Jean (VIL-001)</SelectItem>
                   <SelectItem value="PROD-002">Koné Moussa (VIL-002)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div className="space-y-2">
               <Label>Plantation Concernée *</Label>
               <Select onValueChange={v => form0.setValue("idPlantation", v)} disabled={!form0.watch("idProducteur")}>
                 <SelectTrigger><SelectValue placeholder="Choisir une plantation..." /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="PLT-001">Plantation Cacao - Nord (3.5 Ha)</SelectItem>
                   <SelectItem value="PLT-002">Plantation Cacao - Bas-fond (2.1 Ha)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>
        );
      case 2: // Récolte
        return (
          <div className="space-y-6">
             <div className="grid gap-4 border p-4 rounded">
               <Label className="font-bold">Récolte 1</Label>
               <DateInput label="Date" value={form1.watch("dateRecolte1")} onChange={v => form1.setValue("dateRecolte1", v)} />
               <PhotoCapture label="Photo" value={form1.watch("photoRecolte1")} onChange={v => form1.setValue("photoRecolte1", v)} />
             </div>
             <div className="grid gap-4 border p-4 rounded">
               <Label className="font-bold">Récolte 2</Label>
               <DateInput label="Date" value={form1.watch("dateRecolte2")} onChange={v => form1.setValue("dateRecolte2", v)} />
               <PhotoCapture label="Photo" value={form1.watch("photoRecolte2")} onChange={v => form1.setValue("photoRecolte2", v)} />
             </div>
             <div className="grid gap-4 border p-4 rounded">
               <Label className="font-bold">Récolte 3</Label>
               <DateInput label="Date" value={form1.watch("dateRecolte3")} onChange={v => form1.setValue("dateRecolte3", v)} />
               <PhotoCapture label="Photo" value={form1.watch("photoRecolte3")} onChange={v => form1.setValue("photoRecolte3", v)} />
             </div>
          </div>
        );
      case 3: // Ecabossage
        return (
          <div className="space-y-6">
            <DateInput label="Date" value={form2.watch("dateEcabossage")} onChange={v => form2.setValue("dateEcabossage", v)} />
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Début</Label><Input type="time" {...form2.register("heureDebut")} /></div>
              <div><Label>Fin</Label><Input type="time" {...form2.register("heureFin")} /></div>
            </div>
            <div><Label>Coût (FCFA)</Label><Input type="number" {...form2.register("cout", { valueAsNumber: true })} /></div>
            <div className="space-y-2">
              <Label className="font-bold">Outils utilisés</Label>
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2"><Checkbox checked={form2.watch("outils_machette")} onCheckedChange={c => form2.setValue("outils_machette", !!c)} /><Label>Machette</Label></div>
                <div className="flex items-center gap-2"><Checkbox checked={form2.watch("outils_gourdin")} onCheckedChange={c => form2.setValue("outils_gourdin", !!c)} /><Label>Gourdin</Label></div>
                <div className="flex items-center gap-2"><Checkbox checked={form2.watch("outils_couteau")} onCheckedChange={c => form2.setValue("outils_couteau", !!c)} /><Label>Couteau</Label></div>
              </div>
              <Input placeholder="Autres..." {...form2.register("outils_autres")} />
            </div>
          </div>
        );
      case 4: // Transport
        return (
          <div className="space-y-4">
             <DateInput label="Date Transport" value={form3.watch("dateTransport")} onChange={v => form3.setValue("dateTransport", v)} />
          </div>
        );
      case 5: // Fermentation
        return (
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <DateInput label="Début" value={form4.watch("dateDebut")} onChange={v => form4.setValue("dateDebut", v)} />
               <DateInput label="Fin" value={form4.watch("dateFin")} onChange={v => form4.setValue("dateFin", v)} />
             </div>
             <div className="space-y-2">
               <Label className="font-bold">Matériel utilisé</Label>
               <div className="flex gap-4 flex-wrap">
                 <div className="flex items-center gap-2"><Checkbox checked={form4.watch("materiel_feuilles")} onCheckedChange={c => form4.setValue("materiel_feuilles", !!c)} /><Label>Feuilles de bananier</Label></div>
                 <div className="flex items-center gap-2"><Checkbox checked={form4.watch("materiel_caisses")} onCheckedChange={c => form4.setValue("materiel_caisses", !!c)} /><Label>Caisses de fermentation</Label></div>
               </div>
               <Input placeholder="Autres..." {...form4.register("materiel_autres")} />
             </div>
          </div>
        );
      case 6: // Séchage
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <DateInput label="Début" value={form5.watch("dateDebut")} onChange={v => form5.setValue("dateDebut", v)} />
               <DateInput label="Fin" value={form5.watch("dateFin")} onChange={v => form5.setValue("dateFin", v)} />
             </div>
             <div className="space-y-2">
               <Label className="font-bold">Aire de séchage</Label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div className="flex items-center gap-2"><Checkbox checked={form5.watch("aire_claie_bambou")} onCheckedChange={c => form5.setValue("aire_claie_bambou", !!c)} /><Label>Claie en bambou</Label></div>
                 <div className="flex items-center gap-2"><Checkbox checked={form5.watch("aire_plastique_sol")} onCheckedChange={c => form5.setValue("aire_plastique_sol", !!c)} /><Label>Plastique sur sol</Label></div>
                 <div className="flex items-center gap-2"><Checkbox checked={form5.watch("aire_plastique_ciment")} onCheckedChange={c => form5.setValue("aire_plastique_ciment", !!c)} /><Label>Plastique sur aire cimentée</Label></div>
                 <div className="flex items-center gap-2"><Checkbox checked={form5.watch("aire_cimentee")} onCheckedChange={c => form5.setValue("aire_cimentee", !!c)} /><Label>Aire cimentée</Label></div>
                 <div className="flex items-center gap-2"><Checkbox checked={form5.watch("aire_ensachage")} onCheckedChange={c => form5.setValue("aire_ensachage", !!c)} /><Label>Ensachage direct</Label></div>
               </div>
             </div>
          </div>
        );
      case 7: // Ensachage
        return (
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <DateInput label="Début" value={form6.watch("dateDebut")} onChange={v => form6.setValue("dateDebut", v)} />
               <DateInput label="Fin" value={form6.watch("dateFin")} onChange={v => form6.setValue("dateFin", v)} />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div><Label>Nombre de sacs brousse</Label><Input type="number" {...form6.register("nbSacs", { valueAsNumber: true })} /></div>
               <div><Label>Poids estimatif (Kg)</Label><Input type="number" {...form6.register("poidsEstimatif", { valueAsNumber: true })} /></div>
             </div>
             <div>
               <Label>Lieu de stockage (État)</Label>
               <Select onValueChange={v => form6.setValue("lieuStockage", v as any)}><SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger><SelectContent><SelectItem value="Bon">Bon</SelectItem><SelectItem value="Acceptable">Acceptable</SelectItem><SelectItem value="Mauvais">Mauvais</SelectItem></SelectContent></Select>
             </div>
             <DateInput label="Date Livraison Coop/Acheteur" value={form6.watch("dateLivraison")} onChange={v => form6.setValue("dateLivraison", v)} />
           </div>
        );
      case 8: // Manutention
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2"><Checkbox checked={form7.watch("dechargement")} onCheckedChange={c => form7.setValue("dechargement", !!c)} /><Label>Déchargement effectué</Label></div>
               <div className="flex items-center gap-2"><Checkbox checked={form7.watch("sonde")} onCheckedChange={c => form7.setValue("sonde", !!c)} /><Label>Sonde effectuée</Label></div>
               <div className="flex items-center gap-2"><Checkbox checked={form7.watch("analyse")} onCheckedChange={c => form7.setValue("analyse", !!c)} /><Label>Analyse Produit effectuée</Label></div>
            </div>
            <div><Label>Pesée validée (Kg)</Label><Input type="number" {...form7.register("pesee", { valueAsNumber: true })} /></div>
            <div>
              <Label>Validation du Produit</Label>
              <Select onValueChange={v => form7.setValue("validation", v as any)} defaultValue="Accepté">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accepté" className="text-green-600">Accepté</SelectItem>
                  <SelectItem value="Refoulé" className="text-red-600">Refoulé</SelectItem>
                  <SelectItem value="A reconditionner" className="text-orange-600">A reconditionner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 9: // Paiement
        return (
          <div className="space-y-6">
            <div className="border p-4 rounded space-y-3">
               <div className="flex items-center gap-2"><Checkbox checked={form8.watch("especes")} onCheckedChange={c => form8.setValue("especes", !!c)} /><Label className="font-bold">Espèces</Label></div>
               {form8.watch("especes") && <Input placeholder="Montant FCFA" type="number" {...form8.register("montantEspeces", { valueAsNumber: true })} />}
            </div>
            <div className="border p-4 rounded space-y-3">
               <div className="flex items-center gap-2"><Checkbox checked={form8.watch("cheque")} onCheckedChange={c => form8.setValue("cheque", !!c)} /><Label className="font-bold">Chèque</Label></div>
               {form8.watch("cheque") && (
                 <div className="grid grid-cols-1 gap-3">
                   <Input placeholder="Montant FCFA" type="number" {...form8.register("montantCheque", { valueAsNumber: true })} />
                   <Input placeholder="Numéro Chèque" {...form8.register("numeroCheque")} />
                   <Input placeholder="Banque" {...form8.register("banque")} />
                 </div>
               )}
            </div>
            <div className="border-t pt-4 space-y-3">
               <Label className="font-bold block">Retenues</Label>
               <div className="flex items-center gap-4">
                 <Checkbox checked={form8.watch("retenueMec")} onCheckedChange={c => form8.setValue("retenueMec", !!c)} />
                 <Label>MEC</Label>
                 {form8.watch("retenueMec") && <Input className="w-32" placeholder="Taux/Kg" type="number" {...form8.register("tauxMec", { valueAsNumber: true })} />}
               </div>
               <div className="flex items-center gap-4">
                 <Checkbox checked={form8.watch("retenueEpargne")} onCheckedChange={c => form8.setValue("retenueEpargne", !!c)} />
                 <Label>Autres (Epargne)</Label>
                 {form8.watch("retenueEpargne") && <Input className="w-32" placeholder="Taux/Kg" type="number" {...form8.register("tauxEpargne", { valueAsNumber: true })} />}
               </div>
            </div>
          </div>
        );
    }
  };

  const CurrentStepIcon = steps[currentStep - 1].icon;
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/operations")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Nouvelle Opération</h1>
        <p className="text-muted-foreground mt-2">Flux complet de la récolte au paiement</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 overflow-x-auto pb-2">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center min-w-[80px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                </div>
                <span className={`text-xs mt-1 font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>{step.name}</span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrentStepIcon className="h-6 w-6 text-primary" />
            {steps[currentStep - 1].name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button variant="outline" onClick={() => setCurrentStep(c => Math.max(1, c - 1))} disabled={currentStep === 1}>
              Précédent
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
