// Configuration de l'API
export const API_CONFIG = {
  // URL de l'API - Toujours pointer vers le serveur de production
  BASE_URL: 'http://82.208.22.230:3000/api',
  
  TIMEOUT: 30000, // 30 secondes
};

export const SOCKET_URL = API_CONFIG.BASE_URL.replace('/api', '');
