import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Solutions from "./pages/Solutions";
import Contact from "./pages/Contact";
import Articles from "./pages/Articles";
import Resources from "./pages/Resources";
import CircularEconomy from "./pages/CircularEconomy";
import ESGDataAnalytics from "./pages/ESGDataAnalytics"; 
import ReportingCompliance from "./pages/ReportingCompliance"; 
import ConsultingTraining from "./pages/ConsultingTraining";
import WasteManagement from "./pages/WasteManagement";
import WasteAuditing from "./pages/WasteAuditing";
import ArticleDetail from "./pages/ArticleDetail";
import CarbonCalculator from "./pages/CarbonCalculator";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/solutions"} component={Solutions} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/articles"} component={Articles} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/404"} component={NotFound} />
      <Route path="/solutions/circular-economy" component={CircularEconomy} />
      <Route path="/solutions/esg-data-analytics" component={ESGDataAnalytics} />
      <Route path="/solutions/reporting" component={ReportingCompliance} />
      <Route path="/solutions/consulting" component={ConsultingTraining} />
      <Route path="/solutions/waste-management" component={WasteManagement} />
      <Route path="/solutions/waste-auditing" component={WasteAuditing} />
      <Route path="/articles/:id" component={ArticleDetail} />
      <Route path="/carbon-calculator" component={CarbonCalculator} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
