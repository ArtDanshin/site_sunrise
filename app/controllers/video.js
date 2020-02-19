const topicModel = require('../models/topics');
const categoryModel = require('../models/category');

const { renderCategory, renderDetail } = require('../helpers/listing_pages');

exports.category = async function(req, res) {
  const videos = await topicModel.getTopics({ type: 'video', category: req.params.category });
  const category = await categoryModel.getCategory(req.params.category);
  const VIDEO_PER_PAGE = 5;

  renderCategory({
    req,
    res,
    category,
    items: videos,
    itemsPerPage: VIDEO_PER_PAGE,
    type: 'video'
  });
};

exports.detail = async function(req, res) {
  const video = await topicModel.getTopic(req.params.videoSlug);

  renderDetail({
    res,
    item: video,
    type: 'video'
  });
};
