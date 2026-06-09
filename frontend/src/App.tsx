import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
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
            <AppLayout>
              <CheckinPage />
            </AppLayout>
          } />
          <Route path="/evaluations" element={
            <AppLayout>
              <EvaluationsPage />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          } />
          <Route path="/history" element={
            <AppLayout>
              <HistoryPage />
            </AppLayout>
          } />
          <Route path="/empresa" element={<B2BOnboardingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

}
export default App;
