import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// --- INTERCEPTEUR GLOBAL AXIOS ---
// Ce code s'exécute sur CHAQUE réponse de l'API
api.interceptors.response.use(
  (response) => {
    // Si la réponse est un succès (status 2xx), on la retourne simplement
    return response;
  },
  (error) => {
    // Si le serveur répond avec une erreur
    if (error.response && error.response.status === 401) {
      // Si l'erreur est 401 Non Autorisé (token expiré ou invalide)
      console.error("Session expirée ou invalide, déconnexion automatique...");
      
      // 1. On supprime le token invalide du stockage local
      localStorage.removeItem('token');
      
      // 2. On redirige l'utilisateur vers la page de connexion
      // On utilise window.location.href pour forcer un rechargement complet de la page,
      // ce qui nettoie l'état de l'application.
      window.location.href = '/sign-in';
    }
    // Pour toutes les autres erreurs, on les laisse se propager
    return Promise.reject(error);
  }
);


// Fonction helper pour obtenir les en-têtes d'autorisation
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  // S'il n'y a pas de token, on retourne un objet vide pour éviter d'envoyer "Bearer null"
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// --- AUTH ---
export const login = async (login, password) => {
  return await api.post('/api/auth/login', { login, password });
};

// --- IP CHECK (Public) ---
export const checkIpAddress = async (ipAddress) => {
  return await api.post('/api/ip/check', { ip_address: ipAddress });
};

// --- DASHBOARD ---
export const getDashboardStats = async () => {
  return await api.get('/api/dashboard/stats', getAuthHeaders());
};

// --- REGIONS ---
export const getRegions = async () => await api.get('/api/regions', getAuthHeaders());
export const createRegion = async (data) => await api.post('/api/regions', data, getAuthHeaders());
export const updateRegion = async (id, data) => await api.put(`/api/regions/${id}`, data, getAuthHeaders());
export const deleteRegion = async (id) => await api.delete(`/api/regions/${id}`, getAuthHeaders());

// --- SITE TYPES ---
export const getSiteTypes = async () => await api.get('/api/types', getAuthHeaders());
export const createSiteType = async (data) => await api.post('/api/types', data, getAuthHeaders());
export const updateSiteType = async (id, data) => await api.put(`/api/types/${id}`, data, getAuthHeaders());
export const deleteSiteType = async (id) => await api.delete(`/api/types/${id}`, getAuthHeaders());

// --- SITES ---
export const getSites = async () => await api.get('/api/sites', getAuthHeaders());
export const getSiteById = async (id) => await api.get(`/api/sites/${id}`, getAuthHeaders());
export const createSite = async (data) => await api.post('/api/sites', data, getAuthHeaders());
export const updateSite = async (id, data) => await api.put(`/api/sites/${id}`, data, getAuthHeaders());
export const deleteSite = async (id) => await api.delete(`/api/sites/${id}`, getAuthHeaders());

// --- IP ADDRESSES ---
export const getAllIpAddresses = async () => await api.get('/api/ip-addresses', getAuthHeaders());
export const getIpAddressById = async (id) => await api.get(`/api/ip-addresses/${id}`, getAuthHeaders());
export const createIpAddress = async (data) => await api.post('/api/ip-addresses', data, getAuthHeaders());
export const updateIpAddress = async (id, data) => await api.put(`/api/ip-addresses/${id}`, data, getAuthHeaders());
export const deleteIpAddress = async (id) => await api.delete(`/api/ip-addresses/${id}`, getAuthHeaders());

// --- VLANS ---
export const getAllVlans = async () => await api.get('/api/vlans', getAuthHeaders());
export const getVlanById = async (id) => await api.get(`/api/vlans/${id}`, getAuthHeaders());
export const createVlan = async (data) => await api.post('/api/vlans', data, getAuthHeaders());
export const updateVlan = async (id, data) => await api.put(`/api/vlans/${id}`, data, getAuthHeaders());
export const deleteVlan = async (id) => await api.delete(`/api/vlans/${id}`, getAuthHeaders());

// --- ANOMALIES ---
export const getAnomalies = async () => await api.get('/api/anomalies', getAuthHeaders());
export const scanAnomalies = async () => await api.post('/api/anomalies/scan', {}, getAuthHeaders());
export const acknowledgeAnomaly = async (id) => await api.put(`/api/anomalies/${id}/acknowledge`, {}, getAuthHeaders());

// --- ADMIN PROFILE ---
export const getMyProfile = async () => await api.get('/api/admins/profile', getAuthHeaders());
export const updateMyProfile = async (formData) => {
  const token = localStorage.getItem('token');
  return await api.put('/api/admins/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
};
export const changeMyPassword = async (passwordData) => {
  return await api.put('/api/admins/profile/change-password', passwordData, getAuthHeaders());
};
export const getAllAdmins = async () => await api.get('/api/admins', getAuthHeaders());
export const createAdmin = async (formData) => {
    const token = localStorage.getItem('token');
    return await api.post('/api/admins', formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } });
};
export const updateAdmin = async (id, data) => await api.put(`/api/admins/${id}`, data, getAuthHeaders());
export const deleteAdmin = async (id) => await api.delete(`/api/admins/${id}`, getAuthHeaders());

// --- Fonctions pour le mot de passe oublié ---
export const forgotPassword = async (email) => {
  return await api.post('/api/admins/forgot-password', { email });
};
export const resetPassword = async (token, password) => {
  return await api.post(`/api/admins/reset-password/${token}`, { password });
};