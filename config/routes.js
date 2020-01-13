const root   = require('../controllers/root');
const gallery  = require('../controllers/gallery');
const lod    = require('../controllers/lod');
const shana  = require('../controllers/shana');

module.exports = app => {
  app.get('/', root.home);
  app.get('/projects', root.projects);
  app.get('/adminsite', root.adminsite);
  app.get('/promo', root.promo);
  app.get('/gb', root.gb);
  app.get('/feedback', root.feedback);

  app.get('/gallery/:category/', gallery.category);
  app.get('/gallery/:category/:image', gallery.image);

  app.get('/lod', lod.info);
  app.get('/lod/articles', lod.articles);
  app.get('/lod/worldmap', lod.worldmap);
  app.get('/lod/video', lod.video);
  app.get('/lod/music', lod.music);
  app.get('/lod/faq', lod.faq);

  app.get('/shana', shana.info);
  app.get('/shana/video', shana.video);
  app.get('/shana/gallery', shana.gallery);
  app.get('/shana/music', shana.music);
};