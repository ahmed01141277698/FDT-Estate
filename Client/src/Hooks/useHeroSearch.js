import { useCallback, useState } from "react";

/**
 * Local UI state for the Hero's single Smart Search.
 * Kept intentionally decoupled from Redux — the Hero should be able to
 * live-preview a city selection (map focus) before a real search fires.
 * Wire `onSearch` to your existing Search API / router when ready.
 *
 * @param {(query: object) => void} [onSearch]
 */
export function useHeroSearch(onSearch) {
  const [mode, setMode] = useState("buy"); // 'buy' | 'rent'
  const [cityId, setCityId] = useState(null);
  const [propertyTypeId, setPropertyTypeId] = useState(null);
  const [budgetId, setBudgetId] = useState(null);

  const reset = useCallback(() => {
    setCityId(null);
    setPropertyTypeId(null);
    setBudgetId(null);
  }, []);

  const submit = useCallback(() => {
    const query = { mode, cityId, propertyTypeId, budgetId };
    onSearch?.(query);
    return query;
  }, [mode, cityId, propertyTypeId, budgetId, onSearch]);

  return {
    mode,
    setMode,
    cityId,
    setCityId,
    propertyTypeId,
    setPropertyTypeId,
    budgetId,
    setBudgetId,
    reset,
    submit,
  };
}