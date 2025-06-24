import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import MainLayout from "@/components/MainLayout";
import PNL from "./pages/PNL";
import Activity from "./pages/Activity";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import React from 'react';
import AppContentLayout from "@/components/AppContentLayout";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import News from "./pages/News";
import Landing from "./pages/Landing";
import UserPage from "./pages/User";
import LiveMarketDashboard from "./pages/LiveMarket";

const queryClient = new QueryClient();

// Use React.lazy for code splitting
const FranchisePageLazy = React.lazy(() => import("./pages/Franchise"));

const authenticatedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/pnl", element: <PNL /> },
  { path: "/activity", element: <Activity /> },
  { path: "/news", element: <News /> },
  { path: "/live-market", element: <LiveMarketDashboard /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Authenticated routes */}
          {authenticatedRoutes.map((r) => (
              <Route
                key={r.path}
                path={r.path}
                element={
                  <AppContentLayout>
                    {r.element}
                  </AppContentLayout>
                }
              />
          ))}
          
          {/* Landing page route for "/" */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Landing />
              </MainLayout>
            }
          />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Page */}
          <Route
            path="/user"
            element={
              <MainLayout>
                <UserPage />
              </MainLayout>
            }
          />
          
          {/* All other routes: MainLayout (header/footer) */}
          <Route
            path="/index"
            element={
              <MainLayout>
                <Index />
              </MainLayout>
            }
          />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/about"
            element={
              <MainLayout>
                <About />
              </MainLayout>
            }
          />
          <Route
            path="/services"
            element={
              <MainLayout>
                <Services />
              </MainLayout>
            }
          />
          <Route
            path="/pricing"
            element={
              <MainLayout>
                <Pricing />
              </MainLayout>
            }
          />
          <Route
            path="/payment"
            element={
              <MainLayout>
                <Payment />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <Contact />
              </MainLayout>
            }
          />
          <Route
            path="/franchise"
            element={
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <FranchisePageLazy />
                </React.Suspense>
              </MainLayout>
            }
          />
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFound />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
