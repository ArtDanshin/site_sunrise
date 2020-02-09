const path = require('path');
const fs = require('fs');

const { renderCategory, renderDetail } = require('../helpers/listing_pages');

exports.category = function(req, res) {
  const videosInfo = getVideosInfo();
  const category = videosInfo.categories.find(cat => cat.slug === req.params.category);
  const VIDEO_PER_PAGE = 5;

  renderCategory({
    req,
    res,
    category,
    items: videosInfo.videos,
    itemsPerPage: VIDEO_PER_PAGE,
    type: 'video'
  });
};

exports.detail = function(req, res) {
  const videosInfo = getVideosInfo();
  const video = videosInfo.videos.find(video => video.slug === req.params.videoSlug);

  renderDetail({
    res,
    item: video,
    categories: videosInfo.categories,
    type: 'video'
  });
};

function getVideosInfo() {
  return JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'video.json'), 'utf8'));
}
