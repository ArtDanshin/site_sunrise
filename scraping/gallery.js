const path = require('path');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const HOST = 'http://silver-dragoon.ucoz.ru';
const categories = new Set();
const lists = new Set();
const listsDone = new Set();
const imagesUrl = new Set();
let images = [];

const INTERVAL_FOR_REQUESTS = 30000;

requestToGalleryCategories('/')
  .then(interateOfLists)
  .then(interateOfImage)
  .then(writeToImageBD);

// Если нужно подправить уже записанные данные, то эта функция для этого
// modifyJSON();

/**
 * Получение списка всех категорий галереи
 * @param {string} siteUrl Любая страница, на которой есть список категорий галереи в меню
 * @returns {Promise<unknown>}
 */
function requestToGalleryCategories(siteUrl) {
  console.log('Request to -> ', siteUrl);

  return new Promise(resolve => {
    request(HOST + siteUrl, function(err, res, body) {
      if (err) throw err;
      const $ = cheerio.load(body, {
        decodeEntities: false
      });

      $('#3 li.m a.m').each(function(index, element) {
        categories.add({
          url: $(element).attr('href').replace('http://silver-dragoon.ucoz.ru', '') + '-1',
          slug: $(element).attr('href').split('/')[5]
        });
      });

      resolve();
    });
  });
}

/**
 * Последовательно, по очереди, запрашиваем информацию о каждой картинке
 * @returns {Promise<void>}
 */
async function interateOfLists() {
  const categoriesValues = categories.values();
  let category = null;

  while (category = categoriesValues.next().value) {
    await requestToList(category.url);
  }

  console.log('End requests to lists info and images urls', listsDone);
}

/**
 * Запрос информации об адресах страниц листов и картинок
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

        $('.phtTdMain.uEntryWrap a.ph-link').each(function(index, element) {
          imagesUrl.add($(element).attr('href'));
        });

        $('.pagesBlockuz2 a').each(function(index, element) {
          const listUrl = $(element).attr('href');

          if (!listsDone.has(listUrl)) {
            lists.add(listUrl);
          }
        });

        lists.delete(listUrl);
        listsDone.add(listUrl);

        // Если в категории есть еще страницы, делаем за ними запрос
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

/**
 * Последовательно, по очереди, запрашиваем информацию о каждой картинке
 * @returns {Promise<void>}
 */
async function interateOfImage() {
  let imagesValues = imagesUrl.values();
  let imageUrl = null;

  while (imageUrl = imagesValues.next().value) {
    await requestToImage(imageUrl);
  }

  console.log('End requests to images info');
}

/**
 * Запрос информации о конкретной картике
 * @param {string} imagePageUrl
 * @returns {Promise<unknown>}
 */
function requestToImage(imagePageUrl) {
  console.log('Request to image -> ', imagePageUrl);

  return new Promise(resolve => {
    setTimeout(() => {
      request(HOST + imagePageUrl, function(err, res, body) {
        if (err) throw err;
        const $ = cheerio.load(body, {
          decodeEntities: false
        });

        const image = {
          title: $('.photo-etitle').text(),
          category: imagePageUrl.split('/')[3],
          slug: imagePageUrl.split('/')[4],
          url: imagePageUrl,
          originImageInfo: ($('.dd-tip.ulightbox').length)
            ? {
              src: $('.dd-tip.ulightbox').attr('href'),
              height: ($('.dd-tip.ulightbox b').text().match(/x(\d*)/i)[1]) ? parseInt($('.dd-tip.ulightbox b').text().match(/x(\d*)/i)[1], 10) : null,
              width: ($('.dd-tip.ulightbox b').text().match(/(\d*)x/i)[1]) ? parseInt($('.dd-tip.ulightbox b').text().match(/(\d*)x/i)[1], 10) : null,
              size: $('.dd-tip.ulightbox').text().match(/\/\s(.*Kb)/i)[1]
            }
            : {
              src: $('#phtmDiv35 img').attr('src'),
              height: null,
              width: null,
              size: null
            },
          topicImageInfo: {
            src: $('#phtmDiv35 img').attr('src')
          },
          thumbImageInfo: {
            src: $('#oldPhotos img.photoActive').attr('src')
          },
          views: $('.phd-views').text(),
          comments: $('.comEnt').map(function(index, element) {
            return {
              message: $(element).find('.cMessage').contents()[2].data,
              date: $(element).find('.commName > span').text(),
              rating: parseInt($(element).find('.commNumTd').children()[0].children[2].data, 10),
              userInfo: {
                name: $(element).find('.commName a[href="javascript://"] b').text(),
                avatar: {
                  src: $(element).find('.user_avatar img').attr('src'),
                  width: ($(element).find('.user_avatar img').attr('width')) ? parseInt($(element).find('.user_avatar img').attr('width'), 10) : null,
                  height: ($(element).find('.user_avatar img').attr('height')) ? parseInt($(element).find('.user_avatar img').attr('height'), 10) : null,
                }
              }
            };
          }).get(),
          rating: $('.phd-rating span').text()
        };

        images.push(image);

        resolve();
      });
    }, INTERVAL_FOR_REQUESTS)
  })
};

/**
 * Запись результатов в json файл
 */
function writeToImageBD() {
  fs.writeFileSync(path.join(__dirname, '..', 'db', 'gallery.json'), JSON.stringify({categories: Array.from(categories), images}));
}

/**
 * Доработки JSON файла после первого прохождения по всем картинкам галереи
 */
function modifyJSON() {
  const gallery = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'gallery.json'), 'utf8'));

  images = gallery.images;

  requestToList('/photo/lod/posters/18-1')
    .then(interateOfImage)
    .then(() => {
      gallery.images = images;

      fs.writeFileSync(path.join(__dirname, '..', 'db', 'gallery.json'), JSON.stringify(gallery));
    });
}