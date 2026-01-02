import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour améliorer le diagnostic des erreurs
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Logger les détails de l'erreur pour le diagnostic
        if (!error.response) {
          console.error('❌ [API] Erreur de connexion:', {
            message: error.message,
            code: error.code,
            baseURL: this.api.defaults.baseURL,
            url: error.config?.url,
            fullURL: `${this.api.defaults.baseURL}${error.config?.url}`,
          });
        }
        return Promise.reject(error);
      }
    );

    // Intercepteur pour ajouter le token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // ==================== AUTH ====================
  async login(username: string, password: string) {
    try {
      console.log('🔵 [API] Tentative de connexion:', { username, baseURL: this.api.defaults.baseURL });
      const response = await this.api.post('/auth/login', { username, password });
      console.log('✅ [API] Réponse reçue:', { status: response.status, hasAgent: !!response.data?.agent, hasToken: !!response.data?.token });
      
      // Le backend retourne { success: true, agent, token }
      // On normalise pour retourner { agent, token }
      if (response.data.success && response.data.agent && response.data.token) {
        return {
          agent: response.data.agent,
          token: response.data.token,
        };
      }
      // Si la structure est déjà correcte, la retourner telle quelle
      if (response.data.agent && response.data.token) {
        return response.data;
      }
      // Si aucune structure valide, lancer une erreur
      throw new Error('Réponse invalide du serveur');
    } catch (error: any) {
      console.error('❌ [API] Erreur login:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        url: error?.config?.url,
        baseURL: error?.config?.baseURL,
      });
      
      // Améliorer la gestion des erreurs
      if (error.response) {
        // Erreur du serveur
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Identifiants incorrects';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Pas de réponse du serveur
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      } else {
        // Erreur lors de la configuration de la requête
        throw new Error(error?.message || 'Erreur de configuration de la requête');
      }
    }
  }

  // ==================== ORGANISATIONS ====================
  async getOrganisations() {
    const response = await this.api.get('/organisations');
    return response.data;
  }

  async createOrganisation(data: any) {
    const response = await this.api.post('/organisations', data);
    return response.data;
  }

  async updateOrganisation(id: string, data: any) {
    const response = await this.api.put(`/organisations/${id}`, data);
    return response.data;
  }

  // ==================== SECTIONS ====================
  async getSections() {
    const response = await this.api.get('/sections');
    return response.data;
  }

  async createSection(data: any) {
    const response = await this.api.post('/sections', data);
    return response.data;
  }

  // ==================== VILLAGES ====================
  async getVillages() {
    const response = await this.api.get('/villages');
    return response.data;
  }

  async createVillage(data: any) {
    const response = await this.api.post('/villages', data);
    return response.data;
  }

  // ==================== PRODUCTEURS ====================
  async getProducteurs() {
    const response = await this.api.get('/producteurs');
    return response.data;
  }

  async createProducteur(data: any) {
    const response = await this.api.post('/producteurs', data);
    return response.data;
  }

  // ==================== PARCELLES ====================
  async getParcelles() {
    const response = await this.api.get('/parcelles');
    return response.data;
  }

  async createParcelle(data: any) {
    const response = await this.api.post('/parcelles', data);
    return response.data;
  }

  async updateParcelle(id: string, data: any) {
    const response = await this.api.put(`/parcelles/${id}`, data);
    return response.data;
  }

  // ==================== OPERATIONS ====================
  async getOperations() {
    const response = await this.api.get('/operations');
    return response.data;
  }

  async createOperation(data: any) {
    const response = await this.api.post('/operations', data);
    return response.data;
  }

  async updateOperation(id: string, data: any) {
    const response = await this.api.put(`/operations/${id}`, data);
    return response.data;
  }
}

export const apiService = new ApiService();
