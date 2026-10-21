import { useState, type ReactNode } from "react";
import { useAuth, useClerk } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { Link, Redirect } from "wouter";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { signOut } = useClerk();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const access = useQuery({
    queryKey: ["/api/admin/access", userId],
    enabled: isLoaded && !!isSignedIn,
    staleTime: 0,
    retry: false,
    queryFn: async () => {
      const response = await fetch("/api/admin/access", {
        credentials: "include",
        cache: "no-store",
      });
      if (response.status === 403) return "denied" as const;
      if (response.status === 401) return "expired" as const;
      if (!response.ok) throw new Error("Unable to verify dashboard access");
      const body = await response.json();
      if (body.authorized !== true) throw new Error("Invalid access response");
      return "allowed" as const;
    },
  });

  if (isLoaded && !isSignedIn) return <Redirect to="/sign-in" />;
  if (!isLoaded || access.isPending) {
    return (
      <div className="min-h-screen bg-[#292929] flex items-center justify-center text-white/90">
        <p role="status">Checking dashboard access…</p>
      </div>
    );
  }
  if (access.data === "allowed") return <>{children}</>;

  const denied = access.data === "denied";
  const expired = access.data === "expired";
  return (
    <div className="min-h-screen bg-[#292929] text-white">
      <Navigation />
      <main className="max-w-xl mx-auto px-6 pt-36 pb-16">
        <h1 className="text-3xl mb-6">
          {denied ? "Administrator access only" : expired ? "Session expired" : "Unable to check access"}
        </h1>
        <p className="text-white/90 leading-relaxed mb-8" role="alert">
          {denied
            ? "This Google or email account is not authorized to use the admin dashboard. You can still browse the portfolio, or sign out to use a different account."
            : expired
              ? "Your session could not be verified. Sign out and sign in again, or return to the portfolio."
              : "Dashboard access could not be verified right now. You can retry or return to the portfolio."}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="inline-flex items-center px-4 py-2 rounded-md bg-white text-black text-sm font-medium" data-testid="access-return-home">
            Return to home
          </Link>
          {access.isError && (
            <Button onClick={() => access.refetch()} disabled={access.isFetching}>
              {access.isFetching ? "Checking…" : "Retry"}
            </Button>
          )}
          <Button
            variant="outline"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              setSignOutError(false);
              try {
                await signOut({ redirectUrl: "/" });
              } catch {
                setSignOutError(true);
              } finally {
                setSigningOut(false);
              }
            }}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
        {signOutError && <p className="mt-4 text-white/90" role="alert">Sign-out failed. Please retry, or use Return to home to browse the portfolio.</p>}
      </main>
    </div>
  );
}
