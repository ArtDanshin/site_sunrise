const topicModel = require('../models/topics');
const categoryModel = require('../models/category');

const { renderCategory, renderDetail } = require('../helpers/listing_pages');

exports.category = async function(req, res) {
  const articles = await topicModel.getTopics({ type: 'article', category: req.params.category });
  const category = await categoryModel.getCategory(req.params.category);
  const ARTICLES_PER_PAGE = 10;

  renderCategory({
    req,
    res,
    category,
    items: articles,
    itemsPerPage: ARTICLES_PER_PAGE,
    type: 'articles'
  });
};

exports.detail = async function(req, res) {
  const article = await topicModel.getTopic(req.params.articleSlug);

  renderDetail({
    res,
    item: article,
    type: 'articles'
  });
};
