import { useQuery } from '@tanstack/react-query';

interface PortfolioImages {
  fightingGame: string | null;
  caribbeanFood: string | null;
  jamaicaRestaurant: string | null;
  faithMinistry: string | null;
  powerOfLamb: string | null;
}

export function usePortfolioImages() {
  return useQuery<PortfolioImages>({
    queryKey: ['/api/images'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}