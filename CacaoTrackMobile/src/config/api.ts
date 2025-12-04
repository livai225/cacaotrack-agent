// Configuration de l'API
export const API_CONFIG = {
  // URL de l'API - À modifier selon l'environnement
  BASE_URL: __DEV__ 
    ? 'http://10.0.2.2:3000/api' // Émulateur Android
    : 'http://82.208.22.230/api', // Production
  
  TIMEOUT: 30000, // 30 secondes
  
  // Pour les tests locaux, utiliser l'IP de votre machine
  // Exemple: 'http://192.168.1.100:3000/api'
};

export const SOCKET_URL = API_CONFIG.BASE_URL.replace('/api', '');
