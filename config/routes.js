const main      = require('../controllers/main');
// const portfolio = require('../app/controllers/portfolio');
// const blog      = require('../app/controllers/blog');
// const topic     = require('../app/controllers/topic');
// const about     = require('../app/controllers/about');

module.exports = app => {
  app.get('/', main.home);

  // app.get('/portfolio', portfolio.show);
  // app.get('/portfolio/:item', portfolio.item);
  //
  // app.get('/blog', blog.show);
  //
  // app.get('/topic/:id', topic.show);
  //
  // app.get('/about', about.show);
};