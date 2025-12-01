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
import { generateSectionCode } from "@/utils/codeGenerators";
import { api } from "@/services/api";

// Schéma de validation
const sectionSchema = z.object({
  organisationId: z.string().min(1, "L'organisation est obligatoire"),

  // Infos Générales
  localite: z.string().min(1, "La localité est obligatoire"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photo_magasin: z.string().optional(),
  surface_magasin: z.number().optional(),
  photo_aire_sechage: z.string().optional(),
  date_creation_section: z.string().optional(), // Date input returns string
  nom: z.string().min(1, "Le nom est obligatoire"),
  telephone: z.string().optional(), // Single phone field per image? Image says "Numéro de téléphone de la section"
  nb_producteurs: z.number().min(0),
  tonnage_c_precedente: z.number().min(0),
  tonnage_c_cours: z.number().min(0),
  tonnage_potentiel: z.number().min(0),

  // Dirigeants
  president_nom: z.string().min(1, "Nom du président obligatoire"),
  president_date_naissance: z.string().optional(),
  president_photo: z.string().optional(),
  president_contact: z.array(z.string()).min(1, "Contact obligatoire"),

  secretaire_nom: z.string().min(1, "Nom du secrétaire obligatoire"),
  secretaire_date_naissance: z.string().optional(),
  secretaire_photo: z.string().optional(),
  secretaire_contact: z.array(z.string()).min(1, "Contact obligatoire"),

  // Personnel
  magasinier_nom: z.string().min(1, "Nom magasinier obligatoire"),
  magasinier_date_naissance: z.string().optional(),
  magasinier_photo: z.string().optional(),
  magasinier_contact: z.array(z.string()),

  peseur_nom: z.string().min(1, "Nom peseur obligatoire"),
  peseur_date_naissance: z.string().optional(),
  peseur_photo: z.string().optional(),
  peseur_contact: z.array(z.string()),

  has_analyseur: z.boolean(),
  analyseur_nom: z.string().optional(),
  analyseur_date_naissance: z.string().optional(),
  analyseur_photo: z.string().optional(),
  analyseur_contact: z.array(z.string()).optional(),

  // Equipements - Véhicules
  vehicule_camionnette_nombre: z.number().min(0),
  vehicule_camionnette_etat: z.enum(["Bon", "Moyen", "Mauvais"]).optional(),
  vehicule_camionnette_statut: z.enum(["En marche", "En panne"]).optional(),
  vehicule_camionnette_proprietaire: z.boolean(),

  vehicule_liaison_nombre: z.number().min(0),
  vehicule_liaison_etat: z.enum(["Bon", "Moyen", "Mauvais"]).optional(),
  vehicule_liaison_statut: z.enum(["En marche", "En panne"]).optional(),
  vehicule_liaison_proprietaire: z.boolean(),

  vehicule_tricycle_nombre: z.number().min(0),
  vehicule_tricycle_etat: z.enum(["Bon", "Moyen", "Mauvais"]).optional(),
  vehicule_tricycle_statut: z.enum(["En marche", "En panne"]).optional(),
  vehicule_tricycle_proprietaire: z.boolean(),

  vehicule_moto_nombre: z.number().min(0),
  vehicule_moto_etat: z.enum(["Bon", "Moyen", "Mauvais"]).optional(),
  vehicule_moto_statut: z.enum(["En marche", "En panne"]).optional(),
  vehicule_moto_proprietaire: z.boolean(),

  // Matériel
  materiel_dickey_john: z.boolean(),
  materiel_dickey_john_photo: z.string().optional(),
  materiel_kpm: z.boolean(),
  materiel_kpm_photo: z.string().optional(),
  materiel_couteaux: z.boolean(),
  materiel_couteaux_photo: z.string().optional(),
  materiel_tableau: z.boolean(),
  materiel_tableau_photo: z.string().optional(),
  materiel_sondes: z.boolean(),
  materiel_sondes_photo: z.string().optional(),
  materiel_bascule: z.boolean(),
  materiel_bascule_photo: z.string().optional(),
  materiel_bascule_capacite: z.number().optional(),

  // Commercialisation
  comm_coop: z.boolean(),
  comm_coop_pct: z.number().optional(),
  comm_coop_lieu: z.string().optional(),
  comm_coop_prix_campagne: z.number().optional(),
  comm_coop_prix_intermediaire: z.number().optional(),

  comm_pisteur: z.boolean(),
  comm_pisteur_noms: z.string().optional(),
  comm_pisteur_pct: z.number().optional(),
  comm_pisteur_lieu: z.string().optional(),
  comm_pisteur_prix_campagne: z.number().optional(),
  comm_pisteur_prix_intermediaire: z.number().optional(),

  comm_autre_coop: z.boolean(),
  comm_autre_coop_noms: z.string().optional(),
  comm_autre_coop_pct: z.number().optional(),
  comm_autre_coop_lieu: z.string().optional(),
  comm_autre_coop_prix_campagne: z.number().optional(),
  comm_autre_coop_prix_intermediaire: z.number().optional(),

  comm_autre_acheteur: z.boolean(),
  comm_autre_acheteur_noms: z.string().optional(),
  comm_autre_acheteur_pct: z.number().optional(),
  comm_autre_acheteur_lieu: z.string().optional(),
  comm_autre_acheteur_prix_campagne: z.number().optional(),
  comm_autre_acheteur_prix_intermediaire: z.number().optional(),
});

type SectionFormData = z.infer<typeof sectionSchema>;

export default function SectionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      nb_producteurs: 0,
      tonnage_c_precedente: 0,
      tonnage_c_cours: 0,
      tonnage_potentiel: 0,
      president_contact: [""],
      secretaire_contact: [""],
      magasinier_contact: [""],
      peseur_contact: [""],
      analyseur_contact: [""],
      has_analyseur: false,
      vehicule_camionnette_nombre: 0,
      vehicule_camionnette_proprietaire: false,
      vehicule_liaison_nombre: 0,
      vehicule_liaison_proprietaire: false,
      vehicule_tricycle_nombre: 0,
      vehicule_tricycle_proprietaire: false,
      vehicule_moto_nombre: 0,
      vehicule_moto_proprietaire: false,
      materiel_dickey_john: false,
      materiel_kpm: false,
      materiel_couteaux: false,
      materiel_tableau: false,
      materiel_sondes: false,
      materiel_bascule: false,
      comm_coop: false,
      comm_pisteur: false,
      comm_autre_coop: false,
      comm_autre_acheteur: false,
    }
  });

  // Load existing data when editing
  useEffect(() => {
    if (isEdit && id) {
      setIsLoading(true);
      api.getSection(id)
        .then((section: any) => {
          reset({
            organisationId: section.organisationId,
            localite: section.localite,
            latitude: section.latitude,
            longitude: section.longitude,
            photo_magasin: section.photo_magasin,
            surface_magasin: section.surface_magasin,
            photo_aire_sechage: section.photo_aire_sechage,
            date_creation_section: section.date_creation_section,
            nom: section.nom,
            telephone: section.telephone,
            nb_producteurs: section.nb_producteurs || 0,
            tonnage_c_precedente: section.tonnage_c_precedente || 0,
            tonnage_c_cours: section.tonnage_c_cours || 0,
            tonnage_potentiel: section.tonnage_potentiel || 0,
            president_nom: section.president_nom,
            president_date_naissance: section.president_date_naissance,
            president_photo: section.president_photo,
            president_contact: section.president_contact || [""],
            secretaire_nom: section.secretaire_nom,
            secretaire_date_naissance: section.secretaire_date_naissance,
            secretaire_photo: section.secretaire_photo,
            secretaire_contact: section.secretaire_contact || [""],
            magasinier_nom: section.magasinier_nom,
            magasinier_date_naissance: section.magasinier_date_naissance,
            magasinier_photo: section.magasinier_photo,
            magasinier_contact: section.magasinier_contact || [""],
            peseur_nom: section.peseur_nom,
            peseur_date_naissance: section.peseur_date_naissance,
            peseur_photo: section.peseur_photo,
            peseur_contact: section.peseur_contact || [""],
            has_analyseur: section.has_analyseur || false,
            analyseur_nom: section.analyseur_nom,
            analyseur_date_naissance: section.analyseur_date_naissance,
            analyseur_photo: section.analyseur_photo,
            analyseur_contact: section.analyseur_contact || [""],
            vehicule_camionnette_nombre: section.vehicule_camionnette_nombre || 0,
            vehicule_camionnette_etat: section.vehicule_camionnette_etat,
            vehicule_camionnette_statut: section.vehicule_camionnette_statut,
            vehicule_camionnette_proprietaire: section.vehicule_camionnette_proprietaire || false,
            vehicule_liaison_nombre: section.vehicule_liaison_nombre || 0,
            vehicule_liaison_etat: section.vehicule_liaison_etat,
            vehicule_liaison_statut: section.vehicule_liaison_statut,
            vehicule_liaison_proprietaire: section.vehicule_liaison_proprietaire || false,
            vehicule_tricycle_nombre: section.vehicule_tricycle_nombre || 0,
            vehicule_tricycle_etat: section.vehicule_tricycle_etat,
            vehicule_tricycle_statut: section.vehicule_tricycle_statut,
            vehicule_tricycle_proprietaire: section.vehicule_tricycle_proprietaire || false,
            vehicule_moto_nombre: section.vehicule_moto_nombre || 0,
            vehicule_moto_etat: section.vehicule_moto_etat,
            vehicule_moto_statut: section.vehicule_moto_statut,
            vehicule_moto_proprietaire: section.vehicule_moto_proprietaire || false,
            materiel_dickey_john: section.materiel_dickey_john || false,
            materiel_dickey_john_photo: section.materiel_dickey_john_photo,
            materiel_kpm: section.materiel_kpm || false,
            materiel_kpm_photo: section.materiel_kpm_photo,
            materiel_couteaux: section.materiel_couteaux || false,
            materiel_couteaux_photo: section.materiel_couteaux_photo,
            materiel_tableau: section.materiel_tableau || false,
            materiel_tableau_photo: section.materiel_tableau_photo,
            materiel_sondes: section.materiel_sondes || false,
            materiel_sondes_photo: section.materiel_sondes_photo,
            materiel_bascule: section.materiel_bascule || false,
            materiel_bascule_photo: section.materiel_bascule_photo,
            materiel_bascule_capacite: section.materiel_bascule_capacite,
            comm_coop: section.comm_coop || false,
            comm_coop_pct: section.comm_coop_pct,
            comm_coop_lieu: section.comm_coop_lieu,
            comm_coop_prix_campagne: section.comm_coop_prix_campagne,
            comm_coop_prix_intermediaire: section.comm_coop_prix_intermediaire,
            comm_pisteur: section.comm_pisteur || false,
            comm_pisteur_noms: section.comm_pisteur_noms,
            comm_pisteur_pct: section.comm_pisteur_pct,
            comm_pisteur_lieu: section.comm_pisteur_lieu,
            comm_pisteur_prix_campagne: section.comm_pisteur_prix_campagne,
            comm_pisteur_prix_intermediaire: section.comm_pisteur_prix_intermediaire,
            comm_autre_coop: section.comm_autre_coop || false,
            comm_autre_coop_noms: section.comm_autre_coop_noms,
            comm_autre_coop_pct: section.comm_autre_coop_pct,
            comm_autre_coop_lieu: section.comm_autre_coop_lieu,
            comm_autre_coop_prix_campagne: section.comm_autre_coop_prix_campagne,
            comm_autre_coop_prix_intermediaire: section.comm_autre_coop_prix_intermediaire,
            comm_autre_acheteur: section.comm_autre_acheteur || false,
            comm_autre_acheteur_noms: section.comm_autre_acheteur_noms,
            comm_autre_acheteur_pct: section.comm_autre_acheteur_pct,
            comm_autre_acheteur_lieu: section.comm_autre_acheteur_lieu,
            comm_autre_acheteur_prix_campagne: section.comm_autre_acheteur_prix_campagne,
            comm_autre_acheteur_prix_intermediaire: section.comm_autre_acheteur_prix_intermediaire,
          });
        })
        .catch((error) => {
          console.error("Error loading section:", error);
          toast.error("Erreur lors du chargement de la section");
          navigate("/sections");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data: SectionFormData) => {
    setIsLoading(true);
    try {
      if (isEdit && id) {
        await api.updateSection(id, data);
        toast.success("Section mise à jour avec succès");
        navigate(`/sections/${id}`);
      } else {
        const code = generateSectionCode(Math.floor(Math.random() * 100));
        console.log("Section créée:", { code, ...data });
        toast.success(`Section ${code} enregistrée avec succès`);
        navigate("/sections");
      }
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error(isEdit ? "Erreur lors de la mise à jour" : "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPersonneFields = (prefix: string, title: string) => (
    <div className="border p-4 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg text-primary">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nom et Prénom *</Label>
          <Input {...register(`${prefix}_nom` as any)} placeholder="Nom complet" />
          {errors[prefix + "_nom" as keyof SectionFormData] && <p className="text-destructive text-sm">Requis</p>}
        </div>
        <div>
          <Label>Date de naissance</Label>
          <Input type="date" {...register(`${prefix}_date_naissance` as any)} />
        </div>
        <div className="md:col-span-2">
          <MultiPhone
            label="Contact téléphonique"
            values={watch(`${prefix}_contact` as any) || [""]}
            onChange={(vals) => setValue(`${prefix}_contact` as any, vals)}
          />
        </div>
        <div className="md:col-span-2">
          <PhotoCapture
            label={`Photo ${title}`}
            value={watch(`${prefix}_photo` as any)}
            onChange={(val) => setValue(`${prefix}_photo` as any, val)}
          />
        </div>
      </div>
    </div>
  );

  const renderVehiculeFields = (prefix: string, label: string) => (
    <div className="border p-3 rounded space-y-2">
      <h4 className="font-semibold">{label}</h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Nombre</Label>
          <Input type="number" {...register(`${prefix}_nombre` as any, { valueAsNumber: true })} />
        </div>
        <div>
          <div className="flex items-center gap-2 mt-8">
            <Checkbox
              checked={watch(`${prefix}_proprietaire` as any)}
              onCheckedChange={(chk) => setValue(`${prefix}_proprietaire` as any, !!chk)}
            />
            <Label>Propriétaire</Label>
          </div>
        </div>
      </div>
      {watch(`${prefix}_nombre` as any) > 0 && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>État</Label>
            <Select onValueChange={(val) => setValue(`${prefix}_etat` as any, val)}>
              <SelectTrigger><SelectValue placeholder="État" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Bon">Bon</SelectItem>
                <SelectItem value="Moyen">Moyen</SelectItem>
                <SelectItem value="Mauvais">Mauvais</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Statut</Label>
            <Select onValueChange={(val) => setValue(`${prefix}_statut` as any, val)}>
              <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="En marche">En marche</SelectItem>
                <SelectItem value="En panne">En panne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
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
              <Label>Noms (séparés par virgule)</Label>
              <Input {...register(`${prefix}_noms` as any)} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>% Quantité concernée</Label>
              <Input type="number" {...register(`${prefix}_pct` as any, { valueAsNumber: true })} />
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
              <Label>Prix Intermédiaire (FCFA)</Label>
              <Input type="number" {...register(`${prefix}_prix_intermediaire` as any, { valueAsNumber: true })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/sections")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isEdit ? "Modifier Section" : "Nouvelle Section"}</h1>
          <p className="text-muted-foreground">Saisie détaillée des informations de la section</p>
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
              <Label>Organisation Parente *</Label>
              <Select onValueChange={(val) => setValue("organisationId", val)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORG-001">SCOOP-CA Divo</SelectItem>
                  <SelectItem value="ORG-002">Union Gagnoa</SelectItem>
                </SelectContent>
              </Select>
              {errors.organisationId && <p className="text-destructive text-sm">Requis</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nom de la section *</Label>
                <Input {...register("nom")} />
                {errors.nom && <p className="text-destructive text-sm">Requis</p>}
              </div>
              <div>
                <Label>Localité *</Label>
                <Input {...register("localite")} />
                {errors.localite && <p className="text-destructive text-sm">Requis</p>}
              </div>
              <div>
                <Label>Date de création</Label>
                <Input type="date" {...register("date_creation_section")} />
              </div>
              <div>
                <Label>Téléphone Section</Label>
                <Input type="tel" {...register("telephone")} />
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="mb-2 block font-semibold">Coordonnées GPS</Label>
              <GPSCapture
                onChange={(c) => { setValue("latitude", c.latitude); setValue("longitude", c.longitude); }}
                latitude={watch("latitude")}
                longitude={watch("longitude")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhotoCapture label="Photo Magasin" value={watch("photo_magasin")} onChange={(v) => setValue("photo_magasin", v)} />
              <div>
                <Label>Surface Magasin (m²)</Label>
                <Input type="number" {...register("surface_magasin", { valueAsNumber: true })} />
              </div>
              <PhotoCapture label="Photo Aire de séchage" value={watch("photo_aire_sechage")} onChange={(v) => setValue("photo_aire_sechage", v)} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded">
              <div>
                <Label>Producteurs déclarés</Label>
                <Input type="number" {...register("nb_producteurs", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Tonnage Précédent</Label>
                <Input type="number" {...register("tonnage_c_precedente", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Tonnage En cours</Label>
                <Input type="number" {...register("tonnage_c_cours", { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Tonnage Potentiel</Label>
                <Input type="number" {...register("tonnage_potentiel", { valueAsNumber: true })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Dirigeants */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Dirigeants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderPersonneFields("president", "Président ou Délégué")}
            {renderPersonneFields("secretaire", "Secrétaire")}
          </CardContent>
        </Card>

        {/* 3. Personnel */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Personnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderPersonneFields("magasinier", "Magasinier")}
            {renderPersonneFields("peseur", "Peseur")}

            <div className="border p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox checked={watch("has_analyseur")} onCheckedChange={(chk) => setValue("has_analyseur", !!chk)} />
                <Label className="font-semibold text-lg">Analyseur</Label>
              </div>
              {watch("has_analyseur") && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom et Prénom</Label>
                      <Input {...register("analyseur_nom")} />
                    </div>
                    <div>
                      <Label>Date de naissance</Label>
                      <Input type="date" {...register("analyseur_date_naissance")} />
                    </div>
                    <div className="md:col-span-2">
                      <MultiPhone
                        label="Contact"
                        values={watch("analyseur_contact") || [""]}
                        onChange={(vals) => setValue("analyseur_contact", vals)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <PhotoCapture
                        label="Photo Analyseur"
                        value={watch("analyseur_photo")}
                        onChange={(val) => setValue("analyseur_photo", val)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 4. Equipements */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Equipements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Véhicules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderVehiculeFields("vehicule_camionnette", "Camionnettes")}
                {renderVehiculeFields("vehicule_liaison", "Véhicules de liaison")}
                {renderVehiculeFields("vehicule_tricycle", "Tricycles")}
                {renderVehiculeFields("vehicule_moto", "Motos")}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Matériel de pesage et contrôle qualité</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: "materiel_dickey_john", label: "Dickey John" },
                  { id: "materiel_kpm", label: "KPM" },
                  { id: "materiel_couteaux", label: "Couteaux de coupe" },
                  { id: "materiel_tableau", label: "Tableau d'analyse" },
                  { id: "materiel_sondes", label: "Sondes" },
                ].map((item: any) => (
                  <div key={item.id} className="border p-3 rounded space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={watch(item.id)} onCheckedChange={(chk) => setValue(item.id, !!chk)} />
                      <Label>{item.label}</Label>
                    </div>
                    {watch(item.id) && (
                      <PhotoCapture label={`Photo ${item.label}`} value={watch(`${item.id}_photo` as any)} onChange={(v) => setValue(`${item.id}_photo` as any, v)} />
                    )}
                  </div>
                ))}

                {/* Bascule Spécifique */}
                <div className="border p-3 rounded space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={watch("materiel_bascule")} onCheckedChange={(chk) => setValue("materiel_bascule", !!chk)} />
                    <Label>Bascule</Label>
                  </div>
                  {watch("materiel_bascule") && (
                    <div className="space-y-2">
                      <Input type="number" placeholder="Capacité (kg)" {...register("materiel_bascule_capacite", { valueAsNumber: true })} />
                      <PhotoCapture label="Photo Bascule" value={watch("materiel_bascule_photo")} onChange={(v) => setValue("materiel_bascule_photo", v)} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. Commercialisation */}
        <Card>
          <CardHeader>
            <CardTitle className="bg-primary/10 p-2 rounded text-primary">Commercialisation Production</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderCommFields("comm_coop", "Produits issus de la Coopérative")}
            {renderCommFields("comm_pisteur", "Produits issus des Pisteurs", true)}
            {renderCommFields("comm_autre_coop", "Produits issus des autres Coopératives", true)}
            {renderCommFields("comm_autre_acheteur", "Produits issus des autres acheteurs", true)}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end pt-4">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/sections")}>
            Annuler
          </Button>
          <Button type="submit" size="lg" className="gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isEdit ? "Mettre à jour" : "Enregistrer la Section"}
          </Button>
        </div>
      </form>
    </div>
  );
}
