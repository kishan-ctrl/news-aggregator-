// jobs/fetchNewsJob.js
const axios = require('axios');
const Article = require('../models/Article');
const User = require('../models/User');
const nodemailer = require('nodemailer');

async function fetchNewsJob(io, connectedUsers) {
  console.log('🕒 Running news fetch job...');

  try {
    // Fetch news from API
    const { data } = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        country: 'us',
        apiKey: process.env.NEWS_API_KEY
      }
    });

    for (const art of data.articles) {
      // Check if exists
      const exists = await Article.findOne({ url: art.url });
      if (exists) continue;

      // Save to DB
      const newArticle = await Article.create({
        title: art.title,
        description: art.description,
        url: art.url,
        source: art.source.name,
        category: 'general',
        publishedAt: art.publishedAt
      });

      // Find interested users
      const users = await User.find({ preferences: 'general' });

      for (const user of users) {
        // 🔹 Emit to connected socket
        const socketId = connectedUsers[user._id.toString()];
        if (socketId) {
          io.to(socketId).emit('new-article', newArticle);
          console.log(`🔔 Sent article "${newArticle.title}" to ${user.email}`);
        }

        // 🔹 Send email notification
        await sendEmail(user.email, newArticle);
      }
    }

    console.log('✅ News fetch job completed.');
  } catch (err) {
    console.error('❌ Error fetching news:', err.message);
  }
}

async function sendEmail(to, article) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // your email password/app password
    }
  });

  await transporter.sendMail({
    from: `"News Bot" <${process.env.EMAIL_USER}>`,
    to,
    subject: `New Article: ${article.title}`,
    html: `
      <h3>${article.title}</h3>
      <p>${article.description}</p>
      <a href="${article.url}">Read more</a>
    `
  });

  console.log(`📧 Email sent to ${to}`);
}

module.exports = fetchNewsJob;
