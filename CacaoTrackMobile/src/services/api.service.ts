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
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // ==================== AUTH ====================
  async login(username: string, password: string) {
    const response = await this.api.post('/auth/login', { username, password });
    return response.data;
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
