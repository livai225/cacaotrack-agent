import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface MultiPhoneProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
}

export default function MultiPhone({ label, values = [], onChange, required }: MultiPhoneProps) {
  const [phones, setPhones] = useState<string[]>(values && values.length > 0 ? values : [""]);

  useEffect(() => {
    if (values && values.length > 0) {
      setPhones(values);
    }
  }, [values]);

  const handleAdd = () => {
    const newPhones = [...phones, ""];
    setPhones(newPhones);
    onChange(newPhones);
  };

  const handleRemove = (index: number) => {
    const newPhones = phones.filter((_, i) => i !== index);
    setPhones(newPhones);
    onChange(newPhones);
  };

  const handleChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
    onChange(newPhones);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      {phones.map((phone, index) => (
        <div key={index} className="flex gap-2">
          <Input
            type="tel"
            placeholder="Ex: +225 07 XX XX XX XX"
            value={phone}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-1"
          />
          {phones.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Ajouter un numéro
      </Button>
    </div>
  );
}
