const mongoose = require('mongoose');
const { type } = require('os');
const { title } = require('process');

const ArticleSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    url:String,
    source: String,
    category:String,
    publishedAt:Date,
    favoritedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]

});



module.exports = mongoose.model('Article',ArticleSchema);