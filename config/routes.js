const root      = require('../controllers/root');
// const portfolio = require('../app/controllers/portfolio');
// const blog      = require('../app/controllers/blog');
// const topic     = require('../app/controllers/topic');
// const about     = require('../app/controllers/about');

module.exports = app => {
  app.get('/', root.home);
  app.get('/projects', root.projects);
  app.get('/adminsite', root.adminsite);
  app.get('/promo', root.promo);
  app.get('/gb', root.gb);
  app.get('/feedback', root.feedback);

  // app.get('/portfolio', portfolio.show);
  // app.get('/portfolio/:item', portfolio.item);
  //
  // app.get('/blog', blog.show);
  //
  // app.get('/topic/:id', topic.show);
  //
  // app.get('/about', about.show);
};