// cronJobs/fetchArticles.js
const axios = require('axios');
const Article = require('../models/Article');
const { getIO } = require('../sockets/socket');

const fetchArticles = async () => {
  try {
    const apiKey = process.env.NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    const { data } = await axios.get(url);

    if (!data.articles) {
      console.log('No articles found from API');
      return;
    }

    let savedCount = 0;

    for (const item of data.articles) {
      const exists = await Article.findOne({ url: item.url });
      if (!exists) {
        const newArticle = await Article.create({
          title: item.title,
          description: item.description,
          url: item.url,
          source: item.source?.name,
          publishedAt: item.publishedAt,
          content: item.content
        });
        savedCount++;

        // Emit Socket.IO event
        getIO().emit('new-article', newArticle);
      }
    }

    if (savedCount > 0) {
      console.log(`Cron job: saved ${savedCount} new articles`);
    } else {
      console.log('Cron job: no new articles found');
    }

  } catch (err) {
    console.error('Error in fetchArticles cron job:', err.message);
  }
};

module.exports = fetchArticles;
