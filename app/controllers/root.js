const path = require('path');
const fs = require('fs');

const topicModel = require('../models/topics');

exports.home = async function(req, res) {
  const news = await topicModel.getTopics({ type: 'news'});

  res.render('main', { pageTitle: 'Главная страница', news });
};

exports.projects = function(req, res) {
  const projects = JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'projects.json'), 'utf8'));

  res.render('projects', { pageTitle: 'Информация о проектах сайтов', projects });
};

exports.adminsite = function(req, res) {
  res.render('adminsite', { pageTitle: 'Администрация сайта' });
};

exports.promo = function(req, res) {
  res.render('promo', { pageTitle: 'Реклама сайта и баннеры' });
};

exports.gb = function(req, res) {
  const gbPosts = JSON.parse(fs.readFileSync(path.join(appRoot, 'db', 'gb.json'), 'utf8'));

  res.render('gb', { pageTitle: 'Гостевая книга', gbPosts });
};

exports.feedback = function(req, res) {
  res.render('feedback', { pageTitle: 'Обратная связь' });
};