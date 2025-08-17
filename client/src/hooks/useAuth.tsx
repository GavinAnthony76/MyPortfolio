import { useQuery } from "@tanstack/react-query";

interface AuthStatus {
  authenticated: boolean;
}

export function useAuth() {
  const { data: authStatus, isLoading, error } = useQuery<AuthStatus>({
    queryKey: ['/api/auth/status'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    isAuthenticated: authStatus?.authenticated || false,
    isLoading,
    error,
  };
}