const path = require('path');
const fs = require('fs');

const { renderCategory, renderDetail } = require('../helpers/listing_pages');

exports.category = function(req, res) {
  const filesInfo = getFilesInfo();
  const category = filesInfo.categories.find(cat => cat.slug === req.params.category);
  const FILES_PER_PAGE = 10;

  renderCategory({
    req,
    res,
    category,
    items: filesInfo.files,
    itemsPerPage: FILES_PER_PAGE,
    type: 'files'
  });
};

exports.detail = function(req, res) {
  const filesInfo = getFilesInfo();
  const file = filesInfo.files.find(file => file.slug === req.params.fileSlug);

  renderDetail({
    res,
    item: file,
    categories: filesInfo.categories,
    type: 'files'
  });
};

function getFilesInfo() {
  return JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'files.json'), 'utf8'));
}
