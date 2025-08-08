// jobs/fetchNews.js
const axios = require('axios');
const Article = require('../models/Article');
const cron = require('node-cron');
const User = require('../models/User');

const fetchNewsJob = (io) => {
  cron.schedule('0 * * * *', async () => {
    console.log('🕒 Running news fetch job...');
    console.log("Fetching news at", new Date());


    const categories = ['technology', 'sports', 'business'];

    for (const category of categories) {
      try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            category,
            country: 'us',
            apiKey: process.env.NEWS_API_KEY,
          },
        });

        const articles = response.data.articles;

        for (const news of articles) {
          const exists = await Article.findOne({ url: news.url });
          if (!exists) {
            const newArticle = await Article.create({
              title: news.title,
              description: news.description,
              url: news.url,
              source: news.source.name,
              category,
              publishedAt: news.publishedAt || new Date(),
              favoritedBy: [],
            });

            // 🔔 Notify users who match this category
            const users = await User.find({ preferences: category });
            for (const user of users) {
              const connectedUsers = io.of("/").adapter.rooms; // or get from app.set
              const socketId = app.get('connectedUsers')[user._id.toString()];
              if (socketId) {
                io.to(socketId).emit('new-article', newArticle);
              }
            }
          }
        }
      } catch (err) {
        console.error(`❌ Error fetching ${category} news:`, err.message);
      }
    }

    console.log('✅ News fetch job completed.');
  });
};

module.exports = fetchNewsJob;
