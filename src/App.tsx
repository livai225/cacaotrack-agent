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
import OrganisationForm from "./pages/OrganisationForm";
import ProducteurForm from "./pages/ProducteurForm";
import VillageForm from "./pages/VillageForm";
import SectionForm from "./pages/SectionForm";
import PlantationForm from "./pages/PlantationForm";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/sections" element={<Sections />} />
            <Route path="/sections/nouveau" element={<SectionForm />} />
            <Route path="/villages" element={<Villages />} />
            <Route path="/villages/nouveau" element={<VillageForm />} />
            <Route path="/producteurs" element={<Producteurs />} />
            <Route path="/producteurs/nouveau" element={<ProducteurForm />} />
            <Route path="/plantations" element={<Plantations />} />
            <Route path="/plantations/nouveau" element={<PlantationForm />} />
            <Route path="/operations" element={<Operations />} />
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

export default App;
