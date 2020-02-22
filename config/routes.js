const CONTROLLERS_FOLDER = '../app/controllers';

const root     = require(`${CONTROLLERS_FOLDER}/root`);
const gallery  = require(`${CONTROLLERS_FOLDER}/gallery`);
const lod      = require(`${CONTROLLERS_FOLDER}/lod`);
const shana    = require(`${CONTROLLERS_FOLDER}/shana`);
const listings = require(`${CONTROLLERS_FOLDER}/listings`);

module.exports = app => {
  app.get('/', root.home);
  app.get('/projects', root.projects);
  app.get('/adminsite', root.adminsite);
  app.get('/promo', root.promo);
  app.get('/gb', root.gb);
  app.get('/feedback', root.feedback);

  app.get('/:type(video|files|articles)/detail/:slug', listings.detail);
  app.get('/gallery/detail/:image', gallery.image);

  app.get('/:type(video|files|articles|gallery)/:category/:page', listings.category);
  app.get('/:type(video|files|articles|gallery)/:category', listings.category);

  app.get('/lod', lod.info);
  app.get('/lod/worldmap', lod.worldmap);
  app.get('/lod/faq', lod.faq);

  app.get('/shana', shana.info);
  app.get('/shana/music', shana.music);
};