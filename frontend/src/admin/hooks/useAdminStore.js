import { useState, useCallback } from "react";
import { loadStore, saveStore } from "../services/adminStore";

/**
 * Charge le store de démonstration et fournit un moyen de le
 * sauvegarder / rafraîchir. Centralise le pattern répété sur
 * (presque) toutes les pages admin :
 *   const [store, setStore] = useState(loadStore());
 *   const refresh = () => setStore(loadStore());
 */
export function useAdminStore() {
  const [store, setStore] = useState(() => loadStore() || {});

  const refresh = useCallback(() => {
    setStore(loadStore() || {});
  }, []);

  const update = useCallback((next) => {
    saveStore(next);
    setStore(next);
  }, []);

  return { store, setStore, refresh, update };
}
