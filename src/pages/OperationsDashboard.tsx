import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, Clock, CheckCircle2, Users, Calendar,
  Package, DollarSign, Activity, BarChart3, TrendingDown,
  AlertCircle, Loader2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useState, useEffect } from "react";
import { api } from "@/services/api";

// Types
interface OperationStats {
  total: number;
  enCours: number;
  terminees: number;
  annulees: number;
  poidsTotal: number;
  montantTotal: number;
  dureeMoyenne: number;
  parJour: { date: string; count: number; poids: number }[];
  parMois: { mois: string; count: number; poids: number; montant: number }[];
  parStatut: { statut: string; count: number; pourcentage: number }[];
  parEtape: { etape: string; count: number }[];
  topProducteurs: { nom: string; count: number; poids: number }[];
  topAgents: { nom: string; count: number }[];
}

// Couleurs pour les graphiques
const COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#a855f7',
  pink: '#ec4899',
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
];

export default function OperationsDashboard() {
  const [stats, setStats] = useState<OperationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const operations = await api.getOperations();
      const calculatedStats = calculateStats(operations as any[], timeRange);
      setStats(calculatedStats);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (operations: any[], range: string): OperationStats => {
    // Filtrer par période
    const now = new Date();
    const rangeMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
    }[range];

    const filteredOps = operations.filter(op => {
      const createdAt = new Date(op.createdAt);
      return now.getTime() - createdAt.getTime() <= rangeMs;
    });

    // Statistiques de base
    const total = filteredOps.length;
    const enCours = filteredOps.filter(op => {
      const prog = calculateProgression(op);
      return prog < 100 && op.statut !== 'Annulé';
    }).length;
    const terminees = filteredOps.filter(op => {
      const prog = calculateProgression(op);
      return prog === 100 || op.statut === 'Payé';
    }).length;
    const annulees = filteredOps.filter(op => op.statut === 'Annulé').length;

    // Poids et montant total
    const poidsTotal = filteredOps.reduce((sum, op) => sum + (op.manutention_pesee || 0), 0);
    const montantTotal = filteredOps.reduce((sum, op) => sum + (op.montant_du || 0), 0);

    // Durée moyenne (en jours)
    const dureeMoyenne = calculateAverageDuration(filteredOps);

    // Par jour (derniers 30 jours)
    const parJour = calculateDailyStats(filteredOps);

    // Par mois
    const parMois = calculateMonthlyStats(filteredOps);

    // Par statut
    const parStatut = calculateStatusStats(filteredOps);

    // Par étape
    const parEtape = calculateStageStats(filteredOps);

    // Top producteurs
    const topProducteurs = calculateTopProducers(filteredOps);

    // Top agents
    const topAgents = calculateTopAgents(filteredOps);

    return {
      total,
      enCours,
      terminees,
      annulees,
      poidsTotal,
      montantTotal,
      dureeMoyenne,
      parJour,
      parMois,
      parStatut,
      parEtape,
      topProducteurs,
      topAgents,
    };
  };

  const calculateProgression = (operation: any): number => {
    const etapes = [
      'date_recolte_1',
      'date_ecabossage',
      'fermentation_debut',
      'fermentation_fin',
      'sechage_debut',
      'sechage_fin',
      'date_transport',
      'date_livraison',
      'date_paiement',
    ];

    const completed = etapes.filter(etape => {
      const val = operation[etape];
      return val !== null && val !== undefined && val !== '';
    }).length;

    return Math.round((completed / etapes.length) * 100);
  };

  const calculateAverageDuration = (operations: any[]): number => {
    const durations = operations
      .filter(op => op.date_recolte_1 && op.date_paiement)
      .map(op => {
        const start = new Date(op.date_recolte_1).getTime();
        const end = new Date(op.date_paiement).getTime();
        return (end - start) / (1000 * 60 * 60 * 24); // en jours
      });

    if (durations.length === 0) return 0;
    return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
  };

  const calculateDailyStats = (operations: any[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const dayOps = operations.filter(op => {
        const opDate = new Date(op.createdAt).toISOString().split('T')[0];
        return opDate === date;
      });

      return {
        date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        count: dayOps.length,
        poids: dayOps.reduce((sum, op) => sum + (op.manutention_pesee || 0), 0),
      };
    });
  };

  const calculateMonthlyStats = (operations: any[]) => {
    const monthsMap = new Map<string, { count: number; poids: number; montant: number }>();

    operations.forEach(op => {
      const date = new Date(op.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

      if (!monthsMap.has(monthKey)) {
        monthsMap.set(monthKey, { count: 0, poids: 0, montant: 0 });
      }

      const stats = monthsMap.get(monthKey)!;
      stats.count++;
      stats.poids += op.manutention_pesee || 0;
      stats.montant += op.montant_du || 0;
    });

    return Array.from(monthsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([key, stats]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
          mois: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
          ...stats,
        };
      });
  };

  const calculateStatusStats = (operations: any[]) => {
    const statusMap = new Map<string, number>();

    operations.forEach(op => {
      const status = op.statut || 'Non défini';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    const total = operations.length || 1;

    return Array.from(statusMap.entries()).map(([statut, count]) => ({
      statut,
      count,
      pourcentage: Math.round((count / total) * 100),
    }));
  };

  const calculateStageStats = (operations: any[]) => {
    const stages = [
      { name: 'Récolte', field: 'date_recolte_1' },
      { name: 'Écabossage', field: 'date_ecabossage' },
      { name: 'Fermentation', field: 'fermentation_debut' },
      { name: 'Séchage', field: 'sechage_debut' },
      { name: 'Transport', field: 'date_transport' },
      { name: 'Livraison', field: 'date_livraison' },
      { name: 'Paiement', field: 'date_paiement' },
    ];

    return stages.map(stage => ({
      etape: stage.name,
      count: operations.filter(op => op[stage.field]).length,
    }));
  };

  const calculateTopProducers = (operations: any[]) => {
    const producerMap = new Map<string, { count: number; poids: number }>();

    operations.forEach(op => {
      if (op.producteur?.nom_complet) {
        const name = op.producteur.nom_complet;
        if (!producerMap.has(name)) {
          producerMap.set(name, { count: 0, poids: 0 });
        }
        const stats = producerMap.get(name)!;
        stats.count++;
        stats.poids += op.manutention_pesee || 0;
      }
    });

    return Array.from(producerMap.entries())
      .map(([nom, stats]) => ({ nom, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const calculateTopAgents = (operations: any[]) => {
    const agentMap = new Map<string, number>();

    operations.forEach(op => {
      if (op.agent) {
        const name = `${op.agent.nom} ${op.agent.prenom}`;
        agentMap.set(name, (agentMap.get(name) || 0) + 1);
      }
    });

    return Array.from(agentMap.entries())
      .map(([nom, count]) => ({ nom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Erreur de chargement des statistiques</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Opérations</h1>
          <p className="text-muted-foreground mt-1">
            Statistiques et analyses des collectes
          </p>
        </div>

        {/* Sélecteur de période */}
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <TabsList>
            <TabsTrigger value="7d">7 jours</TabsTrigger>
            <TabsTrigger value="30d">30 jours</TabsTrigger>
            <TabsTrigger value="90d">90 jours</TabsTrigger>
            <TabsTrigger value="1y">1 an</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Opérations
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {stats.enCours} en cours
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.terminees} terminées
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Poids Total
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.poidsTotal.toFixed(1)} Kg</div>
            <p className="text-xs text-muted-foreground mt-2">
              Moyenne: {(stats.poidsTotal / (stats.total || 1)).toFixed(1)} Kg/op
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(stats.montantTotal / 1000).toFixed(0)}K FCFA
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Moyenne: {(stats.montantTotal / (stats.total || 1)).toLocaleString()} FCFA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Durée Moyenne
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.dureeMoyenne} jours</div>
            <p className="text-xs text-muted-foreground mt-2">
              De la récolte au paiement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opérations par jour */}
        <Card>
          <CardHeader>
            <CardTitle>Opérations par Jour</CardTitle>
            <CardDescription>Derniers 30 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.parJour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.primary}
                  fill={COLORS.primary}
                  fillOpacity={0.3}
                  name="Nombre"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Poids par jour */}
        <Card>
          <CardHeader>
            <CardTitle>Poids Collecté par Jour</CardTitle>
            <CardDescription>En kilogrammes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.parJour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="poids" fill={COLORS.success} name="Poids (Kg)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Évolution mensuelle */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution Mensuelle</CardTitle>
            <CardDescription>Nombre d'opérations par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.parMois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  name="Opérations"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par statut */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Statut</CardTitle>
            <CardDescription>Distribution des opérations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.parStatut}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ statut, pourcentage }) => `${statut} (${pourcentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.parStatut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Progression par étape */}
      <Card>
        <CardHeader>
          <CardTitle>Progression par Étape</CardTitle>
          <CardDescription>Nombre d'opérations ayant atteint chaque étape</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.parEtape} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="etape" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.info} name="Opérations" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top producteurs */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Producteurs</CardTitle>
            <CardDescription>Par nombre d'opérations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducteurs.map((prod, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{prod.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        {prod.poids.toFixed(1)} Kg total
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{prod.count} ops</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top agents */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Agents</CardTitle>
            <CardDescription>Par nombre de collectes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topAgents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-success">#{index + 1}</span>
                    </div>
                    <p className="font-medium">{agent.nom}</p>
                  </div>
                  <Badge variant="secondary">{agent.count} ops</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taux de Complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Terminées</span>
                <span className="font-medium">
                  {((stats.terminees / (stats.total || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                value={(stats.terminees / (stats.total || 1)) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taux d'Annulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Annulées</span>
                <span className="font-medium">
                  {((stats.annulees / (stats.total || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                value={(stats.annulees / (stats.total || 1)) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Opérations en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>En cours</span>
                <span className="font-medium">
                  {((stats.enCours / (stats.total || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                value={(stats.enCours / (stats.total || 1)) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
