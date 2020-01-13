const path = require('path');
const fs = require('fs');

exports.category = function(req, res) {
  const gallery = getGalleriesInfo();
  const category = gallery.categories.find(cat => cat.slug === req.params.category);

  if (category) {
    res.render('gallery/category', {
      pageTitle: category.title,
      images: gallery.images.filter(image => image.category === req.params.category)
    });
  } else {
    res.status(404).end()
  }
};

exports.image = function(req, res) {
  res.render('gallery/image', { pageTitle: '' });
};

function getGalleriesInfo() {
  return JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'gallery.json'), 'utf8'));
}
