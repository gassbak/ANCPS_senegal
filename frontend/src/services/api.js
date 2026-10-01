const API_URL = import.meta.env.VITE_API_URL || "https://ancps-senegal.onrender.com/api";
const TOKEN_KEY = "ancps_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function request(endpoint, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // réponse sans corps
  }

  if (!response.ok) {
    throw new Error(data?.message || "Une erreur est survenue");
  }

  return data;
}

// Génère list / get / create / update / remove pour une ressource
const crud = (resource) => ({
  list: () => request(`/${resource}`),
  get: (id) => request(`/${resource}/${id}`),
  create: (data) => request(`/${resource}`, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/${resource}/${id}`, { method: "DELETE" }),
});

export const api = {
  // Authentification
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getProfile: () => request("/auth/profile"),

  // Certifications (méthodes existantes conservées)
  getCertifications: async () => {
  const response = await request(
    "/certifications?published=true"
  );

  return response.data || [];
},
  getCertification: (id) => request(`/certifications/${id}`),
  createCertification: (data) => request("/certifications", { method: "POST", body: JSON.stringify(data) }),
  updateCertification: (id, data) => request(`/certifications/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCertification: (id) => request(`/certifications/${id}`, { method: "DELETE" }),
  searchCertifications: (params = {}) =>
    request(`/search/certifications?${new URLSearchParams(params).toString()}`),

  getOrganizations: () => request("/organismes"),

  // Référentiels (prêts pour l'étape suivante)
  domaines: crud("domaines"),
  metiers: crud("metiers"),
  competences: crud("competences"),
  organismes: crud("organismes"),
  etablissements: crud("etablissements"),
  sources: crud("sources"),
  documents: crud("documents"),
  niveaux: crud("niveaux"),
};