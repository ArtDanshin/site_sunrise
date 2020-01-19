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

function getVideosInfo() {
  return JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'video.json'), 'utf8'));
}
