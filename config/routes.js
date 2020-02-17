const CONTROLLERS_FOLDER = '../app/controllers';

const root     = require(`${CONTROLLERS_FOLDER}/root`);
const gallery  = require(`${CONTROLLERS_FOLDER}/gallery`);
const video    = require(`${CONTROLLERS_FOLDER}/video`);
const files    = require(`${CONTROLLERS_FOLDER}/files`);
const articles = require(`${CONTROLLERS_FOLDER}/articles`);
const lod      = require(`${CONTROLLERS_FOLDER}/lod`);
const shana    = require(`${CONTROLLERS_FOLDER}/shana`);

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

  app.get('/files/detail/:fileSlug', files.detail);
  app.get('/files/:category/:page', files.category);
  app.get('/files/:category', files.category);

  app.get('/articles/detail/:articleSlug', articles.detail);
  app.get('/articles/:category/:page', articles.category);
  app.get('/articles/:category', articles.category);


  app.get('/lod', lod.info);
  app.get('/lod/worldmap', lod.worldmap);
  app.get('/lod/faq', lod.faq);

  app.get('/shana', shana.info);
  app.get('/shana/music', shana.music);
};