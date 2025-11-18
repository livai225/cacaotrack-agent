import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GPSCaptureProps {
  latitude?: number;
  longitude?: number;
  onChange: (coords: { latitude: number; longitude: number }) => void;
  required?: boolean;
}

export default function GPSCapture({ latitude, longitude, onChange, required }: GPSCaptureProps) {
  const [loading, setLoading] = useState(false);

  const handleCapture = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
        toast.success("Position GPS capturée");
      },
      (error) => {
        setLoading(false);
        toast.error("Impossible de capturer la position GPS");
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Coordonnées GPS
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      <Button
        type="button"
        onClick={handleCapture}
        disabled={loading}
        className="w-full gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        {loading ? "Capture en cours..." : "Obtenir Position GPS"}
      </Button>

      {(latitude && longitude) && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Latitude</label>
                <Input
                  value={latitude.toFixed(6)}
                  readOnly
                  className="mt-1 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Longitude</label>
                <Input
                  value={longitude.toFixed(6)}
                  readOnly
                  className="mt-1 font-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
