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

    // Intercepteur pour ajouter le token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour les réponses et erreurs
    this.api.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          // La requête a été faite et le serveur a répondu avec un code d'état
          // qui tombe hors de la plage 2xx
          console.error('[API Error Response]', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
            url: error.config?.url
          });
        } else if (error.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          console.error('[API Error Request] No response received', error.request);
        } else {
          // Une chose s'est produite lors de la configuration de la requête qui a déclenché une erreur
          console.error('[API Error Config]', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== AUTH ====================
  async login(username: string, password: string) {
    const response = await this.api.post('/auth/login', { username, password });
    return response.data;
  }

  // ==================== ORGANISATIONS ====================
  async getOrganisations(): Promise<any> {
    return this.api.get('/api/organisations');
  }

  async createOrganisation(data: any): Promise<any> {
    // Formatage des données pour correspondre au schéma du backend
    const orgData = {
      nom: data.nom,
      sigle: data.sigle,
      type: 'Coopérative', // Valeur par défaut
      statut: 'actif',
      localite: data.localite,
      region: 'Indéfini', // Valeur par défaut
      departement: 'Indéfini', // Valeur par défaut
      sous_prefecture: 'Indéfini', // Valeur par défaut
      president_nom: data.president_nom || '',
      president_contact: data.president_contact ? [data.president_contact] : [],
      secretaire_nom: data.secretaire_nom || null,
      secretaire_contact: data.secretaire_contact ? [data.secretaire_contact] : [],
      date_creation: new Date().toISOString()
    };
    
    return this.api.post('/api/organisations', orgData);
  }

  async updateOrganisation(id: string, data: any) {
    const response = await this.api.put(`/api/organisations/${id}`, data);
    return response.data;
  }

  // ==================== SECTIONS ====================
  async getSections() {
    const response = await this.api.get('/api/sections');
    return response.data;
  }

  async createSection(data: any) {
    const sectionData = {
      ...data,
      statut: data.statut || 'actif',
      date_creation: new Date().toISOString()
    };
    const response = await this.api.post('/api/sections', sectionData);
    return response.data;
  }

  // ==================== VILLAGES ====================
  async getVillages() {
    const response = await this.api.get('/api/villages');
    return response.data;
  }

  async createVillage(data: any) {
    const villageData = {
      ...data,
      statut: data.statut || 'actif',
      date_creation: new Date().toISOString()
    };
    const response = await this.api.post('/api/villages', villageData);
    return response.data;
  }

  // ==================== PRODUCTEURS ====================
  async getProducteurs() {
    const response = await this.api.get('/api/producteurs');
    return response.data;
  }

  async createProducteur(data: any) {
    const producteurData = {
      ...data,
      statut: data.statut || 'actif',
      date_creation: new Date().toISOString(),
      // Assurez-vous que les chums requis sont présents
      telephone_1: data.telephone_1 || '',
      telephone_2: data.telephone_2 || null,
      photo_planteur: data.photo_planteur || null,
      statut_matrimonial: data.statut_matrimonial || 'Célibataire',
      genre: data.genre || 'Homme',
      date_naissance: data.date_naissance || null
    };
    const response = await this.api.post('/api/producteurs', producteurData);
    return response.data;
  }

  // ==================== PARCELLES ====================
  async getParcelles() {
    const response = await this.api.get('/api/parcelles');
    return response.data;
  }

  async createParcelle(data: any) {
    const parcelleData = {
      ...data,
      statut: data.statut || 'actif',
      date_creation: new Date().toISOString(),
      // Assurez-vous que les champs requis sont présents
      code: data.code || `PARC-${Date.now()}`,
      superficie: data.superficie || 0,
      polygone_gps: data.polygone_gps || null,
      superficie_gps: data.superficie_gps || 0,
      perimetre: data.perimetre || 0,
      id_producteur: data.id_producteur
    };
    const response = await this.api.post('/api/parcelles', parcelleData);
    return response.data;
  }

  async updateParcelle(id: string, data: any) {
    const response = await this.api.put(`/api/parcelles/${id}`, data);
    return response.data;
  }

  // ==================== OPERATIONS ====================
  async getOperations() {
    const response = await this.api.get('/api/operations');
    return response.data;
  }

  async createOperation(data: any) {
    const operationData = {
      ...data,
      statut: data.statut || 'Brouillon',
      campagne: data.campagne || '2023-2024',
      quantite_cabosses: data.quantite_cabosses || 0,
      poids_estimatif: data.poids_estimatif || 0,
      nb_sacs_brousse: data.nb_sacs_brousse || 0,
      date_recolte: data.date_recolte || new Date().toISOString(),
      date_signature: data.date_signature || new Date().toISOString()
    };
    const response = await this.api.post('/api/operations', operationData);
    return response.data;
  }

  async updateOperation(id: string, data: any) {
    const response = await this.api.put(`/api/operations/${id}`, data);
    return response.data;
  }
}

export const apiService = new ApiService();
