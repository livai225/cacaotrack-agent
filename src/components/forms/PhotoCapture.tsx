import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, X, Upload, Image as ImageIcon } from "lucide-react";

interface PhotoCaptureProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

// Fonction pour compresser l'image
const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionner si nécessaire
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en base64 avec compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function PhotoCapture({ label, value, onChange, required }: PhotoCaptureProps) {
  const [preview, setPreview] = useState<string>(value || "");

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compresser l'image avant de la sauvegarder
        const compressedImage = await compressImage(file);
        setPreview(compressedImage);
        onChange(compressedImage);
      } catch (error) {
        console.error("Erreur lors de la compression de l'image:", error);
        // Fallback : utiliser l'image originale
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPreview(result);
          onChange(result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      {preview ? (
        <Card className="relative overflow-hidden">
          <img 
            src={preview} 
            alt={label} 
            className="w-full h-64 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 shadow-lg"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors border-2 border-dashed">
            <div className="flex flex-col items-center justify-center h-48 gap-4 p-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-1">
                  Ajouter une photo
                </p>
                <p className="text-xs text-muted-foreground">
                  Sélectionnez une option ci-dessous
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {/* Bouton Caméra */}
            <label className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                asChild
              >
                <span className="cursor-pointer">
                  <Camera className="h-4 w-4" />
                  Caméra
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Bouton Galerie */}
            <label className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                asChild
              >
                <span className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Galerie
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
