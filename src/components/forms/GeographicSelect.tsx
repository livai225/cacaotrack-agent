import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { geographieCI, getRegions, getDepartementsByRegion, getSousPrefecturesByDepartement, getLocalitesBySousPrefecture, getAllLocalitesByRegion } from "@/data/geographieCI";
import { useEffect, useState } from "react";

interface GeographicSelectProps {
  region?: string;
  departement?: string;
  sousPrefecture?: string;
  localite?: string;
  onRegionChange: (region: string) => void;
  onDepartementChange: (departement: string) => void;
  onSousPrefectureChange: (sousPrefecture: string) => void;
  onLocaliteChange: (localite: string) => void;
  showRegion?: boolean;
  showDepartement?: boolean;
  showSousPrefecture?: boolean;
  showLocalite?: boolean;
}

export default function GeographicSelect({
  region = "",
  departement = "",
  sousPrefecture = "",
  localite = "",
  onRegionChange,
  onDepartementChange,
  onSousPrefectureChange,
  onLocaliteChange,
  showRegion = true,
  showDepartement = true,
  showSousPrefecture = true,
  showLocalite = true,
}: GeographicSelectProps) {
  const [departements, setDepartements] = useState<string[]>([]);
  const [sousPrefectures, setSousPrefectures] = useState<string[]>([]);
  const [localites, setLocalites] = useState<string[]>([]);

  useEffect(() => {
    if (region) {
      const deps = getDepartementsByRegion(region);
      setDepartements(deps);
      if (!deps.includes(departement)) {
        onDepartementChange("");
        onSousPrefectureChange("");
        onLocaliteChange("");
      }
    } else {
      setDepartements([]);
      setSousPrefectures([]);
      setLocalites([]);
    }
  }, [region]);

  useEffect(() => {
    if (region && departement) {
      const sps = getSousPrefecturesByDepartement(region, departement);
      setSousPrefectures(sps);
      if (!sps.includes(sousPrefecture)) {
        onSousPrefectureChange("");
        onLocaliteChange("");
      }
    } else {
      setSousPrefectures([]);
      setLocalites([]);
    }
  }, [region, departement]);

  useEffect(() => {
    if (region && departement && sousPrefecture) {
      const locs = getLocalitesBySousPrefecture(region, departement, sousPrefecture);
      setLocalites(locs);
      if (!locs.includes(localite)) {
        onLocaliteChange("");
      }
    } else {
      setLocalites([]);
    }
  }, [region, departement, sousPrefecture]);

  return (
    <div className="space-y-4">
      {showRegion && (
        <div>
          <Label>Région *</Label>
          <Select value={region} onValueChange={onRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une région..." />
            </SelectTrigger>
            <SelectContent>
              {getRegions().map((reg) => (
                <SelectItem key={reg} value={reg}>
                  {reg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showDepartement && (
        <div>
          <Label>Département *</Label>
          <Select 
            value={departement} 
            onValueChange={onDepartementChange}
            disabled={!region}
          >
            <SelectTrigger>
              <SelectValue placeholder={region ? "Sélectionner un département..." : "Sélectionnez d'abord une région"} />
            </SelectTrigger>
            <SelectContent>
              {departements.map((dep) => (
                <SelectItem key={dep} value={dep}>
                  {dep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showSousPrefecture && (
        <div>
          <Label>Sous-Préfecture *</Label>
          <Select 
            value={sousPrefecture} 
            onValueChange={onSousPrefectureChange}
            disabled={!departement}
          >
            <SelectTrigger>
              <SelectValue placeholder={departement ? "Sélectionner une sous-préfecture..." : "Sélectionnez d'abord un département"} />
            </SelectTrigger>
            <SelectContent>
              {sousPrefectures.map((sp) => (
                <SelectItem key={sp} value={sp}>
                  {sp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showLocalite && (
        <div>
          <Label>Localité *</Label>
          <Combobox
            options={
              localites.length > 0
                ? localites.map(loc => ({ value: loc, label: loc }))
                : geographieCI.flatMap(region => 
                    region.departements.flatMap(dep =>
                      dep.sous_prefectures.flatMap(sp =>
                        sp.localites.map(loc => ({
                          value: loc,
                          label: loc
                        }))
                      )
                    )
                  ).filter((item, index, self) => 
                    index === self.findIndex(t => t.value === item.value)
                  ).sort((a, b) => a.label.localeCompare(b.label))
            }
            value={localite}
            onValueChange={onLocaliteChange}
            placeholder={
              showSousPrefecture && sousPrefecture 
                ? "Sélectionner une localité..." 
                : showRegion && !region && showDepartement && showSousPrefecture
                ? "Sélectionnez d'abord une région, département et sous-préfecture"
                : "Sélectionner une localité..."
            }
            searchPlaceholder="Rechercher une localité..."
            emptyMessage="Aucune localité trouvée."
            disabled={showSousPrefecture && !sousPrefecture && showDepartement && !departement && showRegion && !region}
          />
        </div>
      )}
    </div>
  );
}

