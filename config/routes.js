const root   = require('../controllers/root');
const gallery  = require('../controllers/gallery');
const video  = require('../controllers/video');
const files  = require('../controllers/files');
const lod    = require('../controllers/lod');
const shana  = require('../controllers/shana');

module.exports = app => {
  app.get('/', root.home);
  app.get('/projects', root.projects);
  app.get('/adminsite', root.adminsite);
  app.get('/promo', root.promo);
  app.get('/gb', root.gb);
  app.get('/feedback', root.feedback);

  app.get('/gallery/detail/:image', gallery.image);
  app.get('/gallery/:category/:page', gallery.category);
  app.get('/gallery/:category', gallery.category);

  app.get('/video/detail/:videoSlug', video.detail);
  app.get('/video/:category/:page', video.category);
  app.get('/video/:category', video.category);

  app.get('/files/detail/:videoSlug', files.detail);
  app.get('/files/:category/:page', files.category);
  app.get('/files/:category', files.category);

  app.get('/lod', lod.info);
  app.get('/lod/articles', lod.articles);
  app.get('/lod/worldmap', lod.worldmap);
  app.get('/lod/music', lod.music);
  app.get('/lod/faq', lod.faq);

  app.get('/shana', shana.info);
  app.get('/shana/music', shana.music);
};