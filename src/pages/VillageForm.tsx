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
import { Progress } from "@/components/ui/progress";
import PhotoCapture from "@/components/forms/PhotoCapture";
import GPSCapture from "@/components/forms/GPSCapture";
import MultiPhone from "@/components/forms/MultiPhone";
import { ArrowLeft, ArrowRight, Save, Loader2, Check, MapPin, User, Users, Droplet, Zap, Heart, GraduationCap, Briefcase, Wifi } from "lucide-react";
import { toast } from "sonner";
import { generateVillageCode } from "@/utils/codeGenerators";
import { api } from "@/services/api";
import { getAllLocalitesOptions } from "@/data/geographieCI";
import { Combobox } from "@/components/ui/combobox";

// Schéma de validation complet
const villageSchema = z.object({
  // Informations Générales
  id_section: z.string().min(1, "La section est obligatoire"),
  localite: z.string().min(1, "La localité est obligatoire"),
  nom: z.string().min(1, "Le nom du campement est obligatoire"),
  type: z.enum(["Village", "Campement"]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photo: z.string().optional(),
  photo_aire_sechage: z.string().optional(),

  // Chef de campement
  chef_nom: z.string().min(1, "Le nom du chef est obligatoire"),
  chef_contact: z.array(z.string()).min(1, "Au moins un numéro est requis"),
  chef_cni: z.string().optional(),
  chef_photo_cni: z.string().optional(),
  chef_date_naissance: z.string().optional(),
  chef_photo_date_naissance: z.string().optional(),

  // Données sociologiques
  nombre_habitants: z.number().min(0),
  nombre_hommes: z.number().min(0),
  nombre_femmes: z.number().min(0),
  nombre_enfants_scolarises: z.number().min(0),

  // Accès à l'eau
  eau_courante: z.boolean(),
  eau_courante_pct: z.number().min(0).max(100).optional(),
  pompe_hydraulique: z.boolean(),
  pompe_hydraulique_pct: z.number().min(0).max(100).optional(),
  puits: z.boolean(),
  puits_pct: z.number().min(0).max(100).optional(),
  riviere_marigot: z.boolean(),
  riviere_marigot_pct: z.number().min(0).max(100).optional(),

  // Accès à l'électricité
  electricite_reseau: z.boolean(),
  electricite_reseau_niveau: z.enum(["Peu", "Moyen", "Important"]).optional(),
  electricite_solaire: z.boolean(),
  electricite_solaire_niveau: z.enum(["Peu", "Moyen", "Important"]).optional(),
  electricite_lampes: z.boolean(),
  electricite_lampes_niveau: z.enum(["Peu", "Moyen", "Important"]).optional(),

  // Accès aux soins
  dispensaire: z.boolean(),
  dispensaire_nombre: z.number().optional(),
  dispensaire_photo: z.string().optional(),
  dispensaire_materiaux: z.enum(["Ciment", "Terre battue séchée", "Bois/Banco", "Autre"]).optional(),
  dispensaire_distance: z.number().optional(),

  pharmacie: z.boolean(),
  pharmacie_nombre: z.number().optional(),
  pharmacie_photo: z.string().optional(),
  pharmacie_materiaux: z.enum(["Ciment", "Terre battue séchée", "Bois/Banco", "Autre"]).optional(),
  pharmacie_distance: z.number().optional(),

  // Accès à l'éducation
  ecole_primaire: z.boolean(),
  ecole_primaire_nombre: z.number().optional(),
  ecole_primaire_photo: z.string().optional(),
  ecole_primaire_materiaux: z.enum(["Ciment", "Terre battue séchée", "Bois/Banco", "Autre"]).optional(),
  ecole_primaire_distance: z.number().optional(),

  college_lycee: z.boolean(),
  college_lycee_nombre: z.number().optional(),
  college_lycee_photo: z.string().optional(),
  college_lycee_materiaux: z.enum(["Ciment", "Terre battue séchée", "Bois/Banco", "Autre"]).optional(),
  college_lycee_distance: z.number().optional(),

  // Activités professionnelles
  culture_cacao: z.boolean(),
  culture_cafe: z.boolean(),
  culture_riz: z.boolean(),
  culture_mais: z.boolean(),
  culture_hevea: z.boolean(),
  culture_palmier: z.boolean(),
  culture_maraicheres: z.boolean(),
  elevage_ovin: z.boolean(),
  elevage_bovin: z.boolean(),
  elevage_porcin: z.boolean(),
  elevage_autre: z.boolean(),
  activite_autre: z.string().optional(),
  commerces: z.boolean(),
  artisanat: z.boolean(),

  // Couverture GSM
  reseau_orange: z.enum(["Très bon", "Bon", "Moyen", "Pas du tout"]).optional(),
  reseau_mtn: z.enum(["Très bon", "Bon", "Moyen", "Pas du tout"]).optional(),
  reseau_moov: z.enum(["Très bon", "Bon", "Moyen", "Pas du tout"]).optional(),

  // Services de paiement
  om_orange: z.boolean(),
  momo_mtn: z.boolean(),
  flooz_moov: z.boolean(),
  autres_paiement: z.boolean(),
});

type VillageFormData = z.infer<typeof villageSchema>;

const steps = [
  { id: 1, name: "Général", icon: MapPin },
  { id: 2, name: "Chef", icon: User },
  { id: 3, name: "Démographie", icon: Users },
  { id: 4, name: "Infrastructures", icon: Droplet },
  { id: 5, name: "Activités", icon: Briefcase },
  { id: 6, name: "GSM & Paiement", icon: Wifi },
];

export default function VillageForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset, trigger } = useForm<VillageFormData>({
    resolver: zodResolver(villageSchema),
    defaultValues: {
      type: "Village",
      chef_contact: [""],
      nombre_habitants: 0,
      nombre_hommes: 0,
      nombre_femmes: 0,
      nombre_enfants_scolarises: 0,
      eau_courante: false,
      pompe_hydraulique: false,
      puits: false,
      riviere_marigot: false,
      electricite_reseau: false,
      electricite_solaire: false,
      electricite_lampes: false,
      dispensaire: false,
      pharmacie: false,
      ecole_primaire: false,
      college_lycee: false,
      culture_cacao: false,
      culture_cafe: false,
      culture_riz: false,
      culture_mais: false,
      culture_hevea: false,
      culture_palmier: false,
      culture_maraicheres: false,
      elevage_ovin: false,
      elevage_bovin: false,
      elevage_porcin: false,
      elevage_autre: false,
      commerces: false,
      artisanat: false,
      om_orange: false,
      momo_mtn: false,
      flooz_moov: false,
      autres_paiement: false,
    }
  });

  // Vérifier le statut de connexion
  useEffect(() => {
    const checkOnline = async () => {
      try {
        const res = await fetch("/api/health");
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };
    checkOnline();
    const interval = setInterval(checkOnline, 30000); // Vérifier toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  // Load sections and existing data when editing
  useEffect(() => {
    api.getSections()
      .then(setSections)
      .catch((error) => {
        console.error("Error loading sections:", error);
        toast.error("Erreur lors du chargement des sections");
      });
    
    if (isEdit && id) {
      setIsLoading(true);
      api.getVillage(id)
        .then((village: any) => {
          reset(village);
        })
        .catch((error) => {
          console.error("Error loading village:", error);
          toast.error("Erreur lors du chargement du village");
          navigate("/villages");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEdit, reset, navigate]);

  const handleNext = async () => {
    // Validation des champs de l'étape actuelle
    let fieldsToValidate: (keyof VillageFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["id_section", "localite", "nom", "type"];
        break;
      case 2:
        fieldsToValidate = ["chef_nom", "chef_contact"];
        break;
      case 3:
        fieldsToValidate = ["nombre_habitants", "nombre_hommes", "nombre_femmes", "nombre_enfants_scolarises"];
        break;
      case 4:
        // Pas de validation obligatoire pour les infrastructures
        break;
      case 5:
        // Pas de validation obligatoire pour les activités
        break;
      case 6:
        // Pas de validation obligatoire pour GSM
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

  const onSubmit = async (data: VillageFormData) => {
    setIsLoading(true);
    try {
      const cleanData = {
        ...data,
        chef_contact: data.chef_contact?.filter(phone => phone && phone.trim() !== "") || [],
      };

      if (isEdit && id) {
        await api.updateVillage(id, cleanData);
        toast.success("Village mis à jour avec succès");
        navigate(`/villages/${id}`);
      } else {
        const code = generateVillageCode(Math.floor(Math.random() * 1000));
        await api.createVillage({ ...cleanData, code });
        toast.success(`Village ${code} créé avec succès`);
        navigate("/villages");
      }
    } catch (error: any) {
      console.error("Error saving village:", error);
      const errorMessage = error?.message || (isEdit ? "Erreur lors de la mise à jour" : "Erreur lors de la création du village");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepIcon = steps[currentStep - 1].icon;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Section *</Label>
              <Select onValueChange={(val) => setValue("id_section", val)} value={watch("id_section")}>
                <SelectTrigger><SelectValue placeholder="Sélectionner une section..." /></SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.nom} ({section.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_section && <p className="text-destructive text-sm">{errors.id_section.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nom du campement *</Label>
                <Input {...register("nom")} />
                {errors.nom && <p className="text-destructive text-sm">{errors.nom.message}</p>}
              </div>
              <div>
                <Label>Type</Label>
                <Select onValueChange={(val) => setValue("type", val as any)} value={watch("type")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Village">Village</SelectItem>
                    <SelectItem value="Campement">Campement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Label>Localité *</Label>
              <Combobox
                options={getAllLocalitesOptions()}
                value={watch("localite")}
                onValueChange={(val) => setValue("localite", val)}
                placeholder="Sélectionner une localité..."
                searchPlaceholder="Rechercher une localité..."
                emptyMessage="Aucune localité trouvée."
              />
              {errors.localite && <p className="text-destructive text-sm">{errors.localite.message}</p>}
            </div>
            <div className="border-t pt-4 mt-4">
              <Label className="mb-2 block font-semibold">Coordonnées GPS</Label>
              <GPSCapture
                onChange={(coords) => {
                  setValue("latitude", coords.latitude);
                  setValue("longitude", coords.longitude);
                }}
                latitude={watch("latitude")}
                longitude={watch("longitude")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <PhotoCapture label="Photo Campement" onChange={(val) => setValue("photo", val)} value={watch("photo")} />
              <PhotoCapture label="Photo Aire de séchage" onChange={(val) => setValue("photo_aire_sechage", val)} value={watch("photo_aire_sechage")} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Nom et prénom *</Label>
              <Input {...register("chef_nom")} />
              {errors.chef_nom && <p className="text-destructive text-sm">{errors.chef_nom.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>CNI (Nom et Prénom ou Numéro)</Label>
                <Input {...register("chef_cni")} placeholder="Info CNI" />
              </div>
              <div>
                <Label>Date de naissance</Label>
                <Input type="date" {...register("chef_date_naissance")} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhotoCapture label="Photo CNI" onChange={(val) => setValue("chef_photo_cni", val)} value={watch("chef_photo_cni")} />
              <PhotoCapture label="Photo Acte/Date Naissance" onChange={(val) => setValue("chef_photo_date_naissance", val)} value={watch("chef_photo_date_naissance")} />
            </div>
            <MultiPhone label="Contact téléphonique *" values={watch("chef_contact")} onChange={(vals) => setValue("chef_contact", vals)} />
            {errors.chef_contact && <p className="text-destructive text-sm">{errors.chef_contact.message}</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Habitants déclarés</Label>
                <Input type="number" {...register("nombre_habitants", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Hommes</Label>
                <Input type="number" {...register("nombre_hommes", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Femmes</Label>
                <Input type="number" {...register("nombre_femmes", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Enfants scolarisés</Label>
                <Input type="number" {...register("nombre_enfants_scolarises", { valueAsNumber: true })} />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Accès à l'eau */}
            <div>
              <h3 className="font-semibold mb-3">Accès à l'eau</h3>
              <div className="space-y-2">
                {[
                  { id: "eau_courante", label: "Eau courante", pct: "eau_courante_pct" },
                  { id: "pompe_hydraulique", label: "Pompe hydraulique", pct: "pompe_hydraulique_pct" },
                  { id: "puits", label: "Puits", pct: "puits_pct" },
                  { id: "riviere_marigot", label: "Rivière/Marigot", pct: "riviere_marigot_pct" },
                ].map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-2 border rounded">
                    <div className="flex items-center gap-2 w-1/3">
                      <Checkbox checked={watch(item.id)} onCheckedChange={(chk) => setValue(item.id, !!chk)} />
                      <Label>{item.label}</Label>
                    </div>
                    {watch(item.id) && (
                      <div className="flex items-center gap-2 flex-1">
                        <Label>% Utilisation</Label>
                        <Input type="number" className="w-24" {...register(item.pct, { valueAsNumber: true })} placeholder="%" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Accès à l'électricité */}
            <div>
              <h3 className="font-semibold mb-3">Accès à l'électricité</h3>
              <div className="space-y-2">
                {[
                  { id: "electricite_reseau", label: "Réseau national", level: "electricite_reseau_niveau" },
                  { id: "electricite_solaire", label: "Solaire", level: "electricite_solaire_niveau" },
                  { id: "electricite_lampes", label: "Lampes", level: "electricite_lampes_niveau" },
                ].map((item: any) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 p-2 border rounded">
                    <div className="flex items-center gap-2 w-1/3">
                      <Checkbox checked={watch(item.id)} onCheckedChange={(chk) => setValue(item.id, !!chk)} />
                      <Label>{item.label}</Label>
                    </div>
                    {watch(item.id) && (
                      <div className="flex items-center gap-4 flex-1">
                        <Label>Niveau:</Label>
                        <RadioGroup onValueChange={(val) => setValue(item.level, val)} value={watch(item.level)} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Peu" id={`${item.id}-peu`} />
                            <Label htmlFor={`${item.id}-peu`}>Peu</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Moyen" id={`${item.id}-moyen`} />
                            <Label htmlFor={`${item.id}-moyen`}>Moyen</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Important" id={`${item.id}-important`} />
                            <Label htmlFor={`${item.id}-important`}>Important</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Accès aux soins */}
            <div>
              <h3 className="font-semibold mb-3">Accès aux soins</h3>
              <div className="space-y-4">
                {[
                  { prefix: "dispensaire", label: "Dispensaire" },
                  { prefix: "pharmacie", label: "Pharmacie" }
                ].map((item: any) => (
                  <div key={item.prefix} className="border p-4 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Checkbox checked={watch(item.prefix)} onCheckedChange={(chk) => setValue(item.prefix, !!chk)} />
                      <Label className="text-lg font-semibold">{item.label}</Label>
                    </div>
                    {watch(item.prefix) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-primary/20">
                        <div>
                          <Label>Nombre</Label>
                          <Input type="number" {...register(`${item.prefix}_nombre`, { valueAsNumber: true })} />
                        </div>
                        <div>
                          <Label>Matériaux de construction</Label>
                          <Select onValueChange={(val) => setValue(`${item.prefix}_materiaux`, val as any)}>
                            <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ciment">Ciment</SelectItem>
                              <SelectItem value="Terre battue séchée">Terre battue séchée</SelectItem>
                              <SelectItem value="Bois/Banco">Bois/Banco</SelectItem>
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Distance du campement (km)</Label>
                          <Input type="number" step="0.1" {...register(`${item.prefix}_distance`, { valueAsNumber: true })} />
                        </div>
                        <div>
                          <PhotoCapture label={`Photo ${item.label}`} onChange={(val) => setValue(`${item.prefix}_photo`, val)} value={watch(`${item.prefix}_photo`)} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Accès à l'éducation */}
            <div>
              <h3 className="font-semibold mb-3">Accès à l'éducation</h3>
              <div className="space-y-4">
                {[
                  { prefix: "ecole_primaire", label: "École primaire" },
                  { prefix: "college_lycee", label: "Lycées/Collèges" }
                ].map((item: any) => (
                  <div key={item.prefix} className="border p-4 rounded-lg space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Checkbox checked={watch(item.prefix)} onCheckedChange={(chk) => setValue(item.prefix, !!chk)} />
                      <Label className="text-lg font-semibold">{item.label}</Label>
                    </div>
                    {watch(item.prefix) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-primary/20">
                        <div>
                          <Label>Nombre</Label>
                          <Input type="number" {...register(`${item.prefix}_nombre`, { valueAsNumber: true })} />
                        </div>
                        <div>
                          <Label>Matériaux de construction</Label>
                          <Select onValueChange={(val) => setValue(`${item.prefix}_materiaux`, val as any)}>
                            <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ciment">Ciment</SelectItem>
                              <SelectItem value="Terre battue séchée">Terre battue séchée</SelectItem>
                              <SelectItem value="Bois/Banco">Bois/Banco</SelectItem>
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Distance du campement (km)</Label>
                          <Input type="number" step="0.1" {...register(`${item.prefix}_distance`, { valueAsNumber: true })} />
                        </div>
                        <div>
                          <PhotoCapture label={`Photo ${item.label}`} onChange={(val) => setValue(`${item.prefix}_photo`, val)} value={watch(`${item.prefix}_photo`)} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Activités agricoles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "culture_cacao", "culture_cafe", "culture_riz", "culture_mais",
                  "culture_hevea", "culture_palmier", "culture_maraicheres"
                ].map((key: any) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox checked={watch(key)} onCheckedChange={(chk) => setValue(key, !!chk)} />
                    <Label className="capitalize">{key.replace('culture_', '')}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Élevage</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "elevage_ovin", "elevage_bovin", "elevage_porcin", "elevage_autre"
                ].map((key: any) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox checked={watch(key)} onCheckedChange={(chk) => setValue(key, !!chk)} />
                    <Label className="capitalize">{key.replace('elevage_', '')}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox checked={watch("commerces")} onCheckedChange={(chk) => setValue("commerces", !!chk)} />
                  <Label className="font-bold">Commerces</Label>
                </div>
                {watch("commerces") && (
                  <div className="ml-6 mt-2">
                    <Label className="text-xs">Produits (séparés par virgule)</Label>
                    <Input placeholder="Ex: Alimentation, Boutique..." />
                  </div>
                )}
              </div>
              <div className="border p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox checked={watch("artisanat")} onCheckedChange={(chk) => setValue("artisanat", !!chk)} />
                  <Label className="font-bold">Artisanat</Label>
                </div>
                {watch("artisanat") && (
                  <div className="ml-6 mt-2">
                    <Label className="text-xs">Produits (séparés par virgule)</Label>
                    <Input placeholder="Ex: Couture, Coiffure..." />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Couverture GSM</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Orange", "MTN", "MOOV"].map((operator) => (
                  <div key={operator} className="space-y-2">
                    <Label className="font-bold text-lg">{operator}</Label>
                    <Select onValueChange={(val) => setValue(`reseau_${operator.toLowerCase()}` as any, val)} value={watch(`reseau_${operator.toLowerCase()}` as any)}>
                      <SelectTrigger><SelectValue placeholder="Qualité réseau" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très bon">Très bon</SelectItem>
                        <SelectItem value="Bon">Bon</SelectItem>
                        <SelectItem value="Moyen">Moyen</SelectItem>
                        <SelectItem value="Pas du tout">Pas du tout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Services de paiement électronique</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox checked={watch("om_orange")} onCheckedChange={(chk) => setValue("om_orange", !!chk)} />
                  <Label>Orange Money</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={watch("momo_mtn")} onCheckedChange={(chk) => setValue("momo_mtn", !!chk)} />
                  <Label>MTN Mobile Money</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={watch("flooz_moov")} onCheckedChange={(chk) => setValue("flooz_moov", !!chk)} />
                  <Label>MOOV FLOOZ</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={watch("autres_paiement")} onCheckedChange={(chk) => setValue("autres_paiement", !!chk)} />
                  <Label>Autres</Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto relative">
      {/* Indicateur de statut en bas à droite */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg ${isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white' : 'bg-white animate-pulse'}`} />
          <span className="text-sm font-medium">{isOnline ? 'En ligne' : 'Hors ligne'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/villages")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isEdit ? "Modifier Village / Campement" : "Nouveau Village / Campement"}</h1>
          <p className="text-muted-foreground">Formulaire détaillé de collecte de données</p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex justify-between items-center gap-4 overflow-x-auto pb-2">
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

      <form onSubmit={handleSubmit(onSubmit)}>
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentStep(c => Math.max(1, c - 1))} 
                disabled={currentStep === 1}
              >
                Précédent
              </Button>
              {currentStep < steps.length ? (
                <Button type="button" onClick={handleNext}>
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {isEdit ? "Mettre à jour" : "Enregistrer le Village"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
