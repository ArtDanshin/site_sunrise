const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');
const sharp = require('sharp');

fixImageInfo('2_lod_wallpaper_6');

/**
 * Если нужно поправить информацию об определенной картинке или переконвертировать ее
 * то эта функция поможет
 * @param slug {string}
 */
function fixImageInfo(slug) {
  const gallery = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'gallery.json'), 'utf8'));
  const pathToImageFolder = path.join(__dirname, '..', 'public', 'images', 'gallery');
  const pathToThumbFolder = path.join(pathToImageFolder, 'thumb');

  const THUMB_WIDTH = 200;
  const THUMB_HEIGHT = 150;

  if (!fs.existsSync(pathToThumbFolder)) {
    fs.mkdirSync(pathToThumbFolder, { recursive: true });
  }

  const newImagesProcess = Promise.all(gallery.images.map(async (image) => {
    if (image.slug === slug) {
      const pathToOriginalImage = path.join(pathToImageFolder, image.originImageInfo.filename);
      const pathToThumbImage = path.join(pathToThumbFolder, image.originImageInfo.filename);

      const originFileInfo = sizeOf(pathToOriginalImage);
      const stats = fs.statSync(pathToOriginalImage);
      const originImageInfo = {
        filename: image.originImageInfo.filename,
        size: stats.size,
        height: originFileInfo.height,
        width: originFileInfo.width,
        format: originFileInfo.type
      };
      let thumbImageInfo = {};

      if (originImageInfo.width < THUMB_WIDTH && originImageInfo.height < THUMB_HEIGHT) {
        fs.copyFileSync(pathToOriginalImage, pathToThumbImage);

        thumbImageInfo = originImageInfo;
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
              format: (data.format === 'jpeg') ? 'jpg' : data.format
            };
          });
      }

      return {
        slug: image.slug,
        title: image.title,
        category: image.category,
        originImageInfo,
        thumbImageInfo,
        views: parseInt(image.views, 10),
        rating: parseFloat(image.rating),
        comments: image.comments.map(comment => ({
          message: comment.message,
          date: parseDateToTimestamp(comment.date),
          rating: comment.rating,
          userInfo: {
            name: comment.userInfo.name,
            avatar: {
              ...comment.userInfo.avatar,
              height: comment.userInfo.avatar.width
            }
          }
        }))
      };
    }

    return image;
  }));

  newImagesProcess.then((images) => {
    fs.writeFileSync(path.join(__dirname, '..', 'db', 'gallery_new.json'), JSON.stringify({ categories: gallery.categories, images }));
  })
}