// Générateurs de codes automatiques selon les spécifications ASCO

/**
 * Génère un code organisation
 * Format: ORG-XXX
 */
export const generateOrganisationCode = (numero: number): string => {
  return `ORG-${numero.toString().padStart(3, '0')}`;
};

/**
 * Génère un code section
 * Format: SEC-XXX
 */
export const generateSectionCode = (numero: number): string => {
  return `SEC-${numero.toString().padStart(3, '0')}`;
};

/**
 * Génère un code village
 * Format: VIL-XXX
 */
export const generateVillageCode = (numero: number): string => {
  return `VIL-${numero.toString().padStart(3, '0')}`;
};

/**
 * Génère un code producteur complet
 * Format: ORG-001-SEC-012-VIL-045-PROD-0287
 */
export const generateProducteurCode = (
  orgCode: string,
  secCode: string,
  vilCode: string,
  numero: number
): string => {
  const prodNum = numero.toString().padStart(4, '0');
  return `${orgCode}-${secCode}-${vilCode}-PROD-${prodNum}`;
};

/**
 * Génère un code plantation à partir du code producteur
 * Format: [CODE_PRODUCTEUR]-P1, P2, P3...
 */
export const generatePlantationCode = (producteurCode: string, numero: number): string => {
  return `${producteurCode}-P${numero}`;
};

/**
 * Génère un code opération
 * Format: OP-YYYY-XXXX
 */
export const generateOperationCode = (annee: number, numero: number): string => {
  return `OP-${annee}-${numero.toString().padStart(4, '0')}`;
};

/**
 * Calcule l'âge à partir d'une date de naissance
 */
export const calculateAge = (dateNaissance: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dateNaissance.getFullYear();
  const monthDiff = today.getMonth() - dateNaissance.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateNaissance.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Calcule le taux de loyauté
 * Formule: (Quantité livrée ASCO / Quantité récoltée totale) × 100
 */
export const calculateLoyaute = (quantiteLivreeAsco: number, quantiteTotale: number): number => {
  if (quantiteTotale === 0) return 0;
  return Math.round((quantiteLivreeAsco / quantiteTotale) * 100);
};

/**
 * Calcule la durée en minutes entre deux heures
 */
export const calculateDurationMinutes = (heureDebut: string, heureFin: string): number => {
  const [startH, startM] = heureDebut.split(':').map(Number);
  const [endH, endM] = heureFin.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  return endMinutes - startMinutes;
};

/**
 * Calcule la durée en jours entre deux dates
 */
export const calculateDurationDays = (dateDebut: Date, dateFin: Date): number => {
  const diffTime = Math.abs(dateFin.getTime() - dateDebut.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Formate un numéro de téléphone ivoirien
 */
export const formatPhoneCI = (phone: string): string => {
  // Retire tous les espaces et caractères spéciaux
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: +225 XX XX XX XX XX
  if (cleaned.length === 10) {
    return `+225 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};
