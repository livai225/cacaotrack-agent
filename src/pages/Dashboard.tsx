import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, CheckCircle2, Award } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Enquêtes Aujourd'hui",
      value: "23",
      change: "+12%",
      icon: Clock,
      trend: "up",
    },
    {
      title: "En Attente Validation",
      value: "47",
      icon: Clock,
      color: "warning",
    },
    {
      title: "Taux Validation",
      value: "87%",
      icon: CheckCircle2,
      color: "success",
    },
    {
      title: "Loyauté Moyenne",
      value: "73%",
      icon: Award,
      badge: "Bon",
    },
  ];

  const modules = [
    { name: "Producteurs", count: 1247, total: 1650, percentage: 75 },
    { name: "Plantations", count: 2134, total: 2500, percentage: 85 },
    { name: "Opérations Collecte", count: 456, total: 800, percentage: 57 },
  ];

  const activities = [
    { action: "Nouveau producteur ajouté", name: "Kouassi Jean", time: "Il y a 5 min", status: "success" },
    { action: "Plantation mise à jour", name: "PROD-0234-P1", time: "Il y a 12 min", status: "info" },
    { action: "Opération en attente", name: "OP-2024-0456", time: "Il y a 23 min", status: "warning" },
    { action: "Producteur validé", name: "Koné Marie", time: "Il y a 1h", status: "success" },
    { action: "Synchronisation réussie", name: "67 éléments", time: "Il y a 2h", status: "success" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de votre activité terrain</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn(
                "h-5 w-5",
                stat.color === "warning" && "text-warning",
                stat.color === "success" && "text-success",
                !stat.color && "text-primary"
              )} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              {stat.change && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">{stat.change}</span>
                  <span className="text-sm text-muted-foreground">vs hier</span>
                </div>
              )}
              {stat.badge && (
                <Badge variant="outline" className="mt-2 border-success text-success">
                  {stat.badge}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Progress */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Progression Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {modules.map((module, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{module.name}</span>
                  <span className="text-muted-foreground">
                    {module.count} / {module.total}
                  </span>
                </div>
                <Progress value={module.percentage} className="h-2" />
                <div className="text-right text-xs text-muted-foreground">
                  {module.percentage}% complété
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 shrink-0",
                    activity.status === "success" && "bg-success",
                    activity.status === "warning" && "bg-warning",
                    activity.status === "info" && "bg-primary"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.name}</p>
                    <p className="text-xs text-muted-foreground/70">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
