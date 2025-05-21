
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// These will be created as stub components for now
const Lobby = () => <div className="p-8"><h1 className="h1 mb-4">Lobby</h1><p>Coming soon</p></div>;
const Tournament = () => <div className="p-8"><h1 className="h1 mb-4">Tournament</h1><p>Coming soon</p></div>;
const Table = () => <div className="p-8"><h1 className="h1 mb-4">Table</h1><p>Coming soon</p></div>;
const Funds = () => <div className="p-8"><h1 className="h1 mb-4">Funds</h1><p>Coming soon</p></div>;
const VIP = () => <div className="p-8"><h1 className="h1 mb-4">VIP</h1><p>Coming soon</p></div>;
const Affiliate = () => <div className="p-8"><h1 className="h1 mb-4">Affiliate</h1><p>Coming soon</p></div>;
const HallOfFame = () => <div className="p-8"><h1 className="h1 mb-4">Hall of Fame</h1><p>Coming soon</p></div>;
const Settings = () => <div className="p-8"><h1 className="h1 mb-4">Settings</h1><p>Coming soon</p></div>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/tournament/:id" element={<Tournament />} />
          <Route path="/table/:id" element={<Table />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/vip" element={<VIP />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/hof" element={<HallOfFame />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
