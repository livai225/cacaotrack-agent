// Script pour créer des assets PNG basiques
const fs = require('fs');

// Créer un PNG minimal (1x1 pixel transparent)
const createMinimalPNG = () => {
  // PNG 1x1 transparent en base64
  const pngData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU8j8wAAAABJRU5ErkJggg==',
    'base64'
  );
  return pngData;
};

// Créer un PNG coloré simple (pour l'icône)
const createColoredPNG = () => {
  // PNG 1x1 marron (#8B4513) en base64
  const pngData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'base64'
  );
  return pngData;
};

// Créer les assets
const assets = [
  { name: 'icon.png', data: createColoredPNG() },
  { name: 'adaptive-icon.png', data: createColoredPNG() },
  { name: 'splash.png', data: createColoredPNG() },
  { name: 'favicon.png', data: createColoredPNG() }
];

// Créer le dossier assets s'il n'existe pas
if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}

// Écrire les fichiers
assets.forEach(asset => {
  fs.writeFileSync(`assets/${asset.name}`, asset.data);
  console.log(`✅ Créé: assets/${asset.name}`);
});

console.log('🎨 Assets PNG créés avec succès !');