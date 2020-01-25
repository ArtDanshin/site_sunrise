const path = require('path');
const fs = require('fs');

exports.category = function(req, res) {
  console.log('category');
  const videosInfo = getVideosInfo();
  const category = videosInfo.categories.find(cat => cat.slug === req.params.category);
  const VIDEO_PER_PAGE = 5;

  if (category) {
    const pageNumber = req.params.page && parseInt(req.params.page);

    if (pageNumber) {
      const videos = videosInfo.videos.filter(video => video.category.includes(req.params.category));
      const totalVideos = videos.length;

      if (totalVideos) {
        const numberOfFirstVideoOnPage = (pageNumber - 1) ? VIDEO_PER_PAGE * (pageNumber - 1): 0;

        if (videos[numberOfFirstVideoOnPage]) {
          const urlToCategory = `/video/${req.params.category}/`;

          res.render('video/category', {
            pageTitle: category.title,
            currentPage: pageNumber,
            videoPerPage: VIDEO_PER_PAGE,
            totalVideos,
            urlToCategory,
            videos: videos.splice(numberOfFirstVideoOnPage, VIDEO_PER_PAGE)
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
  const videosInfo = getVideosInfo();
  const video = videosInfo.videos.find(video => video.slug === req.params.videoSlug);

  if (video) {
    if (video.mainBody) {
      const category = videosInfo.categories.find(cat => cat.slug === video.category[0]);

      res.render('video/detail', {
        pageTitle: video.title,
        video,
        category
      });
    } else {
      res.render('under_construction', {
        pageTitle: video.title
      });
    }
  } else {
    res.status(404).end()
  }
};

function getVideosInfo() {
  return JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'video.json'), 'utf8'));
}
