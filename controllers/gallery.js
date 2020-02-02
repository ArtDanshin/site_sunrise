const path = require('path');
const fs = require('fs');

exports.category = function(req, res) {
  const gallery = getGalleriesInfo();
  const category = gallery.categories.find(cat => cat.slug === req.params.category);
  const IMAGES_PER_PAGE = 16;

  if (category) {
    const pageNumber = req.params.page && parseInt(req.params.page);

    if (pageNumber) {
      const images = gallery.images.filter(image => image.category.includes(req.params.category));
      const totalImages = images.length;

      if (totalImages) {
        const numberOfFirstImageOnPage = (pageNumber - 1) ? IMAGES_PER_PAGE * (pageNumber - 1): 0;

        if (images[numberOfFirstImageOnPage]) {
          const urlToCategory = `/gallery/${req.params.category}/1`;

          res.render('gallery/category', {
            pageTitle: category.title,
            currentPage: pageNumber,
            imagesPerPage: IMAGES_PER_PAGE,
            totalImages,
            urlToCategory,
            images: images.splice(numberOfFirstImageOnPage, IMAGES_PER_PAGE)
          });
        } else {
          res.status(404).end()
        }
      } else {
        res.render('under_construction', {
          pageTitle: category.title
        });
      }
    } else {
      let url = req.originalUrl;
      if (url.substr(-1) != '/') url += '/';

      res.redirect(url + '1');
    }
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
