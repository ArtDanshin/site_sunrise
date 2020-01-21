const path = require('path');
const fs = require('fs');

exports.category = function(req, res) {
  const videosInfo = getVideosInfo();
  const category = videosInfo.categories.find(cat => cat.slug === req.params.category);

  if (category) {
    const videos = videosInfo.videos.filter(video => video.category.includes(req.params.category));

    if (videos.length) {
      res.render('video/category', {
        pageTitle: category.title,
        videos
      });
    } else {
      res.render('under_construction', {
        pageTitle: category.title
      });
    }
  } else {
    res.status(404).end()
  }
};

exports.detail = function(req, res) {
  const videosInfo = getVideosInfo();
  console.log(req.params.videoSlug);
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
