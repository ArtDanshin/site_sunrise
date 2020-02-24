const topicModel = require('../models/topics');
const categoryModel = require('../models/category');

const ITEMS_PER_PAGE = {
  gallery: 16,
  video: 5,
  default: 10
};

const TOPIC_TYPES = {
  articles: 'article',
  files: 'file',
  gallery: 'image'
};

const TEMPLATE_TYPE = {
  gallery: 'gallery',
  default: 'listings'
};

exports.category = async function(req, res) {
  const type = req.params.type;
  const items = await topicModel.getTopics({
    type: TOPIC_TYPES[type] || type,
    category: req.params.category });
  const category = await categoryModel.getCategory(req.params.category);

  if (category) {
    const pageNumber = req.params.page && parseInt(req.params.page);

    if (pageNumber) {
      const filteredItems = items.filter(file => file.category.includes(req.params.category));
      const totalItems = filteredItems.length;
      const itemsPerPage = ITEMS_PER_PAGE[type] || ITEMS_PER_PAGE['default'];

      if (totalItems) {
        const numberOfFirstFileOnPage = (pageNumber - 1) ? itemsPerPage * (pageNumber - 1): 0;

        if (filteredItems[numberOfFirstFileOnPage]) {
          const urlToCategory = `/${type}/${req.params.category}/`;

          res.render(`${TEMPLATE_TYPE[type] || TEMPLATE_TYPE['default']}/category`, {
            theme: category.theme,
            type,
            pageTitle: category.title,
            currentPage: pageNumber,
            itemsPerPage,
            totalItems,
            urlToCategory,
            items: filteredItems.splice(numberOfFirstFileOnPage, itemsPerPage)
          });
        } else {
          res.status(404).end()
        }
      } else {
        res.render('under_construction', {
          theme: category.theme,
          pageTitle: category.title
        });
      }
    } else {
      let url = req.originalUrl;
      if (url.substr(-1) != '/') url += '/';

      res.redirect(url + '1');
    }
  } else {
    res.status(404).end()
  }
};

exports.detail = async function(req, res) {
  const item = await topicModel.getTopic(req.params.slug);

  if (item) {
    if (item.mainBody) {
      const category = await categoryModel.getCategory(item.category[0]);

      res.render(`listings/detail`, {
        theme: category.theme,
        type: req.params.type,
        pageTitle: item.title,
        item,
        category
      });
    } else {
      res.render('under_construction', {
        pageTitle: item.title
      });
    }
  } else {
    res.status(404).end()
  }
};
