import { useQuery } from "@tanstack/react-query";

interface AuthStatus {
  authenticated: boolean;
}

export function useAuth() {
  const { data: authStatus, isLoading } = useQuery<AuthStatus>({
    queryKey: ['/api/auth/status'],
    retry: false,
  });

  return {
    isAuthenticated: authStatus?.authenticated || false,
    isLoading,
  };
}