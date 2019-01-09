const path = require('path');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const queue = require('async/queue');

const HOST = 'http://silver-dragoon.ucoz.ru';
const firstList = '/photo/lod/endiness_world/13-1';
const listsDone = new Set();
const imagesUrl = new Set();
const images = [];

const listQueue = queue(requestToList, 2);
const imagesQueue = queue(requestToImages, 2);

listQueue.drain = function() {
  console.log('Complete Requests to Lists');
  imagesUrl.forEach(imageUrl => {
    imagesQueue.push(imageUrl, function() { console.log('Request to Image Complete', imageUrl) });
  })
};

imagesQueue.drain = function() {
  console.log('Complete Requests to Images');
  writeToImageBD();
};

listsDone.add(firstList);
listQueue.push({ url: firstList, queue: listQueue }, function() { console.log('Request to List Complete'); });

function requestToList({ url, queue }, callback) {
  request(HOST + url, function(err, res, body) {
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
        listsDone.add(listUrl);
        queue.push({ url: listUrl, queue }, function() { console.log('Request to List Complete:', listUrl); });
      }
    });

    callback();
  })
}

function requestToImages(url, callback) {
  request(HOST + url, function(err, res, body) {
    if (err) throw err;
    const $ = cheerio.load(body, {
      decodeEntities: false
    });
    const image = {
      title: $('.photo-etitle').text(),
      originImageInfo: ($('.dd-tip.ulightbox').is())
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
      rating: $('.phd-rating span').text(),
      url: res.request.href
    };

    images.push(image);

    callback();
  });
};

function writeToImageBD() {
  fs.writeFileSync(path.join(__dirname, '..', 'db', 'gallery.json'), JSON.stringify(images));
}