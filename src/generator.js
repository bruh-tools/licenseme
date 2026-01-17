const licenses = require('./licenses');

function generate(type, options = {}) {
  const license = licenses[type];
  if (!license) return null;
  
  const year = options.year || new Date().getFullYear();
  const name = options.name || 'Your Name';
  
  return license.template
    .replace(/{year}/g, year)
    .replace(/{name}/g, name);
}

function list() {
  return Object.entries(licenses).map(([key, val]) => ({
    key,
    name: val.name
  }));
}

function getTypes() {
  return Object.keys(licenses);
}

module.exports = { generate, list, getTypes, licenses };
