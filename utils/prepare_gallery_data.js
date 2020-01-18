const path = require('path');
const fs = require('fs');

prepareGalleryData();

function prepareGalleryData() {
  const gallery = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'gallery.json'), 'utf8'));

  const newImages = gallery.images.map(image => ({
    slug: image.slug,
    title: image.title,
    category: image.category,
    originImageInfo: {
      filename: image.originImageInfo.filename,
      size: image.originImageInfo.size,
      height: image.originImageInfo.height,
      width: image.originImageInfo.width,
      format: image.originImageInfo.type
    },
    thumbImageInfo: {
      filename: image.thumbImageInfo.filename,
      size: image.thumbImageInfo.size,
      height: image.thumbImageInfo.height,
      width: image.thumbImageInfo.width,
      format: (image.thumbImageInfo.type === 'jpeg') ? 'jpg' : image.thumbImageInfo.type
    },
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
  }))

  fs.writeFileSync(path.join(__dirname, '..', 'db', 'gallery_new.json'), JSON.stringify({ categories: gallery.categories, images: newImages }));
}

/**
 * Преобразование строки типа 'DD.MM.YYYY hh:mm' в timestamp
 * @param dateString {string}
 * @returns {number}
 */
function parseDateToTimestamp(dateString) {
  const parsedDateArray = dateString.match(/(\d+)/g)
  return new Date(parsedDateArray[2], parseInt(parsedDateArray[1], 10) - 1, parsedDateArray[0], parsedDateArray[3], parsedDateArray[4]).getTime();
}
