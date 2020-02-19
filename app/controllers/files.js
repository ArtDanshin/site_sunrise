const topicModel = require('../models/topics');
const categoryModel = require('../models/category');

const { renderCategory, renderDetail } = require('../helpers/listing_pages');

exports.category = async function(req, res) {
  const files = await topicModel.getTopics({ type: 'file', category: req.params.category });
  const category = await categoryModel.getCategory(req.params.category);
  const FILES_PER_PAGE = 10;

  renderCategory({
    req,
    res,
    category,
    items: files,
    itemsPerPage: FILES_PER_PAGE,
    type: 'files'
  });
};

exports.detail = async function(req, res) {
  const file = await topicModel.getTopic(req.params.fileSlug);

  renderDetail({
    res,
    item: file,
    type: 'files'
  });
};
