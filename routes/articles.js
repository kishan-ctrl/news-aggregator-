const express = require("express");
const authentication = require("../middleware/auth");
const Article = require ("../models/Article");
const authenticate = require("../middleware/auth");
const { route } = require("./auth");


const router = express.Router();


router.get("/",authentication, async(req,res)=>{
    try{

        const preferences = req.user.preferences;
        const articles = await Article.find({category: {$in: preferences}});
        res.json(articles);


    }catch(error){
        res.status(500).json({
            message: "fail to fetch Articles",error:error.message
        });


    }

}
);





// POST /articles — Manually add an article (for development/testing only)
router.post('/', async (req, res) => {
  try {
    const { title, description, url, source, category, publishedAt } = req.body;

    const article = await Article.create({
      title,
      description,
      url,
      source,
      category,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    });

    res.status(201).json({ message: 'Article created successfully', article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create article', error: err.message });
  }
});

router.post('/:id/favorite', authenticate, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
        return res.status(404).json({ message: 'Article not found' });
    }

    if (!article.favoritedBy.includes(req.user._id)) {
      article.favoritedBy.push(req.user._id);
      await article.save();
    }

    res.json({ message: 'Article added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to favorite article', error: err.message });
  }
});





router.delete("/:id/favorite", authenticate, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id); // ❗ fix: use .id not .params

    if (!article) return res.status(404).json({ message: "Article not found" });

    // Remove user from favoritedBy
    article.favoritedBy = article.favoritedBy.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    await article.save();
    res.json({ message: "Article removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unfavorite article", error: error.message });
  }
});


router.get("/favorites", authenticate, async (req, res) => {
  try {
    const articles = await Article.find({ favoritedBy: req.user._id });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites", error: err.message });
  }
});

router.get("/:id",async(req,res)=>{
    try{
        const article = await Article.findById(req.params.id);
        if(!article) return res.status(404).json({message:"Article not found"});
        res.json(article);
    } catch (err) {
        res.status(500).json({message:"Error fetching Articles ",error:err.message});
    }
});




module.exports=router;






