import { useQuery } from "@tanstack/react-query";

interface AuthStatus {
  authenticated: boolean;
}

export function useAuth() {
  const { data: authStatus, isLoading, error } = useQuery<AuthStatus>({
    queryKey: ['/api/auth/status'],
    retry: false,
    staleTime: 0, // Always fresh for auth checks
    gcTime: 0, // Don't cache auth status
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    isAuthenticated: authStatus?.authenticated || false,
    isLoading,
    error,
  };
}