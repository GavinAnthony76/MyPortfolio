import { useQuery } from "@tanstack/react-query";

interface AuthStatus {
  authenticated: boolean;
}

export function useAuth() {
  const { data: authStatus, isLoading, error } = useQuery<AuthStatus>({
    queryKey: ['/api/auth/status'],
    retry: 1,
    staleTime: 0, // Always fresh for auth checks
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: false, // Don't auto-refetch
  });

  // Debug logging for authentication
  if (typeof window !== 'undefined') {
    console.log('Auth status:', { authStatus, isLoading, error });
  }

  return {
    isAuthenticated: Boolean(authStatus?.authenticated),
    isLoading,
    error,
  };
}