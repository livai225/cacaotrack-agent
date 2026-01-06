import { Platform } from 'react-native';

// Force l'utilisation de l'URL de production même en développement
// Mettre à false uniquement si vous testez avec un serveur local
const USE_PRODUCTION_API = true;

// L'URL de base pour le développement.
// Pour l'émulateur Android, '10.0.2.2' est l'alias pour le localhost de l'ordinateur.
const DEV_URL = Platform.OS === 'ios' 
  ? 'http://localhost:3000/api' 
  : 'http://10.0.2.2:3000/api';

// L'URL de base pour la production (via Nginx proxy).
const PROD_URL = 'http://82.208.22.230/api';

/**
 * Configuration de l'API.
 * Par défaut, utilise toujours l'URL de production pour garantir la connexion au serveur distant.
 * Pour tester en local, mettre USE_PRODUCTION_API à false.
 */
export const API_CONFIG = {
  BASE_URL: USE_PRODUCTION_API ? PROD_URL : DEV_URL,
  TIMEOUT: 30000, // 30 secondes
};

// URL pour la connexion WebSocket.
export const SOCKET_URL = API_CONFIG.BASE_URL.replace('/api', '');
