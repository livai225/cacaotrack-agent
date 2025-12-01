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
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Search, X } from "lucide-react";
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
});

type AgentFormData = z.infer<typeof agentSchema>;

export default function AgentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [searchRegion, setSearchRegion] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
      const data = await agentService.getRegions();
      setRegions(data);
    } catch (error) {
      console.error("Erreur chargement régions:", error);
      toast.error("Impossible de charger les régions");
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
        await agentService.createAgent(data);
        toast.success("Agent créé avec succès");
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

  if (isLoading && isEdit) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate("/agents")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-3xl font-bold text-foreground mb-6">
        {isEdit ? "Modifier l'Agent" : "Nouvel Agent"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Informations de base */}
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
            </CardContent>
          </Card>

          {/* Identité */}
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

          {/* Affectation aux Régions */}
          <Card>
            <CardHeader>
              <CardTitle>Affectation aux Régions *</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Sélectionnez les régions où cet agent interviendra ({selectedRegions.length} sélectionnée{selectedRegions.length > 1 ? 's' : ''})
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Champ de recherche */}
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

              {/* Liste des régions */}
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                {filteredRegions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune région trouvée pour "{searchRegion}"
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
                        {region.nom}
                      </Label>
                    </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.regions && (
                <p className="text-sm text-destructive mt-2">{errors.regions.message}</p>
              )}
              {regions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucune région disponible. Créez d'abord des régions.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/agents")}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isEdit ? "Modifier" : "Créer"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

