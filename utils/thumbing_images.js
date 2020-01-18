const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

resizing_images();

function resizing_images() {
  const gallery = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'gallery.json'), 'utf8'));
  const pathToImageFolder = path.join(__dirname, '..', 'public', 'images', 'gallery_new');
  const pathToThumbFolder = path.join(pathToImageFolder, 'thumb');

  const THUMB_WIDTH = 200;
  const THUMB_HEIGHT = 150;

  if (!fs.existsSync(pathToThumbFolder)) {
    fs.mkdirSync(pathToThumbFolder, { recursive: true });
  }

  const newImagesProcess = Promise.all(gallery.images.map(async (image) => {
    let thumbImageInfo = {};
    const pathToOriginalImage = path.join(pathToImageFolder, image.originImageInfo.filename);
    const pathToThumbImage = path.join(pathToThumbFolder, image.originImageInfo.filename);

    if (image.originImageInfo.width < THUMB_WIDTH && image.originImageInfo.height < THUMB_HEIGHT) {
      fs.copyFileSync(pathToOriginalImage, pathToThumbImage);

      thumbImageInfo = image.originImageInfo;
    } else {
      await sharp(pathToOriginalImage)
        .resize({
          width: 200,
          height: 150,
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFile(pathToThumbImage)
        .then(data => {
          thumbImageInfo = {
            filename: image.originImageInfo.filename,
            size: data.size,
            height: data.height,
            width: data.width,
            type: data.format
          };
        });
    }

    return {
      ...image,
      thumbImageInfo
    };
  }));

  newImagesProcess.then((images) => {
    fs.writeFileSync(path.join(__dirname, '..', 'db', 'gallery_new.json'), JSON.stringify({ categories: gallery.categories, images }));
  })
}
