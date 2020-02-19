const topicModel = require('../models/topics');
const categoryModel = require('../models/category');

const { renderCategory } = require('../helpers/listing_pages');

exports.category = async function(req, res) {
  const images = await topicModel.getTopics({ type: 'image', category: req.params.category });
  const category = await categoryModel.getCategory(req.params.category);
  const IMAGES_PER_PAGE = 16;

  renderCategory({
    req,
    res,
    category,
    items: images,
    itemsPerPage: IMAGES_PER_PAGE,
    type: 'gallery'
  });
};

exports.image = async function(req, res) {
  const image = await topicModel.getTopic(req.params.image);

  if (image) {
    const category = await categoryModel.getCategory(image.category[0]);
    const otherImages = await topicModel.getTopics({ type: 'image', category: image.category[0] });
    const indexImageOfOtherImage = otherImages.findIndex(otherImage => otherImage.slug === image.slug);
    let finalOtherImages = [];

    if (indexImageOfOtherImage === 0) {
      finalOtherImages = [
        otherImages[otherImages.length - 1],
        image,
        otherImages[indexImageOfOtherImage + 1]
      ]
    } else if (indexImageOfOtherImage === otherImages.length - 1) {
      finalOtherImages = [
        otherImages[indexImageOfOtherImage - 1],
        image,
        otherImages[0]
      ]
    } else {
      finalOtherImages = [
        otherImages[indexImageOfOtherImage - 1],
        image,
        otherImages[indexImageOfOtherImage + 1]
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
