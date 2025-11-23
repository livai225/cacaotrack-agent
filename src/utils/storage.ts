import { Organisation, Section, Village, Producteur, Parcelle, Operation } from "@/types/organisation";
import { SEED_ORGANISATIONS, SEED_SECTIONS, SEED_VILLAGES, SEED_PRODUCTEURS, SEED_PARCELLES, SEED_OPERATIONS } from "./seeds";

const STORAGE_KEYS = {
  ORGANISATIONS: 'cacaotrack_organisations',
  SECTIONS: 'cacaotrack_sections',
  VILLAGES: 'cacaotrack_villages',
  PRODUCTEURS: 'cacaotrack_producteurs',
  PARCELLES: 'cacaotrack_parcelles',
  OPERATIONS: 'cacaotrack_operations',
  INITIALIZED: 'cacaotrack_initialized'
};

// Helper to parse dates from JSON
const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

export const Storage = {
  initialize: () => {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      console.log('Initializing storage with seed data...');
      localStorage.setItem(STORAGE_KEYS.ORGANISATIONS, JSON.stringify(SEED_ORGANISATIONS));
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(SEED_SECTIONS));
      localStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(SEED_VILLAGES));
      localStorage.setItem(STORAGE_KEYS.PRODUCTEURS, JSON.stringify(SEED_PRODUCTEURS));
      localStorage.setItem(STORAGE_KEYS.PARCELLES, JSON.stringify(SEED_PARCELLES));
      localStorage.setItem(STORAGE_KEYS.OPERATIONS, JSON.stringify(SEED_OPERATIONS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      return true;
    }
    return false;
  },

  reset: () => {
    localStorage.clear();
    Storage.initialize();
    window.location.reload();
  },

  // Generic Getters
  getAll: <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data, dateReviver);
  },

  getById: <T extends { id: string }>(key: string, id: string): T | undefined => {
    const items = Storage.getAll<T>(key);
    return items.find(item => item.id === id);
  },

  // Generic Setters
  save: <T extends { id: string }>(key: string, item: T) => {
    const items = Storage.getAll<T>(key);
    const index = items.findIndex(i => i.id === item.id);
    
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    
    localStorage.setItem(key, JSON.stringify(items));
  },

  delete: <T extends { id: string }>(key: string, id: string) => {
    const items = Storage.getAll<T>(key);
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  },

  // Specific Accessors
  getOrganisations: () => Storage.getAll<Organisation>(STORAGE_KEYS.ORGANISATIONS),
  getSections: () => Storage.getAll<Section>(STORAGE_KEYS.SECTIONS),
  getVillages: () => Storage.getAll<Village>(STORAGE_KEYS.VILLAGES),
  getProducteurs: () => Storage.getAll<Producteur>(STORAGE_KEYS.PRODUCTEURS),
  getParcelles: () => Storage.getAll<Parcelle>(STORAGE_KEYS.PARCELLES),
  getOperations: () => Storage.getAll<Operation>(STORAGE_KEYS.OPERATIONS),

  // Add Helpers
  addProducteur: (prod: Producteur) => Storage.save(STORAGE_KEYS.PRODUCTEURS, prod),
  addParcelle: (parc: Parcelle) => Storage.save(STORAGE_KEYS.PARCELLES, parc),
  addOperation: (op: Operation) => Storage.save(STORAGE_KEYS.OPERATIONS, op),
};

export default Storage;
