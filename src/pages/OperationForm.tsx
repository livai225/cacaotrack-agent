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
import { ArrowLeft, ArrowRight, Check, Leaf, Scissors, Wind, Sun, Truck } from "lucide-react";
import PhotoCapture from "@/components/forms/PhotoCapture";
import DateInput from "@/components/forms/DateInput";
import { generateOperationCode, calculateDurationMinutes, calculateDurationDays, calculateLoyaute } from "@/utils/codeGenerators";

// Schéma de validation pour l'étape Récolte
const recolteSchema = z.object({
  dateRecolte1: z.string().min(1, "Date requise"),
  quantiteRecolte1: z.number().min(0, "Quantité invalide"),
  photoRecolte1: z.string().optional(),
  dateRecolte2: z.string().optional(),
  quantiteRecolte2: z.number().min(0).optional(),
  photoRecolte2: z.string().optional(),
  dateRecolte3: z.string().optional(),
  quantiteRecolte3: z.number().min(0).optional(),
  photoRecolte3: z.string().optional(),
  quantiteLivreeAsco: z.number().min(0, "Quantité requise"),
});

// Schéma pour Écabossage
const ecabossageSchema = z.object({
  dateEcabossage: z.string().min(1, "Date requise"),
  heureDebut: z.string().min(1, "Heure requise"),
  heureFin: z.string().min(1, "Heure requise"),
  cout: z.number().min(0, "Coût invalide"),
  outils: z.array(z.string()).min(1, "Sélectionnez au moins un outil"),
});

// Schéma pour Fermentation
const fermentationSchema = z.object({
  dateDebut: z.string().min(1, "Date requise"),
  dateFin: z.string().min(1, "Date requise"),
  typeFermentation: z.string().min(1, "Type requis"),
});

// Schéma pour Séchage
const sechageSchema = z.object({
  dateDebut: z.string().min(1, "Date requise"),
  dateFin: z.string().min(1, "Date requise"),
  typeSechage: z.string().min(1, "Type requis"),
});

// Schéma pour Transport
const transportSchema = z.object({
  dateTransport: z.string().min(1, "Date requise"),
  distance: z.number().min(0, "Distance invalide"),
  cout: z.number().min(0, "Coût invalide"),
  destination: z.string().min(1, "Destination requise"),
});

const steps = [
  { id: 1, name: "Récolte", icon: Leaf },
  { id: 2, name: "Écabossage", icon: Scissors },
  { id: 3, name: "Fermentation", icon: Wind },
  { id: 4, name: "Séchage", icon: Sun },
  { id: 5, name: "Transport", icon: Truck },
];

