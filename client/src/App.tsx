import { Switch, Route, useLocation } from "wouter";
import { useLayoutEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Works from "@/pages/works";
import WorkDetail from "@/pages/work-detail";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <p className="text-sm text-white/75 tracking-[0.15em] uppercase">Loading</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Component />;
}

function Router() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div key={location} className="page-enter">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/works" component={Works} />
        <Route path="/works/:id" component={WorkDetail} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/dashboard">
          <ProtectedRoute component={Dashboard} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
