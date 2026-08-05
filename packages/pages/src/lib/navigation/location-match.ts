import { resolvePath } from 'react-router-dom';

export interface MatchableLocation {
  readonly pathname: string;
  readonly search: string;
}

export const resolvesToCurrentLocation = (to: string, location: MatchableLocation): boolean => {
  const target = resolvePath(to, location.pathname);
  return target.pathname === location.pathname && target.search === location.search;
};
