import { useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

// Custom hook
export function useHighlightId() {
  const [searchParams] = useSearchParams();
  return searchParams.get('highlight') || '';
}
export const useHighlightIdClear = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const clearHighlight = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('highlight');

    const newUrl = searchParams.toString() ? `${location.pathname}?${searchParams.toString()}` : location.pathname;

    navigate(newUrl, { replace: true });
  }, [navigate, location]);

  return clearHighlight;
};
