const topicModel = require('../models/topics');

exports.home = async function(req, res) {
  const news = await topicModel.getTopics({ type: 'news' , category: 'lod-main' });

  res.render('main', {
    theme: 'lod',
    pageTitle: 'Главная страница - The Legend of Dragoon',
    news
  });
};

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