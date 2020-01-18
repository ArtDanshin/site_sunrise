const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');
const sharp = require('sharp');

moveShanaImages();

/**
 * Импорт картинок Shakugan no Shana в базу
 */
async function moveShanaImages() {
  const gallery = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'gallery.json'), 'utf8'));
  let imagesCount = gallery.images.length;
  let newImages = [];
  let newCategories = [];

  const pathToImageFolder = path.join(__dirname, '..', 'public', 'images', 'gallery');
  const pathToThumbFolder = path.join(pathToImageFolder, 'thumb');

  const pathToShanaImageFolder = path.join(__dirname, '..', 'public', 'images', 'gallery_shana');

  const THUMB_WIDTH = 200;
  const THUMB_HEIGHT = 150;

  if (!fs.existsSync(pathToThumbFolder)) {
    fs.mkdirSync(pathToThumbFolder, { recursive: true });
  }

  const categories = fs.readdirSync(pathToShanaImageFolder, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const categoryName of categories) {
    const filenamesOfShanaImages = fs.readdirSync(path.join(pathToShanaImageFolder, categoryName), { withFileTypes: true })
      .filter(dirent => !dirent.isDirectory())
      .map(dirent => dirent.name);

    const shanaImagesInfo = await Promise.all(filenamesOfShanaImages.map(async imageFilename => {
      const newImageSlug = `${imagesCount++}_${categoryName}`;

      const pathToImage = path.join(pathToShanaImageFolder, categoryName, imageFilename);
      const originFileInfo = sizeOf(pathToImage);
      const stats = fs.statSync(pathToImage);
      const originImageInfo = {
        filename: `${newImageSlug}.${originFileInfo.type}`,
        size: stats.size,
        height: originFileInfo.height,
        width: originFileInfo.width,
        format: originFileInfo.type
      };
      let thumbImageInfo = {};

      const pathToNewOriginShanaImage = path.join(pathToImageFolder, originImageInfo.filename);
      const pathToNewThumbShanaImage = path.join(pathToImageFolder, 'thumb', originImageInfo.filename);

      if (originImageInfo.width < THUMB_WIDTH && originImageInfo.height < THUMB_HEIGHT) {
        fs.copyFileSync(pathToImage, pathToNewThumbShanaImage);

        thumbImageInfo = originImageInfo;
      } else {
        await sharp(pathToImage)
          .resize({
            width: 200,
            height: 150,
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFile(pathToNewThumbShanaImage)
          .then(data => {
            thumbImageInfo = {
              filename: originImageInfo.filename,
              size: data.size,
              height: data.height,
              width: data.width,
              format: (data.format === 'jpeg') ? 'jpg' : data.format
            };
          });
      }

      fs.copyFileSync(pathToImage, pathToNewOriginShanaImage);

      return {
        slug: newImageSlug,
        title: newImageSlug,
        category: [categoryName],
        originImageInfo,
        thumbImageInfo,
        views: 0,
        rating: 0,
        comments: []
      };
    }));

    newImages.push(...shanaImagesInfo);
    newCategories.push({
      slug: categoryName,
      title: categoryName,
      description: ''
    })
  }

  fs.writeFileSync(path.join(__dirname, '..', 'db', 'gallery_new.json'), JSON.stringify({
    categories: [...gallery.categories, ...newCategories],
    images: [...gallery.images, ...newImages]
  }));
}