const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

module.exports = mergeConfig(config, {
  // Ajoutez ici des configurations Metro supplémentaires si nécessaire
});