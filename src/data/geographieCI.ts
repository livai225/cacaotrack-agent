// Données géographiques de la Côte d'Ivoire
// Structure hiérarchique : Région > Département > Sous-Préfecture > Localité

export interface Localite {
  nom: string;
}

export interface SousPrefecture {
  nom: string;
  localites: string[];
}

export interface Departement {
  nom: string;
  sous_prefectures: SousPrefecture[];
}

export interface Region {
  nom: string;
  departements: Departement[];
}

export const geographieCI: Region[] = [
  {
    nom: "Abidjan",
    departements: [
      {
        nom: "Abidjan",
        sous_prefectures: [
          { nom: "Abidjan", localites: ["Cocody", "Yopougon", "Abobo", "Adjamé", "Attécoubé", "Marcory", "Port-Bouët", "Treichville", "Koumassi", "Anyama"] }
        ]
      }
    ]
  },
  {
    nom: "Yamoussoukro",
    departements: [
      {
        nom: "Yamoussoukro",
        sous_prefectures: [
          { nom: "Yamoussoukro", localites: ["Yamoussoukro", "Attiégouakro", "Lolobo"] }
        ]
      }
    ]
  },
  {
    nom: "Lôh-Djiboua",
    departements: [
      {
        nom: "Divo",
        sous_prefectures: [
          { nom: "Divo", localites: ["Divo", "Lakota", "Guitry", "Hiré", "Zéko"] },
          { nom: "Lakota", localites: ["Lakota", "Dagbego", "Gohi"] },
          { nom: "Guéyo", localites: ["Guéyo", "Béoumi", "Kouassi-Kouassikro"] }
        ]
      },
      {
        nom: "Gagnoa",
        sous_prefectures: [
          { nom: "Gagnoa", localites: ["Gagnoa", "Ouragahio", "Bayota"] },
          { nom: "Oumé", localites: ["Oumé", "Dahiépa", "Kouassi-Kouassikro"] }
        ]
      }
    ]
  },
  {
    nom: "Haut-Sassandra",
    departements: [
      {
        nom: "Daloa",
        sous_prefectures: [
          { nom: "Daloa", localites: ["Daloa", "Gonaté", "Zaïbo"] },
          { nom: "Issia", localites: ["Issia", "Vavoua", "Zoukougbeu"] },
          { nom: "Vavoua", localites: ["Vavoua", "Béoumi", "Kouassi-Kouassikro"] }
        ]
      }
    ]
  },
  {
    nom: "Gbêkê",
    departements: [
      {
        nom: "Bouaké",
        sous_prefectures: [
          { nom: "Bouaké", localites: ["Bouaké", "Sakassou", "Béoumi"] },
          { nom: "Sakassou", localites: ["Sakassou", "Kouassi-Kouassikro"] },
          { nom: "Béoumi", localites: ["Béoumi", "Kouassi-Kouassikro"] }
        ]
      }
    ]
  },
  {
    nom: "Gôh",
    departements: [
      {
        nom: "Gagnoa",
        sous_prefectures: [
          { nom: "Gagnoa", localites: ["Gagnoa", "Ouragahio", "Bayota"] },
          { nom: "Oumé", localites: ["Oumé", "Dahiépa"] }
        ]
      }
    ]
  },
  {
    nom: "Indénié-Djuablin",
    departements: [
      {
        nom: "Abengourou",
        sous_prefectures: [
          { nom: "Abengourou", localites: ["Abengourou", "Agnibilékrou", "Bettié"] },
          { nom: "Agnibilékrou", localites: ["Agnibilékrou", "Bettié"] }
        ]
      }
    ]
  },
  {
    nom: "San-Pédro",
    departements: [
      {
        nom: "San-Pédro",
        sous_prefectures: [
          { nom: "San-Pédro", localites: ["San-Pédro", "Grand-Béréby", "Tabou"] },
          { nom: "Sassandra", localites: ["Sassandra", "Grand-Béréby"] }
        ]
      }
    ]
  },
  {
    nom: "Cavally",
    departements: [
      {
        nom: "Guiglo",
        sous_prefectures: [
          { nom: "Guiglo", localites: ["Guiglo", "Toulepleu", "Bloléquin"] },
          { nom: "Toulepleu", localites: ["Toulepleu", "Bloléquin"] }
        ]
      }
    ]
  },
  {
    nom: "Guémon",
    departements: [
      {
        nom: "Duékoué",
        sous_prefectures: [
          { nom: "Duékoué", localites: ["Duékoué", "Bangolo", "Kouibly"] },
          { nom: "Bangolo", localites: ["Bangolo", "Kouibly"] }
        ]
      }
    ]
  },
  {
    nom: "Tonkpi",
    departements: [
      {
        nom: "Man",
        sous_prefectures: [
          { nom: "Man", localites: ["Man", "Danané", "Zouan-Hounien"] },
          { nom: "Danané", localites: ["Danané", "Zouan-Hounien"] }
        ]
      }
    ]
  },
  {
    nom: "Poro",
    departements: [
      {
        nom: "Korhogo",
        sous_prefectures: [
          { nom: "Korhogo", localites: ["Korhogo", "Ferkessédougou", "Sinématiali"] },
          { nom: "Ferkessédougou", localites: ["Ferkessédougou", "Sinématiali"] }
        ]
      }
    ]
  },
  {
    nom: "Gbôklé",
    departements: [
      {
        nom: "Sassandra",
        sous_prefectures: [
          { nom: "Sassandra", localites: ["Sassandra", "Grand-Béréby"] }
        ]
      }
    ]
  },
  {
    nom: "Nawa",
    departements: [
      {
        nom: "Soubré",
        sous_prefectures: [
          { nom: "Soubré", localites: ["Soubré", "Buyo", "Méagui"] },
          { nom: "Buyo", localites: ["Buyo", "Méagui"] }
        ]
      }
    ]
  },
  {
    nom: "Marahoué",
    departements: [
      {
        nom: "Bouaflé",
        sous_prefectures: [
          { nom: "Bouaflé", localites: ["Bouaflé", "Sinfra", "Zuenoula"] },
          { nom: "Sinfra", localites: ["Sinfra", "Zuenoula"] }
        ]
      }
    ]
  },
  {
    nom: "Hambol",
    departements: [
      {
        nom: "Katiola",
        sous_prefectures: [
          { nom: "Katiola", localites: ["Katiola", "Niakaramandougou", "Toumodi"] },
          { nom: "Niakaramandougou", localites: ["Niakaramandougou", "Toumodi"] }
        ]
      }
    ]
  },
  {
    nom: "Gontougo",
    departements: [
      {
        nom: "Bondoukou",
        sous_prefectures: [
          { nom: "Bondoukou", localites: ["Bondoukou", "Tanda", "Koun-Fao"] },
          { nom: "Tanda", localites: ["Tanda", "Koun-Fao"] }
        ]
      }
    ]
  },
  {
    nom: "Bounkani",
    departements: [
      {
        nom: "Bouna",
        sous_prefectures: [
          { nom: "Bouna", localites: ["Bouna", "Téhini", "Nassian"] },
          { nom: "Téhini", localites: ["Téhini", "Nassian"] }
        ]
      }
    ]
  },
  {
    nom: "Tchologo",
    departements: [
      {
        nom: "Ferkessédougou",
        sous_prefectures: [
          { nom: "Ferkessédougou", localites: ["Ferkessédougou", "Kong", "Ouangolodougou"] },
          { nom: "Kong", localites: ["Kong", "Ouangolodougou"] }
        ]
      }
    ]
  },
  {
    nom: "Bagoué",
    departements: [
      {
        nom: "Boundiali",
        sous_prefectures: [
          { nom: "Boundiali", localites: ["Boundiali", "Kouto", "Tengréla"] },
          { nom: "Kouto", localites: ["Kouto", "Tengréla"] }
        ]
      }
    ]
  },
  {
    nom: "Bafing",
    departements: [
      {
        nom: "Touba",
        sous_prefectures: [
          { nom: "Touba", localites: ["Touba", "Kani", "Madinani"] },
          { nom: "Kani", localites: ["Kani", "Madinani"] }
        ]
      }
    ]
  },
  {
    nom: "Worodougou",
    departements: [
      {
        nom: "Séguéla",
        sous_prefectures: [
          { nom: "Séguéla", localites: ["Séguéla", "Mankono", "Kani"] },
          { nom: "Mankono", localites: ["Mankono", "Kani"] }
        ]
      }
    ]
  },
  {
    nom: "Béré",
    departements: [
      {
        nom: "Mankono",
        sous_prefectures: [
          { nom: "Mankono", localites: ["Mankono", "Kani", "Kounahiri"] },
          { nom: "Kounahiri", localites: ["Kounahiri"] }
        ]
      }
    ]
  },
  {
    nom: "Folon",
    departements: [
      {
        nom: "Minignan",
        sous_prefectures: [
          { nom: "Minignan", localites: ["Minignan", "Kani", "Madinani"] }
        ]
      }
    ]
  },
  {
    nom: "Kabadougou",
    departements: [
      {
        nom: "Odienné",
        sous_prefectures: [
          { nom: "Odienné", localites: ["Odienné", "Madinani", "Samatiguila"] },
          { nom: "Madinani", localites: ["Madinani", "Samatiguila"] }
        ]
      }
    ]
  },
  {
    nom: "Sud-Comoé",
    departements: [
      {
        nom: "Aboisso",
        sous_prefectures: [
          { nom: "Aboisso", localites: ["Aboisso", "Adiaké", "Grand-Bassam"] },
          { nom: "Adiaké", localites: ["Adiaké", "Grand-Bassam"] }
        ]
      }
    ]
  },
  {
    nom: "Grands-Ponts",
    departements: [
      {
        nom: "Grand-Bassam",
        sous_prefectures: [
          { nom: "Grand-Bassam", localites: ["Grand-Bassam", "Bingerville", "Bonoua"] },
          { nom: "Bingerville", localites: ["Bingerville", "Bonoua"] }
        ]
      }
    ]
  },
  {
    nom: "La Mé",
    departements: [
      {
        nom: "Adzopé",
        sous_prefectures: [
          { nom: "Adzopé", localites: ["Adzopé", "Akoupé", "Alépé"] },
          { nom: "Akoupé", localites: ["Akoupé", "Alépé"] }
        ]
      }
    ]
  },
  {
    nom: "Moronou",
    departements: [
      {
        nom: "Bongouanou",
        sous_prefectures: [
          { nom: "Bongouanou", localites: ["Bongouanou", "Arrah", "M'Batto"] },
          { nom: "Arrah", localites: ["Arrah", "M'Batto"] }
        ]
      }
    ]
  },
  {
    nom: "Iffou",
    departements: [
      {
        nom: "Daoukro",
        sous_prefectures: [
          { nom: "Daoukro", localites: ["Daoukro", "M'Batto", "Anoumaba"] },
          { nom: "M'Batto", localites: ["M'Batto", "Anoumaba"] }
        ]
      }
    ]
  },
  {
    nom: "N'Zi",
    departements: [
      {
        nom: "Dimbokro",
        sous_prefectures: [
          { nom: "Dimbokro", localites: ["Dimbokro", "Bocanda", "Kouassi-Kouassikro"] },
          { nom: "Bocanda", localites: ["Bocanda", "Kouassi-Kouassikro"] }
        ]
      }
    ]
  },
  {
    nom: "Agnéby-Tiassa",
    departements: [
      {
        nom: "Agboville",
        sous_prefectures: [
          { nom: "Agboville", localites: ["Agboville", "Tiassalé", "Azaguié"] },
          { nom: "Tiassalé", localites: ["Tiassalé", "Azaguié"] }
        ]
      }
    ]
  },
  {
    nom: "Moyen-Cavally",
    departements: [
      {
        nom: "Guiglo",
        sous_prefectures: [
          { nom: "Guiglo", localites: ["Guiglo", "Toulepleu", "Bloléquin"] }
        ]
      }
    ]
  }
];

