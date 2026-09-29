import { api, setToken, clearToken, getToken } from "../../services/api";
import { loadStore, saveStore } from "./adminStore";

// Rôles du backend -> rôles utilisés par les permissions du back-office
const ROLE_LABELS = {
  admin: "Super administrateur",
  editor: "Administrateur éditorial",
  verifier: "Vérificateur",
  etablissement: "Établissement / institution",
};

/**
 * Connexion via l'API. Lance une erreur si les identifiants sont invalides.
 */
export async function login(email, password) {
  const data = await api.login({
    email: email.trim().toLowerCase(),
    password,
  });

  const session = {
    email: data.user.email,
    name: data.user.name,
    role: ROLE_LABELS[data.user.role] || ROLE_LABELS.etablissement,
    backendRole: data.user.role,
    loginAt: new Date().toISOString(),
  };

  setToken(data.token);
  saveStore({ ...loadStore(), session });
  return session;
}

export function getSession() {
  return getToken() ? loadStore().session || null : null;
}

export function logout() {
  clearToken();
  saveStore({ ...loadStore(), session: null });
}