import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import VarmepelletsPage from "./pages/VarmepelletsPage";
import StroprodukterPage from "./pages/StroprodukterPage";
import CustomerServicePage from "./pages/CustomerServicePage";
import AboutPage from "./pages/AboutPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/produkter" element={<ProductsPage />} />
            <Route path="/produkt/:slug" element={<ProductDetailPage />} />
            <Route path="/varmepellets" element={<VarmepelletsPage />} />
            <Route path="/stroprodukter" element={<StroprodukterPage />} />
            <Route path="/kundtjanst" element={<CustomerServicePage />} />
            <Route path="/om-oss" element={<AboutPage />} />
            <Route path="/aterforsaljare" element={<AboutPage />} />
            <Route path="/offert" element={<CustomerServicePage />} />
            <Route path="/tack" element={<ThankYouPage />} />
            <Route path="/aktuellt" element={<AboutPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
