const topicModel = require('../models/topics');

exports.home = async function(req, res) {
  const news = await topicModel.getTopics({ type: 'news' , category: 'sns-main' });

  res.render('main', {
    pageTitle: 'Главная страница - Shakugan no Shana',
    news
  });
};

exports.info = function(req, res) {
  res.render('shana/info', { pageTitle: 'Информация о сериале' });
};

exports.music = function(req, res) {
  res.render('under_construction', {
    pageTitle: 'Shakugan no Shana - Музыкальный архив'
  });
};