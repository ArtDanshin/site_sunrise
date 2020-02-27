const path = require('path');
const favicon = require('serve-favicon');

module.exports = favicon(path.join(appRoot, 'public', 'favicon.ico'));