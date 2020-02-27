const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();

const middlewares = fs.readdirSync(path.join(__dirname, 'app', 'middlewares')).sort();
const settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'settings.json'), 'utf8'));
global.appRoot = path.resolve(__dirname);

// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'app', 'views'));

require('./config/routes.js')(app);

middlewares.forEach(middleware => {
  app.use(require('./app/middlewares/' + middleware));
});

app.listen(settings.port, function() {
  console.log(`Listening ${settings.port} port'`);
});