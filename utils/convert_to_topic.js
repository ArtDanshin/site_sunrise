const path = require('path');
const fs = require('fs');
const util = require('util');

async function getDbFile(type) {
  const reader = util.promisify(fs.readFile);
  const json = await reader(path.join(__dirname, '..', 'db', `${type}.json`), 'utf8');

  return JSON.parse(json);
}

function processTopics(json, nowType, finalType, beginIndex) {
  const topics = json[nowType];

  return topics.map((topic, index) => ({
    type: finalType,
    title: topic.title,
    slug: topic.slug
      ? formatSlug(topic.slug, beginIndex + index)
      : `${index}-${finalType}`,
    category: topic.category,
    views: topic.views,
    author: topic.author,
    rating: Number.isInteger(topic.comments)
      ? {
        score: topic.rating,
        votes: topic.rating > 0 ? 1 : 0
      }
      : topic.rating,
    publishDate: topic.publishDate,
    forTypeFile: topic.fileSize
      ? {
        fileSize: topic.fileSize
      }
      : null,
    forTypeGallery: topic.originImageInfo || topic.thumbImageInfo
      ? {
        originImageInfo: topic.originImageInfo,
        thumbImageInfo: topic.thumbImageInfo
      }
      : null,
    previewBody: topic.previewBody || null,
    mainBody: topic.mainBody || null,
    comments: Number.isInteger(topic.comments)
      ? numberToEmptyArray(topic.comments)
      : topic.comments.map(comment => (comment.body)
        ? {
          body: comment.body,
          date: comment.date,
          userInfo: comment.userInfo
        }
        : {}
      )
  }))
}

function formatSlug(slug, newNumber) {
  let newSlug = slug.replace(/^(\d+_)/gm, '');

  return `${newNumber}-${snakeToKebab(newSlug)}`;
}

function snakeToKebab(string) {
  return string.replace('_', '-');
}

function numberToEmptyArray(num) {
  const resultArray = [];

  for (let i = 0; i < num; i++) {
    resultArray.push({})
  }

  return resultArray;
}

getDbFile('articles')
  .then(console.log);