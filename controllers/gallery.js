const path = require('path');
const fs = require('fs');

exports.category = function(req, res) {
  const gallery = getGalleriesInfo();
  const category = gallery.categories.find(cat => cat.slug === req.params.category);

  if (category) {
    res.render('gallery/category', {
      pageTitle: category.title,
      images: gallery.images.filter(image => image.category.includes(req.params.category))
    });
  } else {
    res.status(404).end()
  }
};

exports.image = function(req, res) {
  const gallery = getGalleriesInfo();
  const image = gallery.images.find(image => image.slug === req.params.image);

  if (image) {
    const category = gallery.categories.find(cat => cat.slug === image.category[0]);
    const otherPhotos = gallery.images.filter(otherImage => otherImage.category[0] === image.category[0]);
    const indexImageOfOtherImage = otherPhotos.findIndex(otherImage => otherImage.slug === image.slug);
    let finalOtherImages = [];

    if (indexImageOfOtherImage === 0) {
      finalOtherImages = [
        otherPhotos[otherPhotos.length - 1],
        image,
        otherPhotos[indexImageOfOtherImage + 1]
      ]
    } else if (indexImageOfOtherImage === otherPhotos.length - 1) {
      finalOtherImages = [
        otherPhotos[indexImageOfOtherImage - 1],
        image,
        otherPhotos[0]
      ]
    } else {
      finalOtherImages = [
        otherPhotos[indexImageOfOtherImage - 1],
        image,
        otherPhotos[indexImageOfOtherImage + 1]
      ]
    }

    res.render('gallery/detail', {
      pageTitle: category.title,
      image,
      otherImages: finalOtherImages
    });
  } else {
    res.status(404).end()
  }
};

function getGalleriesInfo() {
  return JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'gallery.json'), 'utf8'));
}
