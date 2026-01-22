import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Billing from "./pages/Billing";
import Vendors from "./pages/Vendors";
import Production from "./pages/Production";
import Reports from "./pages/Reports";
import DTDCBilling from "./pages/DTDCBilling";
import SareeDyeing from "./pages/SareeDyeing";
import SareePrinting from "./pages/SareePrinting";
import StaffSalaries from "./pages/StaffSalaries";
import ReturnsExchange from "./pages/ReturnsExchange";
import WhatsAppOrders from "./pages/WhatsAppOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<Customers />} />
            <Route path="billing" element={<Billing />} />
            <Route path="dtdc" element={<DTDCBilling />} />
            <Route path="whatsapp-orders" element={<WhatsAppOrders />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="production" element={<Production />} />
            <Route path="saree-dyeing" element={<SareeDyeing />} />
            <Route path="saree-printing" element={<SareePrinting />} />
            <Route path="salaries" element={<StaffSalaries />} />
            <Route path="returns" element={<ReturnsExchange />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
