import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";
import CustomerDetails from "@/components/CustomerDetails";
import AddCustomer from "@/components/AddCustomer";
import AddLoan from "@/components/AddLoan";
import AddRepayment from "@/components/AddRepayment";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
              <Route path="/customer/:id" element={<ProtectedRoute><AppLayout><CustomerDetails /></AppLayout></ProtectedRoute>} />
              <Route path="/add-customer" element={<ProtectedRoute><AppLayout><AddCustomer /></AppLayout></ProtectedRoute>} />
              <Route path="/add-loan" element={<ProtectedRoute><AppLayout><AddLoan /></AppLayout></ProtectedRoute>} />
              <Route path="/add-repayment" element={<ProtectedRoute><AppLayout><AddRepayment /></AppLayout></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
