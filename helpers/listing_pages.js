exports.renderCategory = function({ req, res, category, items, itemsPerPage, type }) {
  if (category) {
    const pageNumber = req.params.page && parseInt(req.params.page);

    if (pageNumber) {
      const filteredItems = items.filter(file => file.category.includes(req.params.category));
      const totalItems = filteredItems.length;

      if (totalItems) {
        const numberOfFirstFileOnPage = (pageNumber - 1) ? itemsPerPage * (pageNumber - 1): 0;

        if (filteredItems[numberOfFirstFileOnPage]) {
          const urlToCategory = `/${type}/${req.params.category}/`;

          res.render('listings/category', {
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

exports.renderDetail = function({ res, item, categories, type }) {
  if (item) {
    if (item.mainBody) {
      const category = categories.find(cat => cat.slug === item.category[0]);

      res.render(`listings/detail`, {
        type,
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
}
