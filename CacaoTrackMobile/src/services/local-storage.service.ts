import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

// Service de stockage local pour le mode offline
class LocalStorageService {
  
  // ==================== HELPERS ====================
  private async getCollection<T>(key: string): Promise<T[]> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Erreur lecture ${key}:`, error);
      return [];
    }
  }

  private async saveCollection<T>(key: string, data: T[]): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Erreur sauvegarde ${key}:`, error);
      throw error;
    }
  }

  // ==================== ORGANISATIONS ====================
  async getOrganisations() {
    return this.getCollection('organisations');
  }

  async createOrganisation(data: any) {
    const organisations = await this.getOrganisations();
    const newOrg = {
      id: uuid.v4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    organisations.push(newOrg);
    await this.saveCollection('organisations', organisations);
    return newOrg;
  }

  async updateOrganisation(id: string, data: any) {
    const organisations = await this.getOrganisations();
    const index = organisations.findIndex((o: any) => o.id === id);
    if (index !== -1) {
      organisations[index] = { ...organisations[index], ...data, updatedAt: new Date().toISOString() };
      await this.saveCollection('organisations', organisations);
      return organisations[index];
    }
    throw new Error('Organisation non trouvée');
  }

  async deleteOrganisation(id: string) {
    const organisations = await this.getOrganisations();
    const filtered = organisations.filter((o: any) => o.id !== id);
    await this.saveCollection('organisations', filtered);
  }

  // ==================== SECTIONS ====================
  async getSections() {
    return this.getCollection('sections');
  }

  async createSection(data: any) {
    const sections = await this.getSections();
    const newSection = {
      id: uuid.v4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sections.push(newSection);
    await this.saveCollection('sections', sections);
    return newSection;
  }

  async updateSection(id: string, data: any) {
    const sections = await this.getSections();
    const index = sections.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      sections[index] = { ...sections[index], ...data, updatedAt: new Date().toISOString() };
      await this.saveCollection('sections', sections);
      return sections[index];
    }
    throw new Error('Section non trouvée');
  }

  async deleteSection(id: string) {
    const sections = await this.getSections();
    const filtered = sections.filter((s: any) => s.id !== id);
    await this.saveCollection('sections', filtered);
  }

  // ==================== VILLAGES ====================
  async getVillages() {
    return this.getCollection('villages');
  }

  async createVillage(data: any) {
    const villages = await this.getVillages();
    const newVillage = {
      id: uuid.v4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    villages.push(newVillage);
    await this.saveCollection('villages', villages);
    return newVillage;
  }

  async updateVillage(id: string, data: any) {
    const villages = await this.getVillages();
    const index = villages.findIndex((v: any) => v.id === id);
    if (index !== -1) {
      villages[index] = { ...villages[index], ...data, updatedAt: new Date().toISOString() };
      await this.saveCollection('villages', villages);
      return villages[index];
    }
    throw new Error('Village non trouvé');
  }

  async deleteVillage(id: string) {
    const villages = await this.getVillages();
    const filtered = villages.filter((v: any) => v.id !== id);
    await this.saveCollection('villages', filtered);
  }

  // ==================== PRODUCTEURS ====================
  async getProducteurs() {
    return this.getCollection('producteurs');
  }

  async createProducteur(data: any) {
    const producteurs = await this.getProducteurs();
    const code = `PROD-${String(producteurs.length + 1).padStart(4, '0')}`;
    const newProducteur = {
      id: uuid.v4(),
      code,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    producteurs.push(newProducteur);
    await this.saveCollection('producteurs', producteurs);
    return newProducteur;
  }

  async updateProducteur(id: string, data: any) {
    const producteurs = await this.getProducteurs();
    const index = producteurs.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      producteurs[index] = { ...producteurs[index], ...data, updatedAt: new Date().toISOString() };
      await this.saveCollection('producteurs', producteurs);
      return producteurs[index];
    }
    throw new Error('Producteur non trouvé');
  }

  async deleteProducteur(id: string) {
    const producteurs = await this.getProducteurs();
    const filtered = producteurs.filter((p: any) => p.id !== id);
    await this.saveCollection('producteurs', filtered);
  }

  // ==================== PARCELLES ====================
  async getParcelles() {
    return this.getCollection('parcelles');
  }

  async createParcelle(data: any) {
    const parcelles = await this.getParcelles();
    const code = `PARC-${String(parcelles.length + 1).padStart(4, '0')}`;
    const newParcelle = {
      id: uuid.v4(),
      code,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    parcelles.push(newParcelle);
    await this.saveCollection('parcelles', parcelles);
    return newParcelle;
  }

  async updateParcelle(id: string, data: any) {
    const parcelles = await this.getParcelles();
    const index = parcelles.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      parcelles[index] = { ...parcelles[index], ...data, updatedAt: new Date().toISOString() };
      await this.saveCollection('parcelles', parcelles);
      return parcelles[index];
    }
    throw new Error('Parcelle non trouvée');
  }

  async deleteParcelle(id: string) {
    const parcelles = await this.getParcelles();
    const filtered = parcelles.filter((p: any) => p.id !== id);
    await this.saveCollection('parcelles', filtered);
  }

  // ==================== COLLECTES ====================
  async getCollectes() {
    return this.getCollection('collectes');
  }

  async createCollecte(data: any) {
    const collectes = await this.getCollectes();
    const code = `COL-${String(collectes.length + 1).padStart(4, '0')}`;
    const newCollecte = {
      id: uuid.v4(),
      code,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    collectes.push(newCollecte);
    await this.saveCollection('collectes', collectes);
    return newCollecte;
  }

  async updateCollecte(id: string, data: any) {
    const collectes = await this.getCollectes();
    const index = collectes.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      collectes[index] = { ...collectes[index], ...data, updatedAt: new Date().toISOString() };
      await this.saveCollection('collectes', collectes);
      return collectes[index];
    }
    throw new Error('Collecte non trouvée');
  }

  async deleteCollecte(id: string) {
    const collectes = await this.getCollectes();
    const filtered = collectes.filter((c: any) => c.id !== id);
    await this.saveCollection('collectes', filtered);
  }

  // ==================== REGIONS ====================
  async getRegions() {
    const regions = await this.getCollection('regions');
    if (regions.length === 0) {
      // Initialiser avec les régions de Côte d'Ivoire
      const defaultRegions = [
        { id: uuid.v4(), nom: 'Abidjan', code: 'ABJ' },
        { id: uuid.v4(), nom: 'Bas-Sassandra', code: 'BSS' },
        { id: uuid.v4(), nom: 'Comoé', code: 'COM' },
        { id: uuid.v4(), nom: 'Denguélé', code: 'DEN' },
        { id: uuid.v4(), nom: 'Gôh-Djiboua', code: 'GDJ' },
        { id: uuid.v4(), nom: 'Lacs', code: 'LAC' },
        { id: uuid.v4(), nom: 'Lagunes', code: 'LAG' },
        { id: uuid.v4(), nom: 'Montagnes', code: 'MON' },
        { id: uuid.v4(), nom: 'Sassandra-Marahoué', code: 'SMR' },
        { id: uuid.v4(), nom: 'Savanes', code: 'SAV' },
        { id: uuid.v4(), nom: 'Vallée du Bandama', code: 'VDB' },
        { id: uuid.v4(), nom: 'Woroba', code: 'WOR' },
        { id: uuid.v4(), nom: 'Yamoussoukro', code: 'YAM' },
        { id: uuid.v4(), nom: 'Zanzan', code: 'ZAN' },
      ];
      await this.saveCollection('regions', defaultRegions);
      return defaultRegions;
    }
    return regions;
  }

  // ==================== STATS ====================
  async getStats() {
    const [organisations, sections, villages, producteurs, parcelles, collectes] = await Promise.all([
      this.getOrganisations(),
      this.getSections(),
      this.getVillages(),
      this.getProducteurs(),
      this.getParcelles(),
      this.getCollectes(),
    ]);

    return {
      organisations: organisations.length,
      sections: sections.length,
      villages: villages.length,
      producteurs: producteurs.length,
      parcelles: parcelles.length,
      collectes: collectes.length,
    };
  }

  // ==================== CLEAR ALL ====================
  async clearAll() {
    const keys = ['organisations', 'sections', 'villages', 'producteurs', 'parcelles', 'collectes', 'regions'];
    await AsyncStorage.multiRemove(keys);
  }
}

export const localStorageService = new LocalStorageService();
