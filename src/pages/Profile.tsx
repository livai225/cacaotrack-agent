import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";

export default function Profile() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
        <p className="text-muted-foreground mt-1">Informations agent terrain</p>
      </div>

      <div className="max-w-2xl space-y-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Informations Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Agent001</h3>
                <p className="text-sm text-muted-foreground">Code: AGT-2024-001</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Organisation</p>
                <p className="font-medium text-foreground">ASCO</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Section</p>
                <p className="font-medium text-foreground">Section 012</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Zone</p>
                <p className="font-medium text-foreground">Divo - Gagnoa</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière connexion</p>
                <p className="font-medium text-foreground">Aujourd'hui, 08:23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">156</div>
                <p className="text-sm text-muted-foreground mt-1">Producteurs</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">234</div>
                <p className="text-sm text-muted-foreground mt-1">Plantations</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">89</div>
                <p className="text-sm text-muted-foreground mt-1">Opérations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full gap-2">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
