const path = require('path');
const fs = require('fs');

exports.category = function(req, res) {
  const filesInfo = getFilesInfo();
  const category = filesInfo.categories.find(cat => cat.slug === req.params.category);
  const FILES_PER_PAGE = 10;

  if (category) {
    const pageNumber = req.params.page && parseInt(req.params.page);

    if (pageNumber) {
      const files = filesInfo.files.filter(file => file.category.includes(req.params.category));
      const totalFiles = files.length;

      if (totalFiles) {
        const numberOfFirstFileOnPage = (pageNumber - 1) ? FILES_PER_PAGE * (pageNumber - 1): 0;

        if (files[numberOfFirstFileOnPage]) {
          const urlToCategory = `/files/${req.params.category}/`;

          res.render('files/category', {
            pageTitle: category.title,
            currentPage: pageNumber,
            filesPerPage: FILES_PER_PAGE,
            totalFiles,
            urlToCategory,
            files: files.splice(numberOfFirstFileOnPage, FILES_PER_PAGE)
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

exports.detail = function(req, res) {
  // const filesInfo = getFilesInfo();
  // const video = filesInfo.files.find(video => video.slug === req.params.videoSlug);
  //
  // if (video) {
  //   if (video.mainBody) {
  //     const category = filesInfo.categories.find(cat => cat.slug === video.category[0]);
  //
  //     res.render('video/detail', {
  //       pageTitle: video.title,
  //       video,
  //       category
  //     });
  //   } else {
  //     res.render('under_construction', {
  //       pageTitle: video.title
  //     });
  //   }
  // } else {
  //   res.status(404).end()
  // }
};

function getFilesInfo() {
  return JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'files.json'), 'utf8'));
}
