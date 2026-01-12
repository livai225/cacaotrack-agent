import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Building2, User, Leaf, MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  type: 'organisation' | 'producteur' | 'parcelle' | 'village' | 'agent';
  nom: string;
  details?: string;
  produit?: 'cacao' | 'tomate' | 'hevea' | 'autre';
  agent?: {
    id: string;
    code: string;
    nom_complet: string;
    telephone?: string;
    statut?: string;
  };
  timestamp?: string;
  battery_level?: number;
  is_online?: boolean;
}

interface MapViewProps {
  points: MapPoint[];
  height?: string;
  showLegend?: boolean;
  centerOnAgentId?: string;
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZHljaG91IiwiYSI6ImNtNHVlbGwyMjBnNmcyanM2aWdzZ2ZqNTgifQ.m231KiKnYcVGc-mj0ax4kw';

// Couleurs par type
const TYPE_COLORS = {
  organisation: '#3b82f6', // Bleu
  producteur: '#10b981', // Vert
  parcelle: '#f59e0b', // Orange
  village: '#8b5cf6', // Violet
  agent: '#ef4444', // Rouge pour les agents
};

// Couleurs par produit
const PRODUCT_COLORS = {
  cacao: '#7c2d12', // Marron
  tomate: '#dc2626', // Rouge
  hevea: '#15803d', // Vert foncé
  autre: '#6b7280', // Gris
};

export default function MapView({ points, height = '500px', showLegend = true, centerOnAgentId }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;

    const center: [number, number] = points.length > 0 
      ? [points[0].longitude, points[0].latitude]
      : [-4.0083, 5.3600];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: points.length === 1 ? 14 : 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    return () => {
      markers.current.forEach(m => m.remove());
      if (popup.current) popup.current.remove();
      if (map.current) map.current.remove();
    };
  }, []);

  const getMarkerColor = (point: MapPoint) => {
    if (point.produit) {
      return PRODUCT_COLORS[point.produit];
    }
    return TYPE_COLORS[point.type];
  };

  const getMarkerSvg = (type: string) => {
    const icons: Record<string, string> = {
      organisation: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
      producteur: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      parcelle: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
      village: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
      agent: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    };
    return icons[type] || icons.organisation;
  };

  const showPopup = (point: MapPoint) => {
    if (!map.current) return;

    if (popup.current) popup.current.remove();

    const color = getMarkerColor(point);
    const popupContent = `
      <div style="min-width: 200px; padding: 8px;">
        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
          <div style="color: ${color};">${getMarkerSvg(point.type)}</div>
          <div style="flex: 1;">
            <h3 style="font-weight: 600; font-size: 14px; margin: 0;">${point.nom}</h3>
            <span style="display: inline-block; margin-top: 4px; padding: 2px 8px; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 11px;">
              ${point.type}
            </span>
          </div>
        </div>
        ${point.type === 'agent' && point.agent ? `
          <div style="margin-bottom: 8px;">
            <div style="font-size: 12px; color: #6b7280;">
              <div><strong>Code:</strong> ${point.agent.code}</div>
              ${point.agent.telephone ? `<div><strong>Téléphone:</strong> ${point.agent.telephone}</div>` : ''}
              ${point.battery_level !== undefined ? `<div><strong>Batterie:</strong> ${point.battery_level}%</div>` : ''}
              ${point.timestamp ? `<div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Dernière mise à jour: ${new Date(point.timestamp).toLocaleString('fr-FR')}</div>` : ''}
            </div>
          </div>
        ` : ''}
        ${point.produit ? `
          <div style="margin-bottom: 8px;">
            <span style="display: inline-block; padding: 2px 8px; background-color: ${PRODUCT_COLORS[point.produit]}; color: white; border-radius: 4px; font-size: 11px;">
              ${point.produit}
            </span>
          </div>
        ` : ''}
        ${point.details ? `<p style="font-size: 12px; color: #6b7280; margin: 8px 0;">${point.details}</p>` : ''}
        <div style="font-size: 11px; color: #9ca3af; font-family: monospace; margin-top: 8px;">
          ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}
        </div>
      </div>
    `;

    popup.current = new mapboxgl.Popup({ offset: 25 })
      .setLngLat([point.longitude, point.latitude])
      .setHTML(popupContent)
      .addTo(map.current);

    popup.current.on('close', () => setSelectedPoint(null));
  };

  // Mettre à jour les marqueurs quand les points changent
  useEffect(() => {
    if (!map.current) return;

    // Supprimer les anciens marqueurs
    markers.current.forEach(m => m.remove());
    markers.current = [];

    if (points.length === 0) return;

    // Ajouter les nouveaux marqueurs
    points.forEach((point) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cursor = 'pointer';
      el.style.width = '32px';
      el.style.height = '32px';
      
      const color = getMarkerColor(point);
      el.innerHTML = `
        <div style="position: relative;">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            background-color: ${color};
            border-radius: 50%;
            opacity: 0.2;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            background-color: white;
            border-radius: 50%;
            padding: 6px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 2px solid ${color};
            color: ${color};
          ">
            ${getMarkerSvg(point.type)}
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedPoint(point);
        showPopup(point);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([point.longitude, point.latitude])
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Centrer sur un agent spécifique si demandé
    if (centerOnAgentId && map.current) {
      const agentPoint = points.find(p => p.agent?.id === centerOnAgentId);
      if (agentPoint) {
        map.current.flyTo({
          center: [agentPoint.longitude, agentPoint.latitude],
          zoom: 15,
          duration: 1000
        });
        // Ouvrir automatiquement le popup
        setTimeout(() => {
          showPopup(agentPoint);
        }, 1000);
        return;
      }
    }

    // Ajuster la vue pour inclure tous les points
    if (points.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      points.forEach(p => bounds.extend([p.longitude, p.latitude]));
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    } else if (points.length === 1) {
      map.current.flyTo({
        center: [points[0].longitude, points[0].latitude],
        zoom: 14
      });
    }
  }, [points, centerOnAgentId]);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div ref={mapContainer} style={{ height, width: '100%' }} />
      </Card>

      {showLegend && (
        <Card className="p-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Légende</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-xs">
                <p className="text-muted-foreground mb-2">Par type</p>
                <div className="space-y-1">
                  {Object.entries(TYPE_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs">
                <p className="text-muted-foreground mb-2">Par produit</p>
                <div className="space-y-1">
                  {Object.entries(PRODUCT_COLORS).map(([produit, color]) => (
                    <div key={produit} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="capitalize">{produit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
              Total: {points.length} point{points.length > 1 ? 's' : ''}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
