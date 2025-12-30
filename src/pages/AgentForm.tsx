import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Save, Loader2, Search, X, User, IdCard, MapPin, Check } from "lucide-react";
import PhotoCapture from "@/components/forms/PhotoCapture";
import DateInput from "@/components/forms/DateInput";
import { agentService } from "@/services/agentService";
import type { Region } from "@/types/agent";

const agentSchema = z.object({
  code: z.string().min(1, "Code requis"),
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().min(1, "Téléphone requis"),
  statut: z.enum(["actif", "inactif", "suspendu"]),
  date_naissance: z.string().optional(),
  lieu_naissance: z.string().optional(),
  nationalite: z.string().optional(),
  type_piece: z.string().optional(),
  numero_piece: z.string().optional(),
  photo: z.string().optional(),
  regions: z.array(z.string()).min(1, "Au moins une région requise"),
  username: z.string().min(3, "Username doit contenir au moins 3 caractères").optional(),
  password: z.string().min(6, "Mot de passe doit contenir au moins 6 caractères").optional(),
});

type AgentFormData = z.infer<typeof agentSchema>;

const steps = [
  { id: 1, name: "Informations de Base", icon: User },
  { id: 2, name: "Identité", icon: IdCard },
  { id: 3, name: "Affectation Régions", icon: MapPin },
];

