import * as Location from 'expo-location';
import { apiService } from './api.service';
import { Platform } from 'react-native';

class LocationService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private agentId: string | null = null;
  private readonly INTERVAL_MS = 30 * 60 * 1000; // 30 minutes en millisecondes

  /**
   * Démarrer le suivi de localisation pour un agent
   */
  async startTracking(agentId: string) {
    if (this.isRunning && this.agentId === agentId) {
      console.log('📍 [Location] Suivi déjà actif pour cet agent');
      return;
    }

    // Arrêter le suivi précédent si actif
    this.stopTracking();

    // Demander les permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('❌ [Location] Permission de localisation refusée');
      return;
    }

    this.agentId = agentId;
    this.isRunning = true;

    // Envoyer la position immédiatement
    await this.sendCurrentLocation();

    // Programmer l'envoi périodique toutes les 30 minutes
    this.intervalId = setInterval(() => {
      this.sendCurrentLocation();
    }, this.INTERVAL_MS);

    console.log(`✅ [Location] Suivi démarré pour l'agent ${agentId} (intervalle: 30 min)`);
  }

  /**
   * Arrêter le suivi de localisation
   */
  stopTracking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.agentId = null;
    console.log('🛑 [Location] Suivi arrêté');
  }

  /**
   * Envoyer la position actuelle au serveur
   */
  private async sendCurrentLocation() {
    if (!this.agentId) {
      console.error('❌ [Location] Aucun agent ID défini');
      return;
    }

    try {
      // Obtenir la position actuelle
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Obtenir le niveau de batterie si disponible (nécessite une librairie supplémentaire)
      let batteryLevel: number | undefined;
      try {
        // Note: expo-battery n'est pas installé par défaut
        // On peut utiliser une valeur par défaut ou installer expo-battery
        batteryLevel = undefined; // À implémenter si nécessaire
      } catch (error) {
        // Ignorer l'erreur de batterie
      }

      // Préparer les données
      // Note: speed est déjà en m/s depuis getCurrentPositionAsync, on le garde tel quel
      const locationData = {
        id_agent: this.agentId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        altitude: location.coords.altitude || undefined,
        heading: location.coords.heading || undefined,
        speed: location.coords.speed || undefined, // En m/s (pas de conversion)
        battery_level: batteryLevel,
      };

      // Envoyer au serveur
      console.log(`📍 [Location] Envoi position pour agent ${this.agentId}:`, {
        latitude: location.coords.latitude.toFixed(6),
        longitude: location.coords.longitude.toFixed(6),
        accuracy: location.coords.accuracy
      });
      await apiService.sendAgentLocation(locationData);
      console.log(`✅ [Location] Position envoyée avec succès: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
    } catch (error: any) {
      console.error('❌ [Location] Erreur envoi position:', error?.response?.data || error.message);
      console.error('❌ [Location] Détails erreur:', {
        message: error.message,
        status: error?.response?.status,
        data: error?.response?.data
      });
      // Ne pas arrêter le suivi en cas d'erreur, on réessayera au prochain intervalle
    }
  }

  /**
   * Vérifier si le suivi est actif
   */
  isTracking(): boolean {
    return this.isRunning;
  }
}

export const locationService = new LocationService();
