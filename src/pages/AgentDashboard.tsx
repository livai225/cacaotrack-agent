import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Users, TrendingUp, Package, MapPin, Calendar, 
  Loader2, Download, Filter 
} from "lucide-react";
import { agentService } from "@/services/agentService";
import type { Agent, AgentStats } from "@/types/agent";
import { api } from "@/services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [operations, setOperations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"mois" | "semaine" | "jour">("mois");

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (selectedAgentId) {
      loadAgentData();
    }
  }, [selectedAgentId, period]);

  const loadAgents = async () => {
    try {
      const data = await agentService.getAgents();
      setAgents(data.filter(a => a.statut === 'actif'));
      if (data.length > 0 && !selectedAgentId) {
        setSelectedAgentId(data[0].id);
      }
    } catch (error) {
      console.error("Erreur chargement agents:", error);
    }
  };

  const loadAgentData = async () => {
    try {
      setIsLoading(true);
      const [statsData, opsData] = await Promise.all([
        agentService.getAgentStats(selectedAgentId),
        api.getOperations()
      ]);
      
      setStats(statsData);
      
      // Filtrer les opérations de l'agent
      const agentOps = opsData.filter((op: any) => op.id_agent === selectedAgentId);
      setOperations(agentOps);
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  // Préparer les données pour les graphiques
  const prepareChartData = () => {
    if (!operations.length) return [];

    const now = new Date();
    let groupBy: (op: any) => string;

    switch (period) {
      case "jour":
        groupBy = (op) => new Date(op.createdAt).toLocaleDateString('fr-FR');
        break;
      case "semaine":
        groupBy = (op) => {
          const date = new Date(op.createdAt);
          const week = Math.ceil(date.getDate() / 7);
          return `Sem ${week} - ${date.toLocaleDateString('fr-FR', { month: 'short' })}`;
        };
        break;
      default: // mois
        groupBy = (op) => new Date(op.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    }

    const grouped = operations.reduce((acc: any, op: any) => {
      const key = groupBy(op);
      if (!acc[key]) {
        acc[key] = { period: key, count: 0, poids: 0 };
      }
      acc[key].count += 1;
      acc[key].poids += op.manutention_pesee || 0;
      return acc;
    }, {});

    return Object.values(grouped).sort((a: any, b: any) => 
      new Date(a.period).getTime() - new Date(b.period).getTime()
    );
  };

  const chartData = prepareChartData();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Agents</h1>
          <p className="text-muted-foreground mt-1">Suivi des collectes par agent</p>
        </div>
        <div className="flex gap-4">
          <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jour">Par Jour</SelectItem>
              <SelectItem value="semaine">Par Semaine</SelectItem>
              <SelectItem value="mois">Par Mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sélection Agent */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label className="font-semibold">Agent :</Label>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Sélectionner un agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.nom} {agent.prenom} ({agent.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAgent && (
              <div className="flex gap-2 ml-auto">
                {selectedAgent.regions && selectedAgent.regions.length > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedAgent.regions.map((ar: any) => ar.region?.nom).filter(Boolean).join(', ')}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : stats ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Opérations</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.nb_operations}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.nb_operations_mois} ce mois
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Poids Total</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {(stats.poids_total / 1000).toFixed(1)} T
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(stats.poids_mois / 1000).toFixed(1)} T ce mois
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Régions</p>
                    <h3 className="text-3xl font-bold mt-2">{stats.regions.length}</h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {stats.regions.join(', ')}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dernière Opération</p>
                    <h3 className="text-lg font-bold mt-2">
                      {stats.dernier_operation
                        ? new Date(stats.dernier_operation).toLocaleDateString('fr-FR')
                        : 'Aucune'}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.dernier_operation
                        ? new Date(stats.dernier_operation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du Nombre d'Opérations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Nombre d'opérations" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution du Poids Collecté (Kg)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="poids" stroke="#10b981" strokeWidth={2} name="Poids (Kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Liste des opérations récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Opérations Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {operations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune opération enregistrée pour cet agent
                </p>
              ) : (
                <div className="space-y-2">
                  {operations
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10)
                    .map((op: any) => (
                      <div
                        key={op.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">
                            {op.producteur?.nom_complet || 'Producteur inconnu'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(op.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {op.manutention_pesee ? `${op.manutention_pesee} Kg` : 'N/A'}
                          </p>
                          <Badge variant={op.statut === 'Payé' ? 'default' : 'secondary'}>
                            {op.statut}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Sélectionnez un agent pour voir ses statistiques
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