export default function OperationForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Formulaires pour chaque étape
  const recolteForm = useForm({
    resolver: zodResolver(recolteSchema),
    defaultValues: {
      dateRecolte1: "",
      quantiteRecolte1: 0,
      photoRecolte1: "",
      dateRecolte2: "",
      quantiteRecolte2: 0,
      photoRecolte2: "",
      dateRecolte3: "",
      quantiteRecolte3: 0,
      photoRecolte3: "",
      quantiteLivreeAsco: 0,
    },
  });

  const ecabossageForm = useForm({
    resolver: zodResolver(ecabossageSchema),
    defaultValues: {
      dateEcabossage: "",
      heureDebut: "",
      heureFin: "",
      cout: 0,
      outils: [],
    },
  });

  const fermentationForm = useForm({
    resolver: zodResolver(fermentationSchema),
    defaultValues: {
      dateDebut: "",
      dateFin: "",
      typeFermentation: "",
    },
  });

  const sechageForm = useForm({
    resolver: zodResolver(sechageSchema),
    defaultValues: {
      dateDebut: "",
      dateFin: "",
      typeSechage: "",
    },
  });

  const transportForm = useForm({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      dateTransport: "",
      distance: 0,
      cout: 0,
      destination: "",
    },
  });

  // Calcul de la quantité totale récoltée
  const getQuantiteTotale = () => {
    const data = recolteForm.getValues();
    return (data.quantiteRecolte1 || 0) + (data.quantiteRecolte2 || 0) + (data.quantiteRecolte3 || 0);
  };

  // Calcul du taux de loyauté
  const getTauxLoyaute = () => {
    const data = recolteForm.getValues();
    const total = getQuantiteTotale();
    return calculateLoyaute(data.quantiteLivreeAsco || 0, total);
  };

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await recolteForm.trigger();
        break;
      case 2:
        isValid = await ecabossageForm.trigger();
        break;
      case 3:
        isValid = await fermentationForm.trigger();
        break;
      case 4:
        isValid = await sechageForm.trigger();
        break;
      case 5:
        isValid = await transportForm.trigger();
        break;
    }

    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const recolteData = recolteForm.getValues();
    const ecabossageData = ecabossageForm.getValues();
    const fermentationData = fermentationForm.getValues();
    const sechageData = sechageForm.getValues();
    const transportData = transportForm.getValues();

    const operationCode = generateOperationCode(new Date().getFullYear(), 1);
    const tauxLoyaute = getTauxLoyaute();

    console.log("Opération créée:", {
      code: operationCode,
      recolte: recolteData,
      ecabossage: ecabossageData,
      fermentation: fermentationData,
      sechage: sechageData,
      transport: transportData,
      tauxLoyaute: `${tauxLoyaute}%`,
    });

    toast.success(`Opération ${operationCode} créée avec succès! Taux de loyauté: ${tauxLoyaute}%`);
    navigate("/operations");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Récolte 1</h3>
                <DateInput
                  label="Date de récolte"
                  value={recolteForm.watch("dateRecolte1")}
                  onChange={(value) => recolteForm.setValue("dateRecolte1", value)}
                  required
                />
                <div className="space-y-2">
                  <Label htmlFor="quantiteRecolte1">Quantité récoltée (kg) *</Label>
                  <Input
                    id="quantiteRecolte1"
                    type="number"
                    {...recolteForm.register("quantiteRecolte1", { valueAsNumber: true })}
                  />
                  {recolteForm.formState.errors.quantiteRecolte1 && (
                    <p className="text-sm text-destructive">{recolteForm.formState.errors.quantiteRecolte1.message}</p>
                  )}
                </div>
                <PhotoCapture
                  label="Photo de la récolte 1"
                  onChange={(value) => recolteForm.setValue("photoRecolte1", value)}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Récolte 2 (optionnel)</h3>
                <DateInput
                  label="Date de récolte"
                  value={recolteForm.watch("dateRecolte2")}
                  onChange={(value) => recolteForm.setValue("dateRecolte2", value)}
                />
                <div className="space-y-2">
                  <Label htmlFor="quantiteRecolte2">Quantité récoltée (kg)</Label>
                  <Input
                    id="quantiteRecolte2"
                    type="number"
                    {...recolteForm.register("quantiteRecolte2", { valueAsNumber: true })}
                  />
                </div>
                <PhotoCapture
                  label="Photo de la récolte 2"
                  onChange={(value) => recolteForm.setValue("photoRecolte2", value)}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Récolte 3 (optionnel)</h3>
                <DateInput
                  label="Date de récolte"
                  value={recolteForm.watch("dateRecolte3")}
                  onChange={(value) => recolteForm.setValue("dateRecolte3", value)}
                />
                <div className="space-y-2">
                  <Label htmlFor="quantiteRecolte3">Quantité récoltée (kg)</Label>
                  <Input
                    id="quantiteRecolte3"
                    type="number"
                    {...recolteForm.register("quantiteRecolte3", { valueAsNumber: true })}
                  />
                </div>
                <PhotoCapture
                  label="Photo de la récolte 3"
                  onChange={(value) => recolteForm.setValue("photoRecolte3", value)}
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quantiteLivreeAsco">Quantité livrée à ASCO (kg) *</Label>
                  <span className="text-sm text-muted-foreground">Total récolté: {getQuantiteTotale()} kg</span>
                </div>
                <Input
                  id="quantiteLivreeAsco"
                  type="number"
                  {...recolteForm.register("quantiteLivreeAsco", { valueAsNumber: true })}
                />
                {recolteForm.formState.errors.quantiteLivreeAsco && (
                  <p className="text-sm text-destructive">{recolteForm.formState.errors.quantiteLivreeAsco.message}</p>
                )}
                
                {getQuantiteTotale() > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium">Taux de loyauté:</span>
                    <Badge variant={getTauxLoyaute() >= 80 ? "default" : getTauxLoyaute() >= 50 ? "secondary" : "destructive"}>
                      {getTauxLoyaute()}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        const dureeMinutes = ecabossageForm.watch("heureDebut") && ecabossageForm.watch("heureFin")
          ? calculateDurationMinutes(ecabossageForm.watch("heureDebut"), ecabossageForm.watch("heureFin"))
          : 0;

        return (
          <div className="space-y-4">
            <DateInput
              label="Date d'écabossage"
              value={ecabossageForm.watch("dateEcabossage")}
              onChange={(value) => ecabossageForm.setValue("dateEcabossage", value)}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heureDebut">Heure de début *</Label>
                <Input
                  id="heureDebut"
                  type="time"
                  {...ecabossageForm.register("heureDebut")}
                />
                {ecabossageForm.formState.errors.heureDebut && (
                  <p className="text-sm text-destructive">{ecabossageForm.formState.errors.heureDebut.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heureFin">Heure de fin *</Label>
                <Input
                  id="heureFin"
                  type="time"
                  {...ecabossageForm.register("heureFin")}
                />
                {ecabossageForm.formState.errors.heureFin && (
                  <p className="text-sm text-destructive">{ecabossageForm.formState.errors.heureFin.message}</p>
                )}
              </div>
            </div>

            {dureeMinutes > 0 && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium">Durée calculée:</span>
                <Badge variant="outline">{dureeMinutes} minutes ({Math.floor(dureeMinutes / 60)}h{dureeMinutes % 60}min)</Badge>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cout">Coût (FCFA) *</Label>
              <Input
                id="cout"
                type="number"
                {...ecabossageForm.register("cout", { valueAsNumber: true })}
              />
              {ecabossageForm.formState.errors.cout && (
                <p className="text-sm text-destructive">{ecabossageForm.formState.errors.cout.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Outils utilisés *</Label>
              <div className="space-y-2">
                {["Machette", "Couteau", "Panier", "Sac", "Bâche"].map((outil) => (
                  <div key={outil} className="flex items-center space-x-2">
                    <Checkbox
                      id={outil}
                      checked={ecabossageForm.watch("outils")?.includes(outil)}
                      onCheckedChange={(checked) => {
                        const current = ecabossageForm.watch("outils") || [];
                        if (checked) {
                          ecabossageForm.setValue("outils", [...current, outil]);
                        } else {
                          ecabossageForm.setValue("outils", current.filter((o) => o !== outil));
                        }
                      }}
                    />
                    <label htmlFor={outil} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {outil}
                    </label>
                  </div>
                ))}
              </div>
              {ecabossageForm.formState.errors.outils && (
                <p className="text-sm text-destructive">{ecabossageForm.formState.errors.outils.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        const dureeFermentation = fermentationForm.watch("dateDebut") && fermentationForm.watch("dateFin")
          ? calculateDurationDays(new Date(fermentationForm.watch("dateDebut")), new Date(fermentationForm.watch("dateFin")))
          : 0;

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DateInput
                label="Date de début"
                value={fermentationForm.watch("dateDebut")}
                onChange={(value) => fermentationForm.setValue("dateDebut", value)}
                required
              />
              
              <DateInput
                label="Date de fin"
                value={fermentationForm.watch("dateFin")}
                onChange={(value) => fermentationForm.setValue("dateFin", value)}
                required
                min={fermentationForm.watch("dateDebut")}
              />
            </div>

            {dureeFermentation > 0 && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium">Durée calculée:</span>
                <Badge variant="outline">{dureeFermentation} jour{dureeFermentation > 1 ? "s" : ""}</Badge>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="typeFermentation">Type de fermentation *</Label>
              <Select
                value={fermentationForm.watch("typeFermentation")}
                onValueChange={(value) => fermentationForm.setValue("typeFermentation", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caisse">Caisse en bois</SelectItem>
                  <SelectItem value="sac">Sac de jute</SelectItem>
                  <SelectItem value="tas">Tas sur bâche</SelectItem>
                  <SelectItem value="panier">Panier traditionnel</SelectItem>
                </SelectContent>
              </Select>
              {fermentationForm.formState.errors.typeFermentation && (
                <p className="text-sm text-destructive">{fermentationForm.formState.errors.typeFermentation.message}</p>
              )}
            </div>
          </div>
        );

      case 4:
        const dureeSechage = sechageForm.watch("dateDebut") && sechageForm.watch("dateFin")
          ? calculateDurationDays(new Date(sechageForm.watch("dateDebut")), new Date(sechageForm.watch("dateFin")))
          : 0;

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DateInput
                label="Date de début"
                value={sechageForm.watch("dateDebut")}
                onChange={(value) => sechageForm.setValue("dateDebut", value)}
                required
              />
              
              <DateInput
                label="Date de fin"
                value={sechageForm.watch("dateFin")}
                onChange={(value) => sechageForm.setValue("dateFin", value)}
                required
                min={sechageForm.watch("dateDebut")}
              />
            </div>

            {dureeSechage > 0 && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium">Durée calculée:</span>
                <Badge variant="outline">{dureeSechage} jour{dureeSechage > 1 ? "s" : ""}</Badge>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="typeSechage">Type de séchage *</Label>
              <Select
                value={sechageForm.watch("typeSechage")}
                onValueChange={(value) => sechageForm.setValue("typeSechage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claie">Claie surélevée</SelectItem>
                  <SelectItem value="bache">Bâche au sol</SelectItem>
                  <SelectItem value="sechoir">Séchoir solaire</SelectItem>
                  <SelectItem value="ciment">Aire cimentée</SelectItem>
                </SelectContent>
              </Select>
              {sechageForm.formState.errors.typeSechage && (
                <p className="text-sm text-destructive">{sechageForm.formState.errors.typeSechage.message}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <DateInput
              label="Date de transport"
              value={transportForm.watch("dateTransport")}
              onChange={(value) => transportForm.setValue("dateTransport", value)}
              required
            />

            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km) *</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                {...transportForm.register("distance", { valueAsNumber: true })}
              />
              {transportForm.formState.errors.distance && (
                <p className="text-sm text-destructive">{transportForm.formState.errors.distance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coutTransport">Coût (FCFA) *</Label>
              <Input
                id="coutTransport"
                type="number"
                {...transportForm.register("cout", { valueAsNumber: true })}
              />
              {transportForm.formState.errors.cout && (
                <p className="text-sm text-destructive">{transportForm.formState.errors.cout.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Select
                value={transportForm.watch("destination")}
                onValueChange={(value) => transportForm.setValue("destination", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="magasin-asco">Magasin ASCO</SelectItem>
                  <SelectItem value="cooperative">Coopérative locale</SelectItem>
                  <SelectItem value="marche">Marché local</SelectItem>
                  <SelectItem value="autre">Autre acheteur</SelectItem>
                </SelectContent>
              </Select>
              {transportForm.formState.errors.destination && (
                <p className="text-sm text-destructive">{transportForm.formState.errors.destination.message}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const CurrentStepIcon = steps[currentStep - 1].icon;
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/operations")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux opérations
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Nouvelle Opération de Collecte</h1>
        <p className="text-muted-foreground mt-2">Suivez les 5 étapes du processus de collecte</p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                </div>
                <span className={`text-sm mt-2 font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Contenu de l'étape */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CurrentStepIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Étape {currentStep}: {steps[currentStep - 1].name}</CardTitle>
              <CardDescription>
                {currentStep === 1 && "Saisissez les informations sur les récoltes effectuées"}
                {currentStep === 2 && "Renseignez les détails de l'écabossage"}
                {currentStep === 3 && "Informations sur la fermentation du cacao"}
                {currentStep === 4 && "Détails du processus de séchage"}
                {currentStep === 5 && "Informations sur le transport vers le magasin"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}

          <div className="flex justify-between mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
            <Button onClick={handleNext}>
              {currentStep === 5 ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Terminer
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
