import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Building2, MapPin, Layers, Users, Trees, ClipboardList, RefreshCw, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Organisations", href: "/organisations", icon: Building2 },
  { name: "Villages", href: "/villages", icon: MapPin },
  { name: "Sections", href: "/sections", icon: Layers },
  { name: "Producteurs", href: "/producteurs", icon: Users },
  { name: "Plantations", href: "/plantations", icon: Trees },
  { name: "Opérations", href: "/operations", icon: ClipboardList },
  { name: "Synchronisation", href: "/sync", icon: RefreshCw },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">ASCO CacaoTrack</h1>
          <p className="text-xs text-sidebar-foreground/70 mt-1">Collecte Données Terrain</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all"
          >
            <User className="h-5 w-5" />
            <span>Mon Profil</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
