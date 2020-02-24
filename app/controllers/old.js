const topicModel = require('../models/topics');

exports.home = async function(req, res) {
  const news = await topicModel.getTopics({ type: 'news' , category: 'old-main' });

  res.render('main', {
    theme: 'old',
    pageTitle: 'Главная страница - 1 версия сайта',
    news
  });
};
