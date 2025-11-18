import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, X, Upload } from "lucide-react";

interface PhotoCaptureProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function PhotoCapture({ label, value, onChange, required }: PhotoCaptureProps) {
  const [preview, setPreview] = useState<string>(value || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
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
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <label className="block">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                <span>Cliquer pour ajouter une photo</span>
              </div>
            </div>
          </Card>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
