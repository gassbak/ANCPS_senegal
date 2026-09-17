const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("admin_token");
}

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // réponse sans corps JSON (ex: 204)
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined;
  return res.json();
}

// Mêmes noms de méthodes que le service mock d'origine (services/data.ts),
// mais qui appellent désormais le vrai backend Node.js / MongoDB Atlas.
export const api = {
  getCertifications: async () => {
    const res = await fetch(`${API_URL}/certifications`);
    return handleResponse(res);
  },

  getCertificationById: async (id) => {
    const res = await fetch(`${API_URL}/certifications/${id}`);
    if (res.status === 404) return undefined;
    return handleResponse(res);
  },

  getOrganizations: async () => {
    const res = await fetch(`${API_URL}/organizations`);
    return handleResponse(res);
  },

  // Méthodes Admin (nécessitent une session authentifiée)
  createCertification: async (cert) => {
    const res = await fetch(`${API_URL}/certifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(cert)
    });
    return handleResponse(res);
  },

  updateCertification: async (id, updates) => {
    const res = await fetch(`${API_URL}/certifications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  deleteCertification: async (id) => {
    const res = await fetch(`${API_URL}/certifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return handleResponse(res);
  },

  // Authentification de l'espace admin
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  }
};
