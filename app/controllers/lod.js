exports.info = function(req, res) {
  res.render('lod/info', { pageTitle: 'Информация о игре The Legend of Dragoon' });
};

exports.articles = function(req, res) {
  res.render('lod/articles', { pageTitle: '' });
};

exports.worldmap = function(req, res) {
  res.render('lod/map', { pageTitle: 'Карта мира Endiness' });
};

exports.faq = function(req, res) {
  res.render('under_construction', {
    pageTitle: 'The Legend of Dragoon - FAQ по прохождению'
  });
};