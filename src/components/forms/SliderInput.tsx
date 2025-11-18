import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labels?: string[];
}

export default function SliderInput({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 3, 
  step = 1,
  labels = ["Aucun", "Faible", "Modéré", "Sévère"]
}: SliderInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className={cn(
          "text-sm font-semibold px-2 py-1 rounded",
          value === 0 && "bg-success/10 text-success",
          value === 1 && "bg-warning/10 text-warning",
          value === 2 && "bg-warning/20 text-warning",
          value === 3 && "bg-destructive/10 text-destructive"
        )}>
          {labels[value]}
        </span>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        {labels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
}
