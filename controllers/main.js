const path = require('path');
const fs = require('fs');

exports.home = function(req, res) {
  const news = JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'news.json'), 'utf8'));

  res.render('main', { title: 'Главная страница', news });
};
