// Authentification de démonstration de l'espace admin.
// Reprend telle quelle la logique de l'ancien backoffice/BackofficeRoute.jsx.
import { loadStore, saveStore } from "./adminStore";

export const DEMO_ACCOUNTS = {
  "admin@ancps.sn": { password: "admin", name: "Super Admin", role: "Super administrateur" },
  "editor@ancps.sn": { password: "editor", name: "Équipe éditoriale", role: "Administrateur éditorial" },
  "verif@ancps.sn": { password: "verif", name: "Équipe qualité", role: "Vérificateur" },
  "etablissement@ancps.sn": { password: "demo", name: "Établissement démo", role: "Établissement / institution" },
};

/**
 * Vérifie les identifiants et ouvre une session admin si valides.
 * Retourne la session créée, ou null si les identifiants sont invalides.
 */
export function login(email, password) {
  const account = DEMO_ACCOUNTS[email.trim().toLowerCase()];

  if (!account || account.password !== password) {
    return null;
  }

  const session = {
    email: email.trim().toLowerCase(),
    name: account.name,
    role: account.role,
    loginAt: new Date().toISOString(),
  };

  saveStore({ ...loadStore(), session });
  return session;
}

export function getSession() {
  return loadStore().session || null;
}

export function logout() {
  saveStore({ ...loadStore(), session: null });
}
