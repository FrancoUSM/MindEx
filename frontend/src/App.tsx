import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Index from "./pages/Index";
import CheckinPage from "./pages/CheckinPage";
import EvaluationsPage from "./pages/EvaluationsPage";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import HistoryPage from "./pages/HistoryPage";
//import ProfessionalsPage from "./pages/ProfessionalsPage";
import NotFound from "./pages/NotFound";
import B2BOnboardingPage from "./pages/B2BOnboardingPage";
import { useEffect } from "react";
import AdministradorPage from "./pages/AdministradorPage";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const App = () => {

  return (


  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/*<Route path="/professionals" element={<ProfessionalsPage />} />*/}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkin" element={
            <ProtectedRoute requiredRole="USER">
              <AppLayout>
                <CheckinPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/evaluations" element={
            <ProtectedRoute requiredRole="USER">
              <AppLayout>
                <EvaluationsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute requiredRole="USER">
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute requiredRole="USER">
              <AppLayout>
                <HistoryPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/empresa" element={<B2BOnboardingPage />} />
          
          {/* Role-based protected routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdministradorPage />
            </ProtectedRoute>
          } />

          <Route path="/administrativo" element={
            <ProtectedRoute requiredRole="ADMINISTRATIVO">
              <AdminPage />
            </ProtectedRoute>
          } />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

}
export default App;
