
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import SettingsPage from "./pages/settings/Settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuthSync } from "./hooks/useAuthSync";

// These will be created as stub components for now
const Lobby = () => <div className="p-8"><h1 className="h1 mb-4">Lobby</h1><p>Coming soon</p></div>;
const Tournament = () => <div className="p-8"><h1 className="h1 mb-4">Tournament</h1><p>Coming soon</p></div>;
const Table = () => <div className="p-8"><h1 className="h1 mb-4">Table</h1><p>Coming soon</p></div>;
const Funds = () => <div className="p-8"><h1 className="h1 mb-4">Funds</h1><p>Coming soon</p></div>;
const VIP = () => <div className="p-8"><h1 className="h1 mb-4">VIP</h1><p>Coming soon</p></div>;
const Affiliate = () => <div className="p-8"><h1 className="h1 mb-4">Affiliate</h1><p>Coming soon</p></div>;
const HallOfFame = () => <div className="p-8"><h1 className="h1 mb-4">Hall of Fame</h1><p>Coming soon</p></div>;

const queryClient = new QueryClient();

// Wrap the app with auth sync
const AppWithAuth = () => {
  useAuthSync();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/lobby" element={<ProtectedRoute><Lobby /></ProtectedRoute>} />
        <Route path="/tournament" element={<ProtectedRoute><Tournament /></ProtectedRoute>} />
        <Route path="/tournament/:id" element={<ProtectedRoute><Tournament /></ProtectedRoute>} />
        <Route path="/table/:id" element={<ProtectedRoute><Table /></ProtectedRoute>} />
        <Route path="/funds" element={<ProtectedRoute><Funds /></ProtectedRoute>} />
        <Route path="/vip" element={<ProtectedRoute><VIP /></ProtectedRoute>} />
        <Route path="/affiliate" element={<ProtectedRoute><Affiliate /></ProtectedRoute>} />
        <Route path="/hof" element={<ProtectedRoute><HallOfFame /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppWithAuth />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
