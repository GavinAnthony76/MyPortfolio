import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from "wouter";
import { useEffect, useLayoutEffect, useRef } from "react";
import { ClerkProvider, SignIn, useAuth, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
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
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import NotFound from "@/pages/not-found";
import AdminRoute from "@/components/admin-route";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#8b5cf6",
    colorForeground: "#ffffff",
    colorMutedForeground: "#cbd5e1",
    colorDanger: "#f87171",
    colorBackground: "#333333",
    colorInput: "#292929",
    colorInputForeground: "#ffffff",
    colorNeutral: "#64748b",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#333333] rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-white",
    headerSubtitle: "text-slate-300",
    socialButtonsBlockButtonText: "text-white",
    formFieldLabel: "text-slate-200",
    footerActionLink: "text-violet-300",
    footerActionText: "text-slate-300",
    dividerText: "text-slate-300",
    identityPreviewEditButton: "text-violet-300",
    formFieldSuccessText: "text-emerald-300",
    alertText: "text-red-200",
    logoBox: "h-12",
    logoImage: "max-h-12",
    socialButtonsBlockButton: "border-white/20 bg-white/10 hover:bg-white/20",
    formButtonPrimary: "bg-violet-600 hover:bg-violet-500 text-white",
    formFieldInput: "bg-[#292929] border-white/20 text-white",
    footerAction: "text-slate-300",
    dividerLine: "bg-white/20",
    alert: "bg-red-950/40 border-red-400/40",
    otpCodeFieldInput: "bg-[#292929] border-white/20 text-white",
    formFieldRow: "text-white",
    main: "bg-transparent",
  },
};

function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();

  // An existing authenticated session must go through the server-backed
  // admin gate, not Clerk's default already-signed-in redirect to Home.
  if (isLoaded && isSignedIn) return <Redirect to="/dashboard" />;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#292929] px-4">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        forceRedirectUrl={`${basePath}/dashboard`}
      />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const currentQueryClient = queryClient;
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        currentQueryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, currentQueryClient]);

  return null;
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
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?">
          <Redirect to="/sign-in" />
        </Route>
        <Route path="/login">
          <Redirect to="/sign-in" />
        </Route>
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/dashboard">
          <AdminRoute><Dashboard /></AdminRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signInForceRedirectUrl={`${basePath}/dashboard`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to access your dashboard",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <ClerkQueryClientCacheInvalidator />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
