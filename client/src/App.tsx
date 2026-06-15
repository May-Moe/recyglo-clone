import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import '@/lib/i18n'

// --- PUBLIC PAGES ---
import Home from "./pages/Home";
import About from "./pages/About";
import Solutions from "./pages/Solutions";
import Contact from "./pages/Contact";
import Articles from "./pages/Articles";
import Resources from "./pages/Resources";
import ArticleDetail from "./pages/ArticleDetail";
import CarbonCalculator from "./pages/CarbonCalculator";
import ServiceDetail from "./pages/ServiceDetail"; // THE NEW DYNAMIC TEMPLATE
import Impact from "./pages/Impact";

// --- ADMIN PAGES ---
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout"; 
import DashboardHome from "./pages/admin/DashboardHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminHome from "./pages/admin/AdminHome";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminContact from "./pages/admin/AdminContact";
import AdminResources from "./pages/admin/AdminResources";
import AdminSolutions from "./pages/admin/AdminSolutions";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminSubscribers from '@/pages/admin/AdminSubscribers';

function Router() {
  return (
    <Switch>
      {/* PUBLIC ROUTES */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/contact" component={Contact} />
      <Route path="/articles" component={Articles} />
      <Route path="/resources" component={Resources} />
      <Route path="/404" component={NotFound} />
      <Route path="/articles/:slug" component={ArticleDetail} />
      <Route path="/carbon-calculator" component={CarbonCalculator} />
      <Route path="/impact" component={Impact} />
      
      {/* THE ONLY SOLUTIONS ROUTE YOU NEED NOW */}
      <Route path="/solutions/:slug" component={ServiceDetail} />
      
      {/* ADMIN ROUTES */}
      <Route path="/login" component={Login} />

      <Route path="/admin/dashboard">
        <AdminLayout>
          <DashboardHome />
        </AdminLayout>
      </Route>

      <Route path="/admin/users">
        <AdminLayout>
          <AdminUsers />
        </AdminLayout>
      </Route>

      <Route path="/admin/pages/home">
        <AdminLayout>
          <AdminHome />
        </AdminLayout>
      </Route>

      <Route path="/admin/pages/about">
        <AdminLayout>
          <AdminAbout />
        </AdminLayout>
      </Route>

      <Route path="/admin/pages/contact">
        <AdminLayout>
          <AdminContact />
        </AdminLayout>
      </Route>

      <Route path="/admin/pages/resources">
        <AdminLayout>
          <AdminResources />
        </AdminLayout>
      </Route>

      <Route path="/admin/solutions">
        <AdminLayout>
          <AdminSolutions />
        </AdminLayout>
      </Route>

      <Route path="/admin/articles"><AdminLayout><AdminArticles /></AdminLayout></Route>

      <Route path="/admin/media">
        <AdminLayout>
          <AdminMedia />
        </AdminLayout>
      </Route>

      <Route path="/admin/inquiries"><AdminLayout><AdminInquiries /></AdminLayout></Route>

      <Route path="/admin/subscribers">
          <AdminLayout>
            <AdminSubscribers />
          </AdminLayout>
        </Route>

      
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;