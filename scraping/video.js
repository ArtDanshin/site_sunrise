const path = require('path');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const URL = 'http://localhost:3000/video/bla';
const tokenToRubyMineServer = '_ijt=98nl89o3cg1de3cqaavd1hm6qb';
const videos = [];

requestToVideosPage(URL)
  .then(requestToDetailPage)
  .then(writetoDb);

function requestToVideosPage(url) {
  console.log('Request to videos list');

  return new Promise(resolve => {
    request(url, function(err, res, body) {
      if (err) throw err;
      const $ = cheerio.load(body, {
        decodeEntities: false
      });
      $('#allEntries')
        .children()
        .each(function(i, el) {
          const parsedDate = $(el).find('.entryDetailsTd').html().match(/Добавлено\:\s([a-zA-Z0-9., :]+)/gm)[0].match(/(\d+)/gm);
          const timeStampDate = new Date(parsedDate[2], parseInt(parsedDate[1], 10) - 1, parsedDate[0], parsedDate[3], parsedDate[4]).getTime();

          videos.push({
            title: $(el).find('.entryTitle a').html(),
            slug: `sns_special_${i + 1}`,
            category: ['sns_special'],
            views: parseInt($(el).find('.entryReads').html()),
            author: $(el).find('.entryDetailsTd').html().match(/Добавил\:\s([a-zA-Z]+)/gm)[0].match(/[a-zA-Z]+/gm)[0],
            rating: parseFloat($(el).find('.entryRating').html()),
            comments: [],
            publishDate: timeStampDate,
            previewBody: $(el).find('.entryBodyTd').html(),
            mainBody: ''
          });
        });

      resolve();
    });
  })
}

async function requestToDetailPage() {
  console.log('Request to detail');

  let index = 0;

  while (index < videos.length) {
    await new Promise(resolve => {
      request(`http://localhost:63342/site_sunrise/SnS-Video-Special-${index + 1}.htm?${tokenToRubyMineServer}`, function (err, res, body) {
        if (err) throw err;
        const $ = cheerio.load(body, {
          decodeEntities: false
        });

        videos[index].mainBody = $('.entryTable .entryTextTd').html();

        resolve();
      });

      console.log(index, videos.length);
    });

    index++;
  }
}

function writetoDb() {
  const completedVideos = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'video.json'), 'utf8'));

  fs.writeFileSync(path.join(__dirname, '..', 'db', 'video_new.json'), JSON.stringify({ categories: [...completedVideos.categories], videos: [...completedVideos.videos, ...videos] }));

}
