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
import MultiPhone from "@/components/forms/MultiPhone";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateVillageCode } from "@/utils/codeGenerators";
import { api } from "@/services/api";

// Schéma de validation complet basé sur l'image fournie
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
  chef_date_naissance: z.string().optional(), // Converti en Date à l'envoi
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

  // Activités professionnelles - Agricoles
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

  // Activités professionnelles - Autres
  commerces: z.boolean(),
  // commerces_produits géré comme string[] via UI spécifique ou champs multiples
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

export default function VillageForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<VillageFormData>({
    resolver: zodResolver(villageSchema),
    defaultValues: {
      type: "Village",
      chef_contact: [""],
      nombre_habitants: 0,
      nombre_hommes: 0,
      nombre_femmes: 0,
      nombre_enfants_scolarises: 0,
      // Initialisation des booléens
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

  // Load sections and existing data when editing
  useEffect(() => {
    // Charger les sections
    api.getSections()
      .then(setSections)
      .catch((error) => {
        console.error("Error loading sections:", error);
        toast.error("Erreur lors du chargement des sections");
      });
    
    // Charger les données du village si en mode édition
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

  const onSubmit = async (data: VillageFormData) => {
    setIsLoading(true);
    try {
      // Filtrer les valeurs vides des arrays de contacts
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

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/villages")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isEdit ? "Modifier Village / Campement" : "Nouveau Village / Campement"}</h1>
          <p className="text-muted-foreground">Formulaire détaillé de collecte de données</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* 1. Informations Générales */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Informations Générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Label>Localité *</Label>
                <Input {...register("localite")} />
                {errors.localite && <p className="text-destructive text-sm">{errors.localite.message}</p>}
              </div>
              <div>
                <Label>Nom du campement *</Label>
                <Input {...register("nom")} />
                {errors.nom && <p className="text-destructive text-sm">{errors.nom.message}</p>}
              </div>
              <div>
                <Label>Type</Label>
                <Select onValueChange={(val) => setValue("type", val as any)} defaultValue="Village">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Village">Village</SelectItem>
                    <SelectItem value="Campement">Campement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          </CardContent>
        </Card>

        {/* 2. Chef de campement */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Chef de campement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* 3. Données sociologiques */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Données sociologiques</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* 4. Accès à l'eau */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Accès à l'eau</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "eau_courante", label: "Eau courante", pct: "eau_courante_pct" },
              { id: "pompe_hydraulique", label: "Pompe hydraulique", pct: "pompe_hydraulique_pct" },
              { id: "puits", label: "Puits", pct: "puits_pct" },
              { id: "riviere_marigot", label: "Rivière/Marigot", pct: "riviere_marigot_pct" },
            ].map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-2 border rounded">
                <div className="flex items-center gap-2 w-1/3">
                  <Checkbox
                    checked={watch(item.id)}
                    onCheckedChange={(chk) => setValue(item.id, !!chk)}
                  />
                  <Label>{item.label}</Label>
                </div>
                {watch(item.id) && (
                  <div className="flex items-center gap-2 flex-1">
                    <Label>% Utilisation</Label>
                    <Input
                      type="number"
                      className="w-24"
                      {...register(item.pct, { valueAsNumber: true })}
                      placeholder="%"
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 5. Accès à l'électricité */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Accès à l'électricité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "electricite_reseau", label: "Réseau national", level: "electricite_reseau_niveau" },
              { id: "electricite_solaire", label: "Solaire", level: "electricite_solaire_niveau" },
              { id: "electricite_lampes", label: "Lampes", level: "electricite_lampes_niveau" },
            ].map((item: any) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 p-2 border rounded">
                <div className="flex items-center gap-2 w-1/3">
                  <Checkbox
                    checked={watch(item.id)}
                    onCheckedChange={(chk) => setValue(item.id, !!chk)}
                  />
                  <Label>{item.label}</Label>
                </div>
                {watch(item.id) && (
                  <div className="flex items-center gap-4 flex-1">
                    <Label>Niveau:</Label>
                    <RadioGroup
                      onValueChange={(val) => setValue(item.level, val)}
                      defaultValue={watch(item.level)}
                      className="flex gap-4"
                    >
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
          </CardContent>
        </Card>

        {/* 6. Accès aux soins */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Accès aux soins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { prefix: "dispensaire", label: "Dispensaire" },
              { prefix: "pharmacie", label: "Pharmacie" }
            ].map((item: any) => (
              <div key={item.prefix} className="border p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Checkbox
                    checked={watch(item.prefix)}
                    onCheckedChange={(chk) => setValue(item.prefix, !!chk)}
                  />
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
                      <PhotoCapture
                        label={`Photo ${item.label}`}
                        onChange={(val) => setValue(`${item.prefix}_photo`, val)}
                        value={watch(`${item.prefix}_photo`)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 7. Accès à l'éducation */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Accès à l'éducation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { prefix: "ecole_primaire", label: "École primaire" },
              { prefix: "college_lycee", label: "Lycées/Collèges" }
            ].map((item: any) => (
              <div key={item.prefix} className="border p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Checkbox
                    checked={watch(item.prefix)}
                    onCheckedChange={(chk) => setValue(item.prefix, !!chk)}
                  />
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
                      <PhotoCapture
                        label={`Photo ${item.label}`}
                        onChange={(val) => setValue(`${item.prefix}_photo`, val)}
                        value={watch(`${item.prefix}_photo`)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 8. Activités professionnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Activités professionnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

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
          </CardContent>
        </Card>

        {/* 9. Couverture GSM & Paiement */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Couverture GSM & Paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Orange", "MTN", "MOOV"].map((operator) => (
                <div key={operator} className="space-y-2">
                  <Label className="font-bold text-lg">{operator}</Label>
                  <Select onValueChange={(val) => setValue(`reseau_${operator.toLowerCase()}` as any, val)}>
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

          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end pt-4">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/villages")}>
            Annuler
          </Button>
          <Button type="submit" size="lg" className="gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isEdit ? "Mettre à jour" : "Enregistrer le Village"}
          </Button>
        </div>
      </form>
    </div>
  );
}
