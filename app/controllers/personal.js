const path = require('path');
const fs = require('fs');

const topicModel = require('../models/topics');

exports.home = async function(req, res) {
  const news = await topicModel.getTopics({ type: 'news' , category: 'personal-main' });

  res.render('personal/main', {
    theme: 'personal',
    pageTitle: 'Главная страница - Персональный сайт',
    news
  });
};

exports.projects = function(req, res) {
  const projects = JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'projects.json'), 'utf8'));

  res.render('personal/projects', { pageTitle: 'Информация о проектах сайтов', projects });
};

exports.feedback = function(req, res) {
  res.render('personal/feedback', { pageTitle: 'Обратная связь' });
};