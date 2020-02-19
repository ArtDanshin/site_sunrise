const path = require('path');
const fs = require('fs');
const util = require('util');

exports.getCategory = async function(slug) {
  const reader = util.promisify(fs.readFile);
  let allCategories = await reader(path.join(appRoot, 'db', 'categories.json'), 'utf8');
  allCategories = JSON.parse(allCategories);

  return allCategories.find(category => category.slug === slug);
};
