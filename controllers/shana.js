exports.info = function(req, res) {
  res.render('shana/info', { pageTitle: 'Информация о сериале' });
};

exports.video = function(req, res) {
  res.render('shana/video', { pageTitle: '' });
};

exports.gallery = function(req, res) {
  res.render('shana/gallery', { pageTitle: '' });
};

exports.music = function(req, res) {
  res.render('shana/music', { pageTitle: '' });
};