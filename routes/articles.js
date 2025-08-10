// routes/articles.js
const express = require('express');
const axios = require('axios');
const Article = require('../models/Article');
const authMiddleware = require('../middleware/authMiddleware');
const { getIO } = require("../sockets/socket");
const User = require("../models/User");


const router = express.Router();

// GET /articles/fetch - fetch from NewsAPI & save to DB
router.get('/fetch', authMiddleware, async (req, res) => {
  try {
    const apiKey = process.env.NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
    
    const { data } = await axios.get(url,{ timeout: 8000 });

    if (!data.articles) {
      return res.status(500).json({ message: 'No articles found from API' });
    }

    let savedCount = 0;

    await Promise.all(
      data.articles.map(async (item) => {
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
          getIO().emit('new-article', newArticle);
        }
      })
    );

    res.json({ message: `Fetched and saved ${savedCount} new articles` });

  } catch (err) {
    console.error('Error fetching articles:', err.message);
    res.status(500).json({ message: 'Error fetching articles', error: err.message });
  }
});

// GET /articles - list all saved articles
router.get('/', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching from DB' });
  }
});

router.post("/:id/favorite", authMiddleware, async(req,res)=>{
  try{
    const userId = req.user.userId;
    const articleId = req.params.id;

    //check if the article is already exists 
    const article = await Article.findById(articleId);
    if (!article){
      return res.status(404).json({ message:"Article not found "});

    }
    //if not already there

    const user = await User.findById(userId);

    if (!user.favorites.includes(articleId)){
      user.favorites.push(articleId);
      await user.save();
      return res.json({ message: "Article added to favorite "});

    }

    res.json({ message: "Article is already exists in favorite list"});

  }catch(err){
    res.status(500).json({message:"Error adding favorite",error:err.message})
  }
});

// DELETE /articles/:id/favorite
router.delete('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const articleId = req.params.id;

    // Ensure the article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Find the user
    const user = await User.findById(userId);

    // Check if the article is in the user's favorites
    const index = user.favorites.findIndex(
      favId => favId.toString() === articleId
    );

    if (index === -1) {
      return res.status(400).json({ message: 'Article not in favorites' });
    }

    // Remove from favorites
    user.favorites.splice(index, 1);
    await user.save();

    res.json({ message: 'Article removed from favorites successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to unfavorite article',
      error: err.message
    });
  }
});






router.get("/favorites",authMiddleware,async(req,res)=>{
  try{
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("favorites");
    res.json(user.favorites);
  }catch(err){
    res.status(500).json({ message: "error fetching favorites",error:err.message});
  }
});

router.get("/:id",authMiddleware,async(req,res)=>{
  try{
    const article = await Article.findById(req.params.id);
    if(!article)
      return res.status(404).json({message:"Article not found"});
      res.json(article);
    
  }catch(err){
    res.status(500).json({message:"Error Fetching Article",error:err.message});
  }
});





module.exports = router;