// Fonctions utilitaires pour accéder aux données
export const getRegions = (): string[] => {
  return geographieCI.map(r => r.nom);
};

export const getDepartementsByRegion = (regionNom: string): string[] => {
  const region = geographieCI.find(r => r.nom === regionNom);
  if (!region) return [];
  return region.departements.map(d => d.nom);
};

export const getSousPrefecturesByDepartement = (regionNom: string, departementNom: string): string[] => {
  const region = geographieCI.find(r => r.nom === regionNom);
  if (!region) return [];
  const departement = region.departements.find(d => d.nom === departementNom);
  if (!departement) return [];
  return departement.sous_prefectures.map(sp => sp.nom);
};

export const getLocalitesBySousPrefecture = (regionNom: string, departementNom: string, sousPrefectureNom: string): string[] => {
  const region = geographieCI.find(r => r.nom === regionNom);
  if (!region) return [];
  const departement = region.departements.find(d => d.nom === departementNom);
  if (!departement) return [];
  const sousPrefecture = departement.sous_prefectures.find(sp => sp.nom === sousPrefectureNom);
  if (!sousPrefecture) return [];
  return sousPrefecture.localites;
};

// Fonction pour obtenir toutes les localités d'une région
export const getAllLocalitesByRegion = (regionNom: string): string[] => {
  const region = geographieCI.find(r => r.nom === regionNom);
  if (!region) return [];
  const localites: string[] = [];
  region.departements.forEach(dep => {
    dep.sous_prefectures.forEach(sp => {
      localites.push(...sp.localites);
    });
  });
  return [...new Set(localites)]; // Supprimer les doublons
};

// Fonction pour obtenir toutes les localités avec leurs informations complètes
export const getAllLocalitesOptions = (): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  const seen = new Set<string>();
  
  geographieCI.forEach(region => {
    region.departements.forEach(dep => {
      dep.sous_prefectures.forEach(sp => {
        sp.localites.forEach(loc => {
          if (!seen.has(loc)) {
            seen.add(loc);
            options.push({
              value: loc,
              label: loc
            });
          }
        });
      });
    });
  });
  
  return options.sort((a, b) => a.label.localeCompare(b.label));
};

