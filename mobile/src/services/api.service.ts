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
      const fullURL = `${this.api.defaults.baseURL}/auth/login`;
      console.log('🔵 [API] Tentative de connexion:', { 
        username, 
        baseURL: this.api.defaults.baseURL,
        fullURL,
        timeout: this.api.defaults.timeout
      });
      
      // Test de connectivité avant la requête
      console.log('🔵 [API] Test de connectivité vers:', fullURL);
      
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

  async getOperation(id: string) {
    const response = await this.api.get(`/operations/${id}`);
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

  async deleteOperation(id: string) {
    const response = await this.api.delete(`/operations/${id}`);
    return response.data;
  }

  // ==================== AGENTS ====================
  async getAgents() {
    const response = await this.api.get('/agents');
    return response.data;
  }

  async getAgent(id: string) {
    const response = await this.api.get(`/agents/${id}`);
    return response.data;
  }

  async getAgentStats(id: string) {
    const response = await this.api.get(`/agents/${id}/stats`);
    return response.data;
  }

  async updateAgentPassword(id: string, password: string) {
    const response = await this.api.post(`/agents/${id}/password`, { password });
    return response.data;
  }

  // ==================== REGIONS ====================
  async getRegions() {
    const response = await this.api.get('/regions');
    return response.data;
  }

  async getRegion(id: string) {
    const response = await this.api.get(`/regions/${id}`);
    return response.data;
  }

  async getRegionAgents(id: string) {
    const response = await this.api.get(`/regions/${id}/agents`);
    return response.data;
  }

  // ==================== SECTIONS ====================
  async getSection(id: string) {
    const response = await this.api.get(`/sections/${id}`);
    return response.data;
  }

  async updateSection(id: string, data: any) {
    const response = await this.api.put(`/sections/${id}`, data);
    return response.data;
  }

  async deleteSection(id: string) {
    const response = await this.api.delete(`/sections/${id}`);
    return response.data;
  }

  // ==================== VILLAGES ====================
  async getVillage(id: string) {
    const response = await this.api.get(`/villages/${id}`);
    return response.data;
  }

  async updateVillage(id: string, data: any) {
    const response = await this.api.put(`/villages/${id}`, data);
    return response.data;
  }

  async deleteVillage(id: string) {
    const response = await this.api.delete(`/villages/${id}`);
    return response.data;
  }

  // ==================== PRODUCTEURS ====================
  async getProducteur(id: string) {
    const response = await this.api.get(`/producteurs/${id}`);
    return response.data;
  }

  async updateProducteur(id: string, data: any) {
    const response = await this.api.put(`/producteurs/${id}`, data);
    return response.data;
  }

  async deleteProducteur(id: string) {
    const response = await this.api.delete(`/producteurs/${id}`);
    return response.data;
  }

  // ==================== PARCELLES ====================
  async getParcelle(id: string) {
    const response = await this.api.get(`/parcelles/${id}`);
    return response.data;
  }

  async deleteParcelle(id: string) {
    const response = await this.api.delete(`/parcelles/${id}`);
    return response.data;
  }

  // ==================== ORGANISATIONS ====================
  async getOrganisation(id: string) {
    const response = await this.api.get(`/organisations/${id}`);
    return response.data;
  }

  async deleteOrganisation(id: string) {
    const response = await this.api.delete(`/organisations/${id}`);
    return response.data;
  }

  // ==================== HEALTH ====================
  async checkHealth() {
    const response = await this.api.get('/health');
    return response.data;
  }

  // ==================== AGENT LOCATION ====================
  async sendAgentLocation(data: {
    id_agent: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
    battery_level?: number;
  }) {
    try {
      console.log('📍 [API] Envoi position:', { id_agent: data.id_agent, lat: data.latitude, lng: data.longitude });
      const response = await this.api.post('/agents/location', data);
      console.log('✅ [API] Position envoyée avec succès:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [API] Erreur envoi localisation:', error?.response?.data || error.message);
      throw error;
    }
  }

  // ==================== DASHBOARD STATS ====================
  async getDashboardStats(agentId?: string) {
    try {
      const params = agentId ? { agentId } : {};
      const response = await this.api.get('/dashboard/stats', { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ [API] Erreur récupération stats:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
