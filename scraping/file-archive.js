const path = require('path');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const HOST = 'http://silver-dragoon.ucoz.ru';
const lists = new Set();
const listsDone = new Set();
const fileUrls = new Set();
let files = [];

const INTERVAL_FOR_REQUESTS = 10000;

requestToList('/load/')
  .then(interateOfFiles)
  .then(writeToFilesBD);


/**
 * Запрос информации об адресах страниц листов и файлов
 * @param {string} listUrl
 * @returns {Promise<unknown>}
 */
function requestToList(listUrl) {
  console.log('Request to list -> ', listUrl);

  return new Promise(resolve => {
    setTimeout(() => {
      request(HOST + listUrl, function(err, res, body) {
        if (err) throw err;
        const $ = cheerio.load(body, {
          decodeEntities: false
        });

        $('#allEntries > div').each(function(index, element) {
          parseFileAnnounce($(element));
          fileUrls.add($(element).find('.entryTitle a').attr('href'));
        });

        $('.pagesBlockuz2 a').each(function(index, element) {
          const listUrl = $(element).attr('href');

          if (!listsDone.has(listUrl)) {
            lists.add(listUrl);
          }
        });

        lists.delete(listUrl);
        listsDone.add(listUrl);

        // Если есть еще списочные страницы, делаем за ними запрос
        if (lists.size > 0) {
          const listsValues = lists.values();
          requestToList(listsValues.next().value)
            .then(resolve);
        } else {
          console.log('End category!');

          resolve();
        }
      });
    }, INTERVAL_FOR_REQUESTS)
  })
}

function parseFileAnnounce(announce) {
  const index = files.length;
  const parsedDate = announce.find('.e-date .ed-value').html().match(/(\d+)/gm);
  const timeStampDate = new Date(parsedDate[2], parseInt(parsedDate[1], 10) - 1, parsedDate[0]).getTime();

  files.push({
    title: announce.find('.entryTitle a').text(),
    slug: index + '_' + announce.find('.entryTitle a').attr('href').split('-').reverse()[0],
    category: [announce.find('.e-category').attr('href').split('/').reverse()[0]],
    views: parseInt(announce.find('.e-reads .ed-value').text()),
    loads: null,
    author: announce.find('.e-author .ed-value').text(),
    rating: {
      score: parseFloat(announce.find('.u-star-rating-12').attr('title').match(/(\d.\d)|(\d)/g)[0]),
      votes: parseInt(announce.find('.u-star-rating-12').attr('title').match(/(\d.\d)|(\d)/g)[1])
    },
    comments: [],
    publishDate: timeStampDate,
    fileSize: null,
    previewBody: announce.find('.entryBodyTd').html(),
    mainBody: null
  })
}

/**
 * Последовательно, по очереди, запрашиваем информацию о каждом файле
 * @returns {Promise<void>}
 */
async function interateOfFiles() {
  let fileValues = fileUrls.values();
  let fileUrl = null;

  while (fileUrl = fileValues.next().value) {
    await requestToFile(fileUrl);
  }

  console.log('End requests to files info');
}

/**
 * Запрос информации о конкретном файле
 * @param {string} imagePageUrl
 * @returns {Promise<unknown>}
 */
function requestToFile(filePageUrl) {
  console.log('Request to File -> ', filePageUrl);

  return new Promise(resolve => {
    setTimeout(() => {
      request(HOST + filePageUrl, function(err, res, body) {
        if (err) throw err;
        const $ = cheerio.load(body, {
          decodeEntities: false
        });

        const file = files.find(el => el.slug.split('_')[1] === filePageUrl.split('-').reverse()[0]);

        const parsedDateWithTime = $('.entryDateTd').text().match(/(\d+)/gm);
        const timeStampDate = new Date(parsedDateWithTime[2], parseInt(parsedDateWithTime[1], 10) - 1, parsedDateWithTime[0], parsedDateWithTime[3], parsedDateWithTime[4]).getTime();

        file.publishDate = timeStampDate;
        file.loads = parseInt($('.e-loads .ed-value').text(), 10);

        file.comments = $('.comEnt').map(function(index, element) {
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

        file.mainBody = $('.entryTextTd').html();

        resolve();
      });
    }, INTERVAL_FOR_REQUESTS)
  })
};

/**
 * Запись результатов в json файл
 */
function writeToFilesBD() {
  fs.writeFileSync(path.join(__dirname, '..', 'db', 'files.json'), JSON.stringify({categories: [], files}));
}
