const path = require('path');
const fs = require('fs');
const util = require('util');

processDb('video', 'videos', 'video')
  .then(() => processDb('files', 'files', 'file'))
  .then(() => processDb('articles', 'articles', 'article'))
  .then(() => processDb('news', 'news', 'news'))
  .then(() => processDb('gallery', 'images', 'image'));

async function processDb(dbName, propTopics, newType) {
  let topics;

  try {
    topics = await getDbFile('topics');
  } catch {
    topics = [];
  }

  let categories;

  try {
    categories = await getDbFile('categories');
  } catch {
    categories = [];
  }

  const oldDb = await getDbFile(dbName);
  const processedTopics = await processTopics(oldDb[propTopics] || oldDb, newType, topics.length);
  topics = topics.concat(processedTopics);


  if (oldDb.categories) {
    const processedCategories = oldDb.categories && processCategories(oldDb.categories);

    categories = categories.concat(processedCategories);
  }

  await writeDbFile('topics', topics);
  await writeDbFile('categories', categories);
};

async function getDbFile(type) {
  const reader = util.promisify(fs.readFile);

  const json = await reader(path.join(__dirname, '..', 'db', `${type}.json`), 'utf8');

  return JSON.parse(json);
}

async function writeDbFile(type, data) {
  const writer = util.promisify(fs.writeFile);

  await writer(path.join(__dirname, '..', 'db', `${type}.json`), JSON.stringify(data));
}

async function processTopics(topics, finalType, beginIndex) {
  const finalTopics = await Promise.all(topics.map(async (topic, index) => {
    const slug = topic.slug
      ? formatSlug(topic.slug, beginIndex + index)
      : `${beginIndex + index}-${finalType}`;

    return {
      type: finalType,
      title: topic.title,
      slug,
      category: topic.category
        ? topic.category.map(categorySlug => snakeToKebab(categorySlug))
        : null,
      views: topic.views,
      author: topic.author,
      rating: typeof topic.rating === 'number'
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
      forTypeImage: topic.originImageInfo || topic.thumbImageInfo
        ? await imageProcess(topic.originImageInfo, topic.thumbImageInfo, slug)
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
    };
  }));

  return finalTopics;
}

function processCategories(categories) {
  return categories.map(category => ({
    slug: snakeToKebab(category.slug),
    title: category.title,
    description: category.description || null
  }))
}

function formatSlug(slug, newNumber) {
  let newSlug = slug.replace(/^(\d+_)/gm, '');

  return `${newNumber}-${snakeToKebab(newSlug)}`;
}

function snakeToKebab(string) {
  return string.replace(/_/g, '-');
}

function numberToEmptyArray(num) {
  const resultArray = [];

  for (let i = 0; i < num; i++) {
    resultArray.push({})
  }

  return resultArray;
}

async function imageProcess(originImageInfo, thumbImageInfo, slug) {
  const rename = util.promisify(fs.rename);

  const pathToImageFolder = path.join(__dirname, '..', 'public', 'images', 'gallery');
  const pathToThumbFolder = path.join(pathToImageFolder, 'thumb');
  const format = originImageInfo.format;
  const newFilename = `${slug}.${format}`;

  await rename(
    path.join(pathToImageFolder, originImageInfo.filename),
    path.join(pathToImageFolder, newFilename)
  );
  await rename(
    path.join(pathToThumbFolder, thumbImageInfo.filename),
    path.join(pathToThumbFolder, newFilename)
  );

  return {
    originImageInfo: {
      filename: newFilename,
      size: originImageInfo.size,
      height: originImageInfo.height,
      width: originImageInfo.width,
      format
    },
    thumbImageInfo: {
      filename: newFilename,
      size: thumbImageInfo.size,
      height: thumbImageInfo.height,
      width: thumbImageInfo.width,
      format
    }
  }
}
