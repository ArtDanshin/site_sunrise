const path = require('path');
const fs = require('fs');

const { renderCategory, renderDetail } = require('../helpers/listing_pages');

exports.category = function(req, res) {
  const articlesInfo = getArticlesInfo();
  const category = articlesInfo.categories.find(cat => cat.slug === req.params.category);
  const ARTICLES_PER_PAGE = 10;

  renderCategory({
    req,
    res,
    category,
    items: articlesInfo.articles,
    itemsPerPage: ARTICLES_PER_PAGE,
    type: 'articles'
  });
};

exports.detail = function(req, res) {
  const articlesInfo = getArticlesInfo();
  const articles = articlesInfo.articles.find(file => file.slug === req.params.articleSlug);

  renderDetail({
    res,
    item: articles,
    categories: articlesInfo.categories,
    type: 'articles'
  });
};

function getArticlesInfo() {
  return JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'articles.json'), 'utf8'));
}
