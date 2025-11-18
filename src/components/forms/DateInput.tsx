import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface DateInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  max?: string;
  min?: string;
}

export default function DateInput({ label, value, onChange, required, max, min }: DateInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="relative">
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          max={max}
          min={min}
          className="pl-10"
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}
