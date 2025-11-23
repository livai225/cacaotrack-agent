import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, Banknote, Sprout, Tractor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Données simulées par défaut
const defaultData = {
  surface: 5.5, // Ha
  production: 4.2, // Tonnes
  prixCacao: 1500, // FCFA/Kg (Prix bord champ actuel approximatif)
  coutEngrais: 250000,
  coutPhyto: 180000,
  coutMainDoeuvre: 450000,
  coutTransport: 85000,
  amortissement: 120000,
};

export default function FarmBusinessPlan() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(defaultData);

  // Calculs
  const revenuBrut = inputs.production * 1000 * inputs.prixCacao;
  const totalCoutsVariables = inputs.coutEngrais + inputs.coutPhyto + inputs.coutMainDoeuvre + inputs.coutTransport;
  const margeBrute = revenuBrut - totalCoutsVariables;
  const totalCouts = totalCoutsVariables + inputs.amortissement;
  const resultatNet = revenuBrut - totalCouts;
  const rentabilite = (resultatNet / revenuBrut) * 100;

  // Données Graphiques
  const dataWaterfall = [
    { name: 'Revenu Brut', montant: revenuBrut, fill: '#10b981' },
    { name: 'Intrants', montant: inputs.coutEngrais + inputs.coutPhyto, fill: '#f59e0b' },
    { name: 'Main d\'oeuvre', montant: inputs.coutMainDoeuvre, fill: '#ef4444' },
    { name: 'Transport', montant: inputs.coutTransport, fill: '#6366f1' },
    { name: 'Marge Nette', montant: resultatNet, fill: '#3b82f6' },
  ];

  const dataPie = [
    { name: 'Engrais', value: inputs.coutEngrais },
    { name: 'Phytosanitaire', value: inputs.coutPhyto },
    { name: 'Main d\'oeuvre', value: inputs.coutMainDoeuvre },
    { name: 'Transport', value: inputs.coutTransport },
    { name: 'Amortissement', value: inputs.amortissement },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Projection sur 5 ans (Simulation croissance 5% par an)
  const projectionData = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    const growth = 1 + (i * 0.05);
    return {
      year: year.toString(),
      Revenus: Math.round(revenuBrut * growth),
      Couts: Math.round(totalCouts * (1 + (i * 0.02))), // Coûts augmentent moins vite
      Resultat: Math.round((revenuBrut * growth) - (totalCouts * (1 + (i * 0.02)))),
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/parcelles")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Farm Business Plan
          </h1>
          <p className="text-muted-foreground">Analyse de rentabilité et projections financières</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne Gauche : Paramètres */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Paramètres d'Exploitation</CardTitle>
            <CardDescription>Ajustez les valeurs pour simuler</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Surface (Ha)</Label>
              <div className="relative">
                <Sprout className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input name="surface" value={inputs.surface} onChange={handleInputChange} className="pl-8" type="number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Production Annuelle (Tonnes)</Label>
              <Input name="production" value={inputs.production} onChange={handleInputChange} type="number" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label>Prix Bord Champ (FCFA/Kg)</Label>
              <div className="relative">
                <Banknote className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input name="prixCacao" value={inputs.prixCacao} onChange={handleInputChange} className="pl-8" type="number" />
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Charges Annuelles (FCFA)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Engrais</Label>
                  <Input name="coutEngrais" value={inputs.coutEngrais} onChange={handleInputChange} type="number" />
                </div>
                <div>
                  <Label className="text-xs">Phytosanitaire</Label>
                  <Input name="coutPhyto" value={inputs.coutPhyto} onChange={handleInputChange} type="number" />
                </div>
                <div>
                  <Label className="text-xs">Main d'oeuvre</Label>
                  <Input name="coutMainDoeuvre" value={inputs.coutMainDoeuvre} onChange={handleInputChange} type="number" />
                </div>
                <div>
                  <Label className="text-xs">Transport</Label>
                  <Input name="coutTransport" value={inputs.coutTransport} onChange={handleInputChange} type="number" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Amortissement Matériel</Label>
                  <Input name="amortissement" value={inputs.amortissement} onChange={handleInputChange} type="number" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colonne Droite : Résultats et Graphiques */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-primary/80">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold text-primary">{revenuBrut.toLocaleString()} FCFA</p>
              </CardContent>
            </Card>
            <Card className={`${rentabilite > 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-foreground/80">Résultat Net</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${rentabilite > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {resultatNet.toLocaleString()} FCFA
                  </p>
                  {rentabilite > 0 ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Rentabilité</p>
                <p className="text-2xl font-bold text-foreground">{rentabilite.toFixed(1)}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Onglets Analytiques */}
          <Tabs defaultValue="analyse" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyse">Analyse des Coûts</TabsTrigger>
              <TabsTrigger value="projection">Projections 5 Ans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analyse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Structure des Revenus</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataWaterfall}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 10}} />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                        <Bar dataKey="montant" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Répartition des Charges</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dataPie}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dataPie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projection">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Évolution Projetée (Scénario Croissance +5%/an)</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                      <Legend />
                      <Line type="monotone" dataKey="Revenus" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="Couts" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="Resultat" stroke="#3b82f6" strokeWidth={3} dot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
