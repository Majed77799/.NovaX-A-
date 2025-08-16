const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, { isMonorepo: true });

module.exports = config;