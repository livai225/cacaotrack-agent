import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, CheckCircle2, Award, MapPin, Users, Sprout, AlertTriangle, Banknote, TrendingDown, Droplets, Zap, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useNavigate } from "react-router-dom";

// --- Données Simulées (Mock Data) ---

// 1. Production & Volumes
const productionData = [
  { mois: 'Oct', recolte: 45, prevision: 50 },
  { mois: 'Nov', recolte: 120, prevision: 110 },
  { mois: 'Dec', recolte: 180, prevision: 160 },
  { mois: 'Jan', recolte: 150, prevision: 140 },
  { mois: 'Fev', recolte: 80, prevision: 90 },
  { mois: 'Mar', recolte: 60, prevision: 60 },
];

// 2. Maladies
const maladieData = [
  { name: 'Sain', value: 65, color: '#22c55e' },
  { name: 'Swollen Shoot', value: 15, color: '#ef4444' },
  { name: 'Pourriture Brune', value: 12, color: '#f97316' },
  { name: 'Insectes', value: 8, color: '#eab308' },
];

// 2b. Données de Collecte (Jour/Semaine/Mois)
const dailyCollectionData = [
  { period: 'Lun', poids: 12.5, nb: 45 },
  { period: 'Mar', poids: 15.2, nb: 52 },
  { period: 'Mer', poids: 18.0, nb: 61 },
  { period: 'Jeu', poids: 14.8, nb: 48 },
  { period: 'Ven', poids: 22.5, nb: 75 },
  { period: 'Sam', poids: 25.0, nb: 82 },
  { period: 'Dim', poids: 8.5, nb: 28 },
];

const weeklyCollectionData = [
  { period: 'Sem 48', poids: 85, nb: 280 },
  { period: 'Sem 49', poids: 92, nb: 310 },
  { period: 'Sem 50', poids: 110, nb: 350 },
  { period: 'Sem 51', poids: 105, nb: 340 },
  { period: 'Sem 52', poids: 125, nb: 410 },
  { period: 'Sem 01', poids: 65, nb: 215 }, // En cours
];

const monthlyCollectionData = [
  { period: 'Août', poids: 45, nb: 150 },
  { period: 'Sep', poids: 80, nb: 260 },
  { period: 'Oct', poids: 120, nb: 400 },
  { period: 'Nov', poids: 150, nb: 480 },
  { period: 'Dec', poids: 180, nb: 550 },
  { period: 'Jan', poids: 60, nb: 200 }, // En cours
];

// 3. Social & Impact
const socialStats = {
  scolarisation: 78, // %
  eauPotable: 62, // %
  electricite: 45, // %
  bancarisation: 32, // %
};

// 4. Activités Récentes
const activities = [
  { action: "Nouvelle récolte validée", detail: "3.2 Tonnes (Section Nord)", time: "Il y a 10 min", status: "success", icon: Sprout },
  { action: "Alerte Maladie", detail: "Swollen Shoot détecté (Plantation P-089)", time: "Il y a 45 min", status: "destructive", icon: AlertTriangle },
  { action: "Paiement effectué", detail: "1.5M FCFA (Virement)", time: "Il y a 2h", status: "success", icon: Banknote },
  { action: "Nouveau Producteur", detail: "Kouassi Jean (Village Centre)", time: "Il y a 4h", status: "info", icon: Users },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête Décideur */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Stratégique</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de la campagne 2024-2025</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-muted-foreground">Dernière synchro: Aujourd'hui 14:30</p>
          <Badge variant="outline" className="text-success border-success bg-success/10">Système Opérationnel</Badge>
        </div>
      </div>

      {/* 1. KPIs Financiers & Commerciaux (Ligne du haut) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volume Récolté</p>
                <h3 className="text-3xl font-bold mt-2">635 T</h3>
                <div className="flex items-center gap-1 mt-1 text-success text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12% vs N-1</span>
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
                <h3 className="text-3xl font-bold mt-2">425 M <span className="text-lg font-normal text-muted-foreground">FCFA</span></h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  <span>En cours de traitement: 45M</span>
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
                <p className="text-sm font-medium text-muted-foreground">Taux de Loyauté</p>
                <h3 className="text-3xl font-bold mt-2">87%</h3>
                <div className="flex items-center gap-1 mt-1 text-success text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+5% vs N-1</span>
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
                <h3 className="text-3xl font-bold mt-2">1,240</h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                  <span>Sur 1,450 enregistrés</span>
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
                  <span className="text-xl font-bold">4,520 Ha</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Superficie Totale Mappée (GPS)</span>
                  <span className="text-xl font-bold text-primary">4,150 Ha</span>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[92%]"></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">92% de la surface déclarée a été vérifiée par GPS</p>
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
                     <span>78%</span>
                   </div>
                   <Progress value={78} className="h-3 bg-blue-100" />
                 </div>
                 <div>
                   <div className="flex justify-between mb-2 text-sm">
                     <span>Femmes</span>
                     <span>22%</span>
                   </div>
                   <Progress value={22} className="h-3 bg-pink-100" />
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
