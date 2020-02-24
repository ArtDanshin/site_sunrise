exports.info = function(req, res) {
  res.render('lod/info', {
    theme: 'lod',
    pageTitle: 'Информация о игре The Legend of Dragoon'
  });
};

exports.worldmap = function(req, res) {
  res.render('lod/map', {
    theme: 'lod',
    pageTitle: 'Карта мира Endiness'
  });
};

exports.faq = function(req, res) {
  res.render('under_construction', {
    theme: 'lod',
    pageTitle: 'The Legend of Dragoon - FAQ по прохождению'
  });
};