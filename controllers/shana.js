exports.info = function(req, res) {
  res.render('shana/info', { pageTitle: 'Информация о сериале' });
};

exports.music = function(req, res) {
  res.render('shana/music', { pageTitle: '' });
};