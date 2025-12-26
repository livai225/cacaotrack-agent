// Configuration de l'API
export const API_CONFIG = {
  // URL de l'API
  // __DEV__ = True (Émulateur) -> Utilise le Proxy Local (localhost:4000) pour contourner les restrictions réseau
  // __DEV__ = False (APK Production) -> Utilise le serveur distant (82.208.22.230) directement
  BASE_URL: __DEV__
    ? 'http://localhost:4000/api'
    : 'http://82.208.22.230:3000/api',
  
  TIMEOUT: 30000, // 30 secondes
};

export const SOCKET_URL = API_CONFIG.BASE_URL.replace('/api', '');
