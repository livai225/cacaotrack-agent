import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onChange: (coords: { latitude: number; longitude: number }) => void;
  required?: boolean;
}

// Token Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZHljaG91IiwiYSI6ImNtNHVlbGwyMjBnNmcyanM2aWdzZ2ZqNTgifQ.m231KiKnYcVGc-mj0ax4kw';

// Centre par défaut - Côte d'Ivoire (Abidjan)
const DEFAULT_CENTER: [number, number] = [-4.0083, 5.3600];

export default function MapPicker({ latitude, longitude, onChange, required }: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(
    latitude && longitude ? { latitude, longitude } : null
  );

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // Initialiser la carte seulement une fois

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: latitude && longitude ? [longitude, latitude] : DEFAULT_CENTER,
      zoom: latitude && longitude ? 14 : 6,
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Ajouter le contrôle de géolocalisation
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    map.current.addControl(geolocate, 'top-right');

    // Gérer le clic sur la carte
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      const newPosition = { latitude: lat, longitude: lng };
      setCurrentCoords(newPosition);
      onChange(newPosition);

      // Ajouter ou déplacer le marqueur
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        marker.current = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([lng, lat])
          .addTo(map.current!);
      }
    });

    // Si des coordonnées initiales existent, ajouter un marqueur
    if (latitude && longitude) {
      marker.current = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Mettre à jour le marqueur quand les props changent
  useEffect(() => {
    if (map.current && latitude && longitude && !currentCoords) {
      if (marker.current) {
        marker.current.setLngLat([longitude, latitude]);
      } else {
        marker.current = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      }
      map.current.flyTo({ center: [longitude, latitude], zoom: 14 });
    }
  }, [latitude, longitude]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Sélectionner la position sur la carte
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {currentCoords && (
          <div className="text-xs text-muted-foreground font-mono">
            {currentCoords.latitude.toFixed(6)}, {currentCoords.longitude.toFixed(6)}
          </div>
        )}
      </div>

      <Card className="overflow-hidden">
        <div ref={mapContainer} className="h-[400px] w-full" />
      </Card>

      <div className="text-xs text-muted-foreground">
        💡 Cliquez sur la carte pour placer un marqueur ou utilisez le bouton de géolocalisation (en haut à droite)
      </div>
    </div>
  );
}