export default function AgentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [searchRegion, setSearchRegion] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      statut: "actif",
      nationalite: "Ivoirienne",
      regions: [],
    },
  });

  useEffect(() => {
    loadRegions();
    if (isEdit) {
      loadAgent();
    }
  }, [id]);

  const loadRegions = async () => {
    try {
      setIsLoadingRegions(true);
      const data = await agentService.getRegions();
      console.log("Régions chargées:", data);
      // S'assurer que les régions ont bien la structure attendue
      const regionsList = Array.isArray(data) ? data : [];
      setRegions(regionsList);
      if (regionsList.length === 0) {
        toast.warning("Aucune région disponible. Créez d'abord des régions.");
      }
    } catch (error) {
      console.error("Erreur chargement régions:", error);
      toast.error("Impossible de charger les régions");
      setRegions([]);
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const loadAgent = async () => {
    try {
      setIsLoading(true);
      const agent = await agentService.getAgent(id!);
      setValue("code", agent.code);
      setValue("nom", agent.nom);
      setValue("prenom", agent.prenom);
      setValue("email", agent.email || "");
      setValue("telephone", agent.telephone);
      setValue("statut", agent.statut as any);
      setValue("date_naissance", agent.date_naissance ? new Date(agent.date_naissance).toISOString().split('T')[0] : "");
      setValue("lieu_naissance", agent.lieu_naissance || "");
      setValue("nationalite", agent.nationalite || "Ivoirienne");
      setValue("type_piece", agent.type_piece || "");
      setValue("numero_piece", agent.numero_piece || "");
      setValue("photo", agent.photo || "");
      setValue("username", (agent as any).username || "");
      
      if (agent.regions) {
        const regionIds = agent.regions.map((ar: any) => ar.id_region);
        setValue("regions", regionIds);
        setSelectedRegions(regionIds);
      }
    } catch (error) {
      toast.error("Impossible de charger l'agent");
      navigate("/agents");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AgentFormData) => {
    try {
      setIsLoading(true);
      if (isEdit) {
        await agentService.updateAgent(id!, data);
        toast.success("Agent modifié avec succès");
      } else {
        const createdAgent = await agentService.createAgent(data);
        const username = createdAgent.username || data.username || "généré automatiquement";
        toast.success(
          `Agent créé avec succès ! Username: ${username}, Password: ${data.password ? "personnalisé" : "password123"}`,
          { duration: 5000 }
        );
      }
      navigate("/agents");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRegion = (regionId: string) => {
    const newRegions = selectedRegions.includes(regionId)
      ? selectedRegions.filter(id => id !== regionId)
      : [...selectedRegions, regionId];
    setSelectedRegions(newRegions);
    setValue("regions", newRegions);
  };

  // Filtrer les régions selon la recherche
  const filteredRegions = regions.filter(region =>
    region.nom.toLowerCase().includes(searchRegion.toLowerCase()) ||
    region.code.toLowerCase().includes(searchRegion.toLowerCase())
  );

  const handleNext = async () => {
    let fieldsToValidate: (keyof AgentFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["code", "nom", "prenom", "telephone", "statut"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["date_naissance", "lieu_naissance", "nationalite"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["regions"];
    }
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Informations de Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Code Agent *</Label>
                  <Input {...register("code")} placeholder="AGT-001" />
                  {errors.code && <p className="text-sm text-destructive mt-1">{errors.code.message}</p>}
                </div>
                <div>
                  <Label>Statut *</Label>
                  <Select onValueChange={v => setValue("statut", v as any)} value={watch("statut")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                      <SelectItem value="suspendu">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom *</Label>
                  <Input {...register("nom")} />
                  {errors.nom && <p className="text-sm text-destructive mt-1">{errors.nom.message}</p>}
                </div>
                <div>
                  <Label>Prénom *</Label>
                  <Input {...register("prenom")} />
                  {errors.prenom && <p className="text-sm text-destructive mt-1">{errors.prenom.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Téléphone *</Label>
                  <Input {...register("telephone")} placeholder="0707070707" />
                  {errors.telephone && <p className="text-sm text-destructive mt-1">{errors.telephone.message}</p>}
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" {...register("email")} placeholder="agent@example.com" />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <PhotoCapture
                label="Photo"
                value={watch("photo")}
                onChange={v => setValue("photo", v)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Username (pour connexion mobile) {!isEdit && "(optionnel)"}</Label>
                  <Input 
                    {...register("username")} 
                    placeholder="Ex: agent001" 
                    autoComplete="username"
                    disabled={isEdit}
                  />
                  {errors.username && <p className="text-sm text-destructive mt-1">{errors.username.message}</p>}
                  {!isEdit && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Laissé vide = généré automatiquement à partir du code
                    </p>
                  )}
                  {isEdit && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Le username ne peut pas être modifié
                    </p>
                  )}
                </div>
                <div>
                  <Label>Mot de passe (pour connexion mobile) {!isEdit && "(optionnel)"}</Label>
                  <Input 
                    type="password"
                    {...register("password")} 
                    placeholder={isEdit ? "Laisser vide pour ne pas changer" : "Min. 6 caractères"} 
                    autoComplete={isEdit ? "current-password" : "new-password"}
                  />
                  {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
                  {!isEdit && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Laissé vide = mot de passe par défaut: "password123"
                    </p>
                  )}
                  {isEdit && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Remplir uniquement pour changer le mot de passe
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Identité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DateInput
                label="Date de Naissance"
                value={watch("date_naissance")}
                onChange={v => setValue("date_naissance", v)}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Lieu de Naissance</Label>
                  <Input {...register("lieu_naissance")} />
                </div>
                <div>
                  <Label>Nationalité</Label>
                  <Input {...register("nationalite")} defaultValue="Ivoirienne" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de Pièce</Label>
                  <Select onValueChange={v => setValue("type_piece", v)} value={watch("type_piece")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNI">CNI</SelectItem>
                      <SelectItem value="Passeport">Passeport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Numéro de Pièce</Label>
                  <Input {...register("numero_piece")} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Affectation aux Régions *</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Sélectionnez les régions où cet agent interviendra ({selectedRegions.length} sélectionnée{selectedRegions.length > 1 ? 's' : ''})
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une région..."
                  value={searchRegion}
                  onChange={(e) => setSearchRegion(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchRegion && (
                  <button
                    type="button"
                    onClick={() => setSearchRegion("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isLoadingRegions ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Chargement des régions...</span>
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                    {filteredRegions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        {searchRegion ? (
                          <>Aucune région trouvée pour "{searchRegion}"</>
                        ) : (
                          <>Aucune région disponible. Créez d'abord des régions.</>
                        )}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredRegions.map((region) => (
                        <div 
                          key={region.id} 
                          className="flex items-center gap-2 hover:bg-muted/50 p-2 rounded transition-colors"
                        >
                          <Checkbox
                            id={`region-${region.id}`}
                            checked={selectedRegions.includes(region.id)}
                            onCheckedChange={() => toggleRegion(region.id)}
                          />
                          <Label 
                            htmlFor={`region-${region.id}`} 
                            className="cursor-pointer text-sm flex-1"
                          >
                            {region.nom} {region.code && `(${region.code})`}
                          </Label>
                        </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {errors.regions && (
                    <p className="text-sm text-destructive mt-2">{errors.regions.message}</p>
                  )}
                  {regions.length > 0 && selectedRegions.length === 0 && (
                    <p className="text-sm text-amber-600 mt-2">
                      ⚠️ Veuillez sélectionner au moins une région
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  if (isLoading && isEdit) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate("/agents")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-3xl font-bold text-foreground mb-6">
        {isEdit ? "Modifier l'Agent" : "Nouvel Agent"}
      </h1>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 overflow-x-auto pb-2">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center min-w-[100px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                </div>
                <span className={`text-xs mt-1 font-medium text-center ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>{step.name}</span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between gap-4">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/agents")}>
                Annuler
              </Button>
              {currentStep < steps.length ? (
                <Button type="button" onClick={handleNext}>
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isEdit ? "Modifier" : "Créer"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

