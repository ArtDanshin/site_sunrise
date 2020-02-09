const path = require('path');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const HOST = 'http://silver-dragoon.ucoz.ru';
let articles = [];

requestToList('/publ/3')
  .then(url => requestToArticle(url))
  .then(writeToArticleBD);


/**
 * Запрос информации об адресах страниц листов и файлов
 * @param {string} listUrl
 * @returns {Promise<unknown>}
 */
function requestToList(listUrl) {
  console.log('Request to list -> ', listUrl);

  return new Promise(resolve => {
    request(HOST + listUrl, function(err, res, body) {
      if (err) throw err;
      const $ = cheerio.load(body, {
        decodeEntities: false
      });

      const article = $('#allEntries > div');

      parseArticleAnnounce(article);

      console.log('End category!');

      resolve(article.find('.entryTitle a').attr('href'));
    });
  })
}

function parseArticleAnnounce(announce) {
  const index = articles.length;
  const parsedDate = announce.find('.e-date .ed-value').html().match(/(\d+)/gm);
  const timeStampDate = new Date(parsedDate[2], parseInt(parsedDate[1], 10) - 1, parsedDate[0]).getTime();

  articles.push({
    title: announce.find('.entryTitle a').text(),
    slug: index + '_' + announce.find('.entryTitle a').attr('href').split('-').reverse()[0],
    category: [announce.find('.e-category').attr('href').split('/').reverse()[0]],
    views: parseInt(announce.find('.e-reads .ed-value').text()),
    author: announce.find('.e-author .ed-value').text(),
    rating: {
      score: parseFloat(announce.find('.u-star-rating-12').attr('title').match(/(\d.\d)|(\d)/g)[0]),
      votes: parseInt(announce.find('.u-star-rating-12').attr('title').match(/(\d.\d)|(\d)/g)[1])
    },
    comments: [],
    publishDate: timeStampDate,
    previewBody: announce.find('.entryBodyTd').html(),
    mainBody: null
  })
}

/**
 * Запрос информации о конкретном файле
 * @param {string} imagePageUrl
 * @returns {Promise<unknown>}
 */
function requestToArticle(articlePageUrl) {
  console.log('Request to File -> ', articlePageUrl);

  return new Promise(resolve => {
    request(HOST + articlePageUrl, function(err, res, body) {
      if (err) throw err;
      const $ = cheerio.load(body, {
        decodeEntities: false
      });

      const article = articles.find(el => el.slug.split('_')[1] === articlePageUrl.split('-').reverse()[0]);

      const parsedDateWithTime = $('.entryDateTd').text().match(/(\d+)/gm);
      const timeStampDate = new Date(parsedDateWithTime[2], parseInt(parsedDateWithTime[1], 10) - 1, parsedDateWithTime[0], parsedDateWithTime[3], parsedDateWithTime[4]).getTime();

      article.publishDate = timeStampDate;

      article.comments = $('.comEnt').map(function(index, element) {
        const parsedDate = $(element).find('.commName > span').text().match(/(\d+)/gm);
        const timeStampCommentDate = new Date(parsedDate[2], parseInt(parsedDate[1], 10) - 1, parsedDate[0], parsedDate[3], parsedDate[4]).getTime();

        return {
          message: $(element).find('.cMessage').html(),
          date: timeStampCommentDate,
          rating: parseInt($(element).find('.commNumTd').children()[0].children[2].data, 10),
          userInfo: {
            name: $(element).find('.commName a[href="javascript://"] b').text(),
            avatar: $(element).find('.user_avatar img').length ? {
              src: $(element).find('.user_avatar img').attr('src'),
              width: ($(element).find('.user_avatar img').attr('width')) ? parseInt($(element).find('.user_avatar img').attr('width'), 10) : null,
              height: ($(element).find('.user_avatar img').attr('height')) ? parseInt($(element).find('.user_avatar img').attr('height'), 10) : null
            } : null
          }
        };
      }).get();

      article.mainBody = $('.entryTextTd').html();

      resolve();
    });
  })
};

/**
 * Запись результатов в json файл
 */
function writeToArticleBD() {
  fs.writeFileSync(path.join(__dirname, '..', 'db', 'articles.json'), JSON.stringify({categories: [], articles}));
}