import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Search, Users, Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MembreOrganisation, Organisation } from "@/types/organisation";
import { membreOrganisationService } from "@/services/organisationService";
import { api } from "@/services/api";

export default function OrganisationMembres() {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [membres, setMembres] = useState<MembreOrganisation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMembre, setEditingMembre] = useState<MembreOrganisation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Formulaire
  const [formData, setFormData] = useState({
    id_membre: "",
    role: "membre" as MembreOrganisation['role'],
    date_adhesion: new Date().toISOString().split('T')[0],
    statut: "actif" as MembreOrganisation['statut'],
    notes: "",
  });

  useEffect(() => {
    if (orgId) {
      loadOrganisation();
      loadMembres();
    }
  }, [orgId]);

  const loadOrganisation = async () => {
    if (!orgId) return;
    try {
      setIsLoading(true);
      const org = await api.getOrganisation(orgId);
      setOrganisation(org);
    } catch (error) {
      console.error("Erreur chargement organisation:", error);
      toast.error("Erreur lors du chargement de l'organisation");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembres = () => {
    if (orgId) {
      const data = membreOrganisationService.getByOrganisation(orgId);
      setMembres(data);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgId) return;

    try {
      if (editingMembre) {
        membreOrganisationService.update(editingMembre.id, {
          ...formData,
          date_adhesion: new Date(formData.date_adhesion),
        });
        toast.success("Membre mis à jour avec succès");
      } else {
        membreOrganisationService.create({
          ...formData,
          id_organisation: orgId,
          date_adhesion: new Date(formData.date_adhesion),
          statut: formData.statut,
        });
        toast.success("Membre ajouté avec succès");
      }
      
      loadMembres();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (membre: MembreOrganisation) => {
    setEditingMembre(membre);
    setFormData({
      id_membre: membre.id_membre,
      role: membre.role,
      date_adhesion: new Date(membre.date_adhesion).toISOString().split('T')[0],
      statut: membre.statut,
      notes: membre.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      membreOrganisationService.delete(id);
      loadMembres();
      toast.success("Membre supprimé");
    }
  };

  const resetForm = () => {
    setFormData({
      id_membre: "",
      role: "membre",
      date_adhesion: new Date().toISOString().split('T')[0],
      statut: "actif",
      notes: "",
    });
    setEditingMembre(null);
  };

  const getStatusBadge = (statut: string) => {
    const colors = {
      actif: "bg-success text-success-foreground",
      inactif: "bg-muted text-muted-foreground",
      suspendu: "bg-warning text-warning-foreground",
    };
    return colors[statut as keyof typeof colors] || colors.actif;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      président: "bg-primary text-primary-foreground",
      secrétaire: "bg-blue-500 text-white",
      trésorier: "bg-green-500 text-white",
      membre: "bg-gray-500 text-white",
      autre: "bg-gray-400 text-white",
    };
    return colors[role as keyof typeof colors] || colors.membre;
  };

  const filteredMembres = membres.filter(m => {
    const query = searchQuery.toLowerCase();
    return m.id_membre.toLowerCase().includes(query) ||
           m.role.toLowerCase().includes(query);
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de l'organisation...</p>
        </div>
      </div>
    );
  }

  if (!organisation) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/organisations")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Organisation non trouvée</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">L'organisation avec l'ID "{orgId}" n'a pas été trouvée.</p>
            <Button className="mt-4" onClick={() => navigate("/organisations")}>
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/organisations")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Membres de l'Organisation</h1>
          <p className="text-muted-foreground mt-1">{organisation.nom}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des Membres
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un Membre
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingMembre ? "Modifier le Membre" : "Ajouter un Membre"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="id_membre">ID du Membre (Producteur) *</Label>
                    <Input
                      id="id_membre"
                      value={formData.id_membre}
                      onChange={(e) => setFormData({ ...formData, id_membre: e.target.value })}
                      placeholder="Ex: PROD-0001"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Rôle *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value as MembreOrganisation['role'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="président">Président</SelectItem>
                        <SelectItem value="secrétaire">Secrétaire</SelectItem>
                        <SelectItem value="trésorier">Trésorier</SelectItem>
                        <SelectItem value="membre">Membre</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date_adhesion">Date d'Adhésion *</Label>
                    <Input
                      id="date_adhesion"
                      type="date"
                      value={formData.date_adhesion}
                      onChange={(e) => setFormData({ ...formData, date_adhesion: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="statut">Statut *</Label>
                    <Select
                      value={formData.statut}
                      onValueChange={(value) => setFormData({ ...formData, statut: value as MembreOrganisation['statut'] })}
                    >
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

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Notes supplémentaires..."
                    />
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingMembre ? "Mettre à jour" : "Ajouter"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Membre</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date d'Adhésion</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembres.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucun membre trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembres.map((membre) => (
                    <TableRow key={membre.id}>
                      <TableCell className="font-mono">{membre.id_membre}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadge(membre.role)}>
                          {membre.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(membre.date_adhesion).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(membre.statut)}>
                          {membre.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {membre.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(membre)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(membre.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
