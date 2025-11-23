import { differenceInYears } from "date-fns";

/**
 * Génère un code Producteur au format: ORG-SEC-VIL-ORD
 * @param orgCode Code de l'organisation (ex: COOPCA)
 * @param secCode Code de la section (ex: S01)
 * @param vilCode Code du village (ex: V05)
 * @param orderNum Numéro d'ordre du producteur dans le village (ex: 1)
 */
export const generateProducteurCode = (
  orgCode: string,
  secCode: string,
  vilCode: string,
  orderNum: number
): string => {
  const formattedOrder = orderNum.toString().padStart(3, '0');
  return `${orgCode}-${secCode}-${vilCode}-${formattedOrder}`.toUpperCase();
};

/**
 * Génère un code Plantation au format: ORG-SEC-VIL-ORD-PX
 * @param producteurCode Le code complet du producteur
 * @param plantationIndex L'index de la plantation (1, 2, 3...)
 */
export const generatePlantationCode = (
  producteurCode: string,
  plantationIndex: number
): string => {
  return `${producteurCode}-P${plantationIndex}`;
};

/**
 * Calcule l'âge à partir de la date de naissance
 * @param dateNaissance Date de naissance (string ou Date)
 */
export const calculateAge = (dateNaissance: string | Date): number => {
  if (!dateNaissance) return 0;
  return differenceInYears(new Date(), new Date(dateNaissance));
};

/**
 * Formate un nombre avec 2 décimales
 * @param value Le nombre à formater
 */
export const formatDecimal = (value: number): string => {
  return value.toFixed(2);
};

/**
 * Calcule le taux de loyauté
 * @param livraisons Quantité livrée à la coopérative
 * @param productionTotale Production totale récoltée
 */
export const calculateLoyaute = (livraisons: number, productionTotale: number): number => {
  if (productionTotale <= 0) return 0;
  const ratio = (livraisons / productionTotale) * 100;
  return Math.min(Math.round(ratio * 100) / 100, 100); // Max 100%, 2 décimales
};

/**
 * Génère une liste de couleurs/icônes pour les statuts
 */
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'validé':
    case 'complet':
    case 'payé':
    case 'actif':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'en attente':
    case 'brouillon':
    case 'en cours':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejeté':
    case 'annulé':
    case 'bloqué':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
