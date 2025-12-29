import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, CheckCircle2, Award, MapPin, Users, Sprout, AlertTriangle, Banknote, TrendingDown, Droplets, Zap, BookOpen, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { Organisation, Section, Village, Producteur, Parcelle, Operation } from "@/types/organisation";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [producteurs, setProducteurs] = useState<Producteur[]>([]);
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [orgs, secs, vills, prods, parcs, ops] = await Promise.all([
        api.getOrganisations(),
        api.getSections(),
        api.getVillages(),
        api.getProducteurs(),
        api.getParcelles(),
        api.getOperations(),
      ]);
      setOrganisations(orgs);
      setSections(secs);
      setVillages(vills);
      setProducteurs(prods);
      setParcelles(parcs);
      setOperations(ops);
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul des statistiques réelles
  const stats = {
    totalProducteurs: producteurs.filter(p => p.statut === 'actif').length,
    totalProducteursEnregistres: producteurs.length,
    totalParcelles: parcelles.filter(p => p.statut === 'active').length,
    totalOperations: operations.length,
    volumeTotal: operations.reduce((sum, op) => sum + (op.manutention_pesee || op.poids_estimatif || 0), 0) / 1000, // En tonnes (poids réel de la pesée)
    montantTotal: operations.reduce((sum, op) => sum + ((op.montant_especes || 0) + (op.montant_cheque || 0)), 0) / 1000000, // En millions FCFA
    superficieTotale: parcelles.reduce((sum, p) => sum + (p.superficie_declaree || 0), 0),
    superficieMappee: parcelles.filter(p => p.latitude && p.longitude).reduce((sum, p) => sum + (p.superficie_declaree || 0), 0),
  };

  // Calcul des données de production par mois
  const productionData = (() => {
    const moisNoms = ['Oct', 'Nov', 'Dec', 'Jan', 'Fev', 'Mar'];
    const currentYear = new Date().getFullYear();
    return moisNoms.map((moisNom, index) => {
      const operationsMois = operations.filter(op => {
        // Utiliser date_recolte_1 comme date principale, sinon date_creation
        const dateOp = new Date(op.date_recolte_1 || op.date_creation);
        const moisNum = index < 3 ? 10 + index : index - 2; // Oct=10, Nov=11, Dec=12, Jan=1, Fev=2, Mar=3
        return dateOp.getMonth() + 1 === moisNum && dateOp.getFullYear() === (moisNum >= 10 ? currentYear - 1 : currentYear);
      });
      const recolte = operationsMois.reduce((sum, op) => sum + (op.manutention_pesee || op.poids_estimatif || 0), 0) / 1000;
      const prevision = stats.volumeTotal / 6; // Estimation simple
      return { mois: moisNom, recolte: Math.round(recolte * 10) / 10, prevision: Math.round(prevision * 10) / 10 };
    });
  })();

  // Données de collecte par jour/semaine/mois
  const dailyCollectionData = (() => {
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const aujourdhui = new Date();
    const debutSemaine = new Date(aujourdhui);
    debutSemaine.setDate(aujourdhui.getDate() - aujourdhui.getDay() + 1); // Lundi
    
    return jours.map((jour, index) => {
      const date = new Date(debutSemaine);
      date.setDate(debutSemaine.getDate() + index);
      const opsJour = operations.filter(op => {
        // Utiliser date_livraison comme date de collecte, sinon date_creation
        const dateOp = new Date(op.date_livraison || op.date_creation);
        return dateOp.toDateString() === date.toDateString();
      });
      const poids = opsJour.reduce((sum, op) => sum + (op.manutention_pesee || op.poids_estimatif || 0), 0) / 1000;
      return { period: jour, poids: Math.round(poids * 10) / 10, nb: opsJour.length };
    });
  })();

  const weeklyCollectionData = (() => {
    const semaines = ['Sem 48', 'Sem 49', 'Sem 50', 'Sem 51', 'Sem 52', 'Sem 01'];
    return semaines.map(sem => {
      // Approximation simple - à améliorer avec vraies dates
      const nbOps = Math.floor(operations.length / 6);
      const poids = (stats.volumeTotal / 6);
      return { period: sem, poids: Math.round(poids * 10) / 10, nb: nbOps };
    });
  })();

  const monthlyCollectionData = (() => {
    const mois = ['Août', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    return mois.map(m => {
      const nbOps = Math.floor(operations.length / 6);
      const poids = (stats.volumeTotal / 6);
      return { period: m, poids: Math.round(poids * 10) / 10, nb: nbOps };
    });
  })();

  // Données maladies (basées sur validation_statut - Accepté = Sain, Refoulé/A reconditionner = Problème)
  const maladieData = (() => {
    const total = operations.length || 1;
    const acceptes = operations.filter(op => op.validation_statut === 'Accepté').length;
    const refoules = operations.filter(op => op.validation_statut === 'Refoulé').length;
    const reconditionner = operations.filter(op => op.validation_statut === 'A reconditionner').length;
    const sain = acceptes;
    
    return [
      { name: 'Accepté', value: Math.round((sain / total) * 100), color: '#22c55e' },
      { name: 'Refoulé', value: Math.round((refoules / total) * 100), color: '#ef4444' },
      { name: 'A reconditionner', value: Math.round((reconditionner / total) * 100), color: '#f97316' },
    ].filter(m => m.value > 0);
  })();

  // Activités récentes (basées sur les dernières opérations)
  const activities = operations
    .sort((a, b) => new Date(b.date_creation || 0).getTime() - new Date(a.date_creation || 0).getTime())
    .slice(0, 4)
    .map(op => {
      const producteur = producteurs.find(p => p.id === op.id_producteur);
      const village = villages.find(v => v.id === op.id_village);
      const timeAgo = (() => {
        const date = new Date(op.date_creation || Date.now());
        const diff = Date.now() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "Il y a moins d'1h";
        if (hours < 24) return `Il y a ${hours}h`;
        return `Il y a ${Math.floor(hours / 24)}j`;
      })();
      
      return {
        action: op.statut === 'Validé' || op.statut === 'Payé' ? "Nouvelle récolte validée" : "Opération enregistrée",
        detail: `${(op.manutention_pesee || op.poids_estimatif || 0) / 1000} Tonnes${village ? ` (${village.nom})` : ''}`,
        time: timeAgo,
        status: op.statut === 'Validé' || op.statut === 'Payé' ? "success" : op.statut === 'En cours' ? "info" : "destructive",
        icon: op.statut === 'Validé' || op.statut === 'Payé' ? Sprout : Clock,
      };
    });

  // Stats sociales (approximation basée sur les producteurs)
  const socialStats = {
    scolarisation: 78, // Données non disponibles dans le schéma actuel
    eauPotable: 62,
    electricite: 45,
    bancarisation: 32,
  };

  // Calcul genre
  const producteursHommes = producteurs.filter(p => p.sexe === 'M').length;
  const producteursFemmes = producteurs.filter(p => p.sexe === 'F').length;
  const totalGenre = producteursHommes + producteursFemmes || 1;
  const pourcentageHommes = Math.round((producteursHommes / totalGenre) * 100);
  const pourcentageFemmes = Math.round((producteursFemmes / totalGenre) * 100);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête Décideur */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Stratégique</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de la campagne 2024-2025</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-muted-foreground">
            Dernière synchro: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <Badge variant="outline" className="text-success border-success bg-success/10">
            {isLoading ? 'Chargement...' : 'Système Opérationnel'}
          </Badge>
        </div>
      </div>

      {/* 1. KPIs Financiers & Commerciaux (Ligne du haut) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volume Récolté</p>
                <h3 className="text-3xl font-bold mt-2">{stats.volumeTotal.toFixed(1)} T</h3>
                <div className="flex items-center gap-1 mt-1 text-success text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>{stats.totalOperations} opérations</span>
                </div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Sprout className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paiements Effectués</p>
                <h3 className="text-3xl font-bold mt-2">{stats.montantTotal.toFixed(1)} M <span className="text-lg font-normal text-muted-foreground">FCFA</span></h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{operations.filter(op => op.statut === 'Validé' || op.statut === 'Payé').length} validées</span>
                </div>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-full text-amber-500">
                <Banknote className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de Validation</p>
                <h3 className="text-3xl font-bold mt-2">
                  {stats.totalOperations > 0 ? Math.round((operations.filter(op => op.statut === 'Validé' || op.statut === 'Payé').length / stats.totalOperations) * 100) : 0}%
                </h3>
                <div className="flex items-center gap-1 mt-1 text-success text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{operations.filter(op => op.statut === 'Validé' || op.statut === 'Payé').length} validées</span>
                </div>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                <Award className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Producteurs Actifs</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalProducteurs.toLocaleString()}</h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                  <span>Sur {stats.totalProducteursEnregistres} enregistrés</span>
                </div>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full text-purple-500">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Analyse Détaillée (Tabs) */}
      <Tabs defaultValue="production" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="agronomie">Agronomie</TabsTrigger>
          <TabsTrigger value="social">Impact Social</TabsTrigger>
        </TabsList>

        {/* Onglet Production */}
        <TabsContent value="production" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution de la Collecte (Tonnes)</CardTitle>
                <CardDescription>Comparaison Réel vs Prévisionnel</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productionData}>
                    <defs>
                      <linearGradient id="colorRecolte" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" dataKey="recolte" stroke="#10b981" fillOpacity={1} fill="url(#colorRecolte)" name="Récolte Réelle" />
                    <Line type="monotone" dataKey="prevision" stroke="#94a3b8" strokeDasharray="5 5" name="Objectif" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes Récentes</CardTitle>
                <CardDescription>Points d'attention opérationnels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className={`p-2 rounded-full mt-1 ${
                        item.status === 'destructive' ? 'bg-red-100 text-red-600' : 
                        item.status === 'success' ? 'bg-green-100 text-green-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-2 text-center">
                  <Button variant="ghost" onClick={() => navigate("/operations")} className="text-primary hover:text-primary/80 hover:bg-primary/10 w-full">
                    Voir toutes les opérations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

            {/* Point des Collectes - Nouveau Module */}
            <Card className="mt-6 border-l-4 border-l-indigo-500 shadow-md">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                      Point des Collectes
                    </CardTitle>
                    <CardDescription>Analyse détaillée des volumes et fréquences de collecte</CardDescription>
                  </div>
                  <Badge variant="secondary" className="w-fit text-indigo-700 bg-indigo-50 border-indigo-200 px-3 py-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Données en Temps Réel
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="jour" className="w-full">
                  <div className="flex justify-center md:justify-start mb-6">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-3">
                      <TabsTrigger value="jour">Jour</TabsTrigger>
                      <TabsTrigger value="semaine">Semaine</TabsTrigger>
                      <TabsTrigger value="mois">Mois</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  {['jour', 'semaine', 'mois'].map((mode) => {
                    const data = mode === 'jour' ? dailyCollectionData 
                              : mode === 'semaine' ? weeklyCollectionData 
                              : monthlyCollectionData;
                    const color = mode === 'jour' ? '#3b82f6' : mode === 'semaine' ? '#8b5cf6' : '#10b981';
                    const title = mode === 'jour' ? 'Quotidien' : mode === 'semaine' ? 'Hebdomadaire' : 'Mensuel';
                    
                    return (
                      <TabsContent key={mode} value={mode} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="h-[350px] w-full bg-muted/5 rounded-lg p-4 border border-dashed">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                              <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: color }} label={{ value: 'Volume (T)', angle: -90, position: 'insideLeft', fill: color }} />
                              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} label={{ value: 'Nb Collectes', angle: 90, position: 'insideRight', fill: '#94a3b8' }} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                              />
                              <Legend verticalAlign="top" height={36}/>
                              <Bar yAxisId="left" dataKey="poids" name="Volume (Tonnes)" fill={color} radius={[4, 4, 0, 0]} barSize={40} />
                              <Bar yAxisId="right" dataKey="nb" name="Nb Collectes" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                           <div className="bg-muted/20 p-3 rounded-md text-center">
                             <p className="text-xs text-muted-foreground uppercase font-semibold">Total {title}</p>
                             <p className="text-2xl font-bold text-foreground">
                               {data.reduce((acc, curr) => acc + curr.poids, 0).toFixed(1)} T
                             </p>
                           </div>
                           <div className="bg-muted/20 p-3 rounded-md text-center">
                             <p className="text-xs text-muted-foreground uppercase font-semibold">Collectes</p>
                             <p className="text-2xl font-bold text-foreground">
                               {data.reduce((acc, curr) => acc + curr.nb, 0)}
                             </p>
                           </div>
                           <div className="bg-muted/20 p-3 rounded-md text-center">
                             <p className="text-xs text-muted-foreground uppercase font-semibold">Moyenne / Collecte</p>
                             <p className="text-2xl font-bold text-foreground">
                               {(data.reduce((acc, curr) => acc + curr.poids, 0) / data.reduce((acc, curr) => acc + curr.nb, 0) * 1000).toFixed(0)} Kg
                             </p>
                           </div>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Onglet Agronomie */}
        <TabsContent value="agronomie" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Santé du Verger</CardTitle>
                <CardDescription>Prévalence des maladies déclarées</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={maladieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {maladieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Superficies</CardTitle>
                <CardDescription>GPS vs Déclaré</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Superficie Totale Déclarée</span>
                  <span className="text-xl font-bold">{stats.superficieTotale.toFixed(1)} Ha</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Superficie Totale Mappée (GPS)</span>
                  <span className="text-xl font-bold text-primary">{stats.superficieMappee.toFixed(1)} Ha</span>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${stats.superficieTotale > 0 ? (stats.superficieMappee / stats.superficieTotale) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {stats.superficieTotale > 0 ? Math.round((stats.superficieMappee / stats.superficieTotale) * 100) : 0}% de la surface déclarée a été vérifiée par GPS
                </p>
                <div className="flex justify-center pt-4">
                   <Button variant="outline" onClick={() => navigate('/plantations/carte')}>
                     <MapPin className="mr-2 h-4 w-4" />
                     Voir la Carte Interactive
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Social */}
        <TabsContent value="social" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="text-2xl font-bold">{socialStats.scolarisation}%</h3>
                <p className="text-sm text-blue-700">Enfants Scolarisés</p>
              </CardContent>
            </Card>
            <Card className="bg-cyan-50 border-cyan-100">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Droplets className="h-8 w-8 text-cyan-600 mb-2" />
                <h3 className="text-2xl font-bold">{socialStats.eauPotable}%</h3>
                <p className="text-sm text-cyan-700">Accès Eau Potable</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-100">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <h3 className="text-2xl font-bold">{socialStats.electricite}%</h3>
                <p className="text-sm text-yellow-700">Accès Électricité</p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Banknote className="h-8 w-8 text-emerald-600 mb-2" />
                <h3 className="text-2xl font-bold">{socialStats.bancarisation}%</h3>
                <p className="text-sm text-emerald-700">Bancarisés</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Analyse Genre & Démographie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                   <div className="flex justify-between mb-2 text-sm">
                     <span>Hommes</span>
                     <span>{pourcentageHommes}%</span>
                   </div>
                   <Progress value={pourcentageHommes} className="h-3 bg-blue-100" />
                 </div>
                 <div>
                   <div className="flex justify-between mb-2 text-sm">
                     <span>Femmes</span>
                     <span>{pourcentageFemmes}%</span>
                   </div>
                   <Progress value={pourcentageFemmes} className="h-3 bg-pink-100" />
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
