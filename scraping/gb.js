const path = require('path');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const URL = 'http://silver-dragoon.ucoz.ru/gb';
const gbPosts = [];

request(URL, function(err, res, body) {
  if (err) throw err;
  const $ = cheerio.load(body, {
    decodeEntities: false
  });
  $('#allEntries')
    .children()
    .each(function(i, el) {
      gbPosts.push({
        authorName: $(el).find('.commNameTd .commName').html(),
        authorLogin: $(el).find('.commNameTd .commUser').html(),
        email: $(el).find('.commNameTd [title="E-mail"]').length ? $(el).find('.commNameTd [title="E-mail"]').parent().attr('onclick') : null,
        date: $(el).find('.commDateTd').html(),
        body: /(.+) <span/gm.exec($(el).find('.commCommentTd').html())[1]
      })
    });
  fs.writeFileSync(path.join(__dirname, '..', 'db', 'gb.json'), JSON.stringify(gbPosts));
});