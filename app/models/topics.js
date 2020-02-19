const path = require('path');
const fs = require('fs');
const util = require('util');

exports.getTopics = async function({ type, category }) {
  const allTopics = await getAllTopics();

  return allTopics.filter(topic => {
    const checkType = type ? topic.type === type : true;
    const checkCategory = category ? topic.category && topic.category.includes(category) : true;

    return checkType && checkCategory;
  });
};

exports.getTopic = async function(slug) {
  const allTopics = await getAllTopics();

  return allTopics.find(topic => topic.slug === slug);
};

async function getAllTopics() {
  const reader = util.promisify(fs.readFile);
  let allTopics = await reader(path.join(appRoot, 'db', 'topics.json'), 'utf8');
  return JSON.parse(allTopics);
};
