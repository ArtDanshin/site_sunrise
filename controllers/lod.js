exports.info = function(req, res) {
  res.render('lod/info', { pageTitle: 'Информация о игре The Legend of Dragoon' });
};

exports.articles = function(req, res) {
  res.render('lod/articles', { pageTitle: '' });
};

exports.worldmap = function(req, res) {
  res.render('lod/worldmap', { pageTitle: '' });
};

exports.video = function(req, res) {
  res.render('lod/video', { pageTitle: '' });
};

exports.music = function(req, res) {
  res.render('lod/music', { pageTitle: '' });
};

exports.faq = function(req, res) {
  res.render('lod/faq', { pageTitle: '' });
};