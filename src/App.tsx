import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Organisations from "./pages/Organisations";
import Villages from "./pages/Villages";
import Sections from "./pages/Sections";
import Producteurs from "./pages/Producteurs";
import Plantations from "./pages/Plantations";
import Operations from "./pages/Operations";
import Sync from "./pages/Sync";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CarteSuivi from "./pages/CarteSuivi";
import OrganisationForm from "./pages/OrganisationForm";
import OrganisationMembres from "./pages/OrganisationMembres";
import ProducteurForm from "./pages/ProducteurForm";
import VillageForm from "./pages/VillageForm";
import SectionForm from "./pages/SectionForm";
import PlantationForm from "./pages/PlantationForm";
import FarmBusinessPlan from "./pages/FarmBusinessPlan";
import PlantationMap from "./pages/PlantationMap";
import OperationForm from "./pages/OperationForm";
import ProducteurDetails from "./pages/ProducteurDetails";
import PlantationDetails from "./pages/PlantationDetails";
import OperationDetails from "./pages/OperationDetails";
import VillageDetails from "./pages/VillageDetails";
import SectionDetails from "./pages/SectionDetails"; // Import ajouté
import OrganisationDetails from "./pages/OrganisationDetails"; // Import ajouté
import Agents from "./pages/Agents";
import AgentForm from "./pages/AgentForm";
import AgentDashboard from "./pages/AgentDashboard";
import Storage from "./utils/storage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    Storage.initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/organisations" element={<Organisations />} />
              <Route path="/organisations/nouveau" element={<OrganisationForm />} />
              <Route path="/organisations/:id" element={<OrganisationDetails />} /> {/* Route Détails */}
              <Route path="/organisations/:id/edit" element={<OrganisationForm />} /> {/* Route Edition */}
              <Route path="/organisations/:orgId/membres" element={<OrganisationMembres />} />
              <Route path="/sections" element={<Sections />} />
              <Route path="/sections/nouveau" element={<SectionForm />} />
              <Route path="/sections/:id" element={<SectionDetails />} /> {/* Route Détails */}
              <Route path="/sections/:id/edit" element={<SectionForm />} /> {/* Route Edition */}
              <Route path="/villages" element={<Villages />} />
              <Route path="/villages/nouveau" element={<VillageForm />} />
              <Route path="/villages/:id" element={<VillageDetails />} /> {/* Route Détails */}
              <Route path="/villages/:id/edit" element={<VillageForm />} /> {/* Route Edition */}
              <Route path="/producteurs" element={<Producteurs />} />
              <Route path="/producteurs/nouveau" element={<ProducteurForm />} />
              <Route path="/producteurs/:id" element={<ProducteurDetails />} /> {/* Route Détails */}
              <Route path="/producteurs/:id/edit" element={<ProducteurForm />} /> {/* Route Edition */}
              <Route path="/plantations" element={<Plantations />} />
              <Route path="/plantations/nouveau" element={<PlantationForm />} />
              <Route path="/plantations/business-plan" element={<FarmBusinessPlan />} />
              <Route path="/plantations/carte" element={<PlantationMap />} />
              <Route path="/plantations/:id" element={<PlantationDetails />} /> {/* Route Détails */}
              <Route path="/plantations/:id/edit" element={<PlantationForm />} /> {/* Route Edition */}
              <Route path="/operations" element={<Operations />} />
              <Route path="/operations/nouveau" element={<OperationForm />} />
              <Route path="/operations/:id" element={<OperationDetails />} /> {/* Route Détails */}
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/nouveau" element={<AgentForm />} />
              <Route path="/agents/:id" element={<AgentForm />} />
              <Route path="/agents/dashboard" element={<AgentDashboard />} />
              <Route path="/carte" element={<CarteSuivi />} />
              <Route path="/sync" element={<Sync />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
