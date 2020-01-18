const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');

sorting_images();

function sorting_images() {
  const gallery = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'oldsite_gallery.json'), 'utf8'));

  const newImages = gallery.images.map((image, index) => {
    const pathToImageFolder = path.join(__dirname, '..', 'public', 'images', 'gallery', image.category);
    const imageNumber = (image.url) ? image.url.split('-').reverse()[0] : null;
    const oldFileInfo = [
      check_and_get_size_image(pathToImageFolder, image.slug + '.jpg'),
      check_and_get_size_image(pathToImageFolder, image.slug + '.png'),
      check_and_get_size_image(pathToImageFolder, `${image.slug}_${imageNumber}.jpg`),
      check_and_get_size_image(pathToImageFolder, `${image.slug}_${imageNumber}.png`),
    ].filter(Boolean)[0];

    const newFilename = `${index}_${image.slug}.${oldFileInfo.filename.split('.')[1]}`;
    const newGalleryFolder = path.join(__dirname, '..', 'public', 'images', 'gallery_new');

    fs.copyFileSync(path.join(pathToImageFolder, oldFileInfo.filename), path.join(newGalleryFolder, newFilename));

    return {
      slug: `${index}_${image.slug}`,
      title: image.title,
      category: [image.category],
      originImageInfo: {
        ...oldFileInfo,
        filename: newFilename
      },
      views: image.views,
      rating: image.rating,
      comments: image.comments
    };
  });

  fs.writeFileSync(path.join(__dirname, '..', 'db', 'gallery_new.json'), JSON.stringify({ categories: gallery.categories, images: newImages }));
}

function check_and_get_size_image(folder, filename) {
  try {
    const stats = fs.statSync(path.join(folder, filename));

    return {
      filename,
      size: stats.size,
      ...sizeOf(path.join(folder, filename))
    };
  } catch {
    return null;
  }
}