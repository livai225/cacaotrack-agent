// Configuration de l'API
// Pour forcer l'utilisation de l'URL de production même en développement,
// définir USE_PRODUCTION_API=true dans votre environnement ou modifier directement ci-dessous
const USE_PRODUCTION_API = true; // Mettre à false pour utiliser l'URL locale en développement

export const API_CONFIG = {
  // URL de l'API - À modifier selon l'environnement
  BASE_URL: (__DEV__ && !USE_PRODUCTION_API)
    ? 'http://10.0.2.2:3000/api' // Émulateur Android (nécessite serveur local sur port 3000)
    : 'http://82.208.22.230/api', // Production (via Nginx proxy)
  
  TIMEOUT: 30000, // 30 secondes
  
  // Pour les tests locaux, utiliser l'IP de votre machine
  // Exemple: 'http://192.168.1.100:3000/api'
  
  // Note: Nginx fait le proxy vers le port 3000, donc utiliser 'http://82.208.22.230/api'
  // Si le port 3000 est accessible directement depuis l'extérieur, utiliser 'http://82.208.22.230:3000/api'
};

export const SOCKET_URL = API_CONFIG.BASE_URL.replace('/api', '');
