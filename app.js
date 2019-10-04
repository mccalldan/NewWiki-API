// Node Package Modules

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");

// Setting up App

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

// Setting Models and Schema

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// Requests Targeting All Articles

app.route("/articles")

  .get(function(req, res) {

    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }

    });

  })

  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.")
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {

    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Deleted Articles");
      } else {
        res.send(err);
      }
    });
  });

// Requests Targeting Specific Article

app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      } else {
        res.send("No article match.");
      }
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Updated article.");
      } else {
        res.send("Not Updated");
      }
    });
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Updated article!");
      } else {
        res.send(err)
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err, foundArticle){
      if(!err){
        res.send("Deleted!");
      } else {
        res.send(err);
      }
    }
  );
});


// Server Setup

app.listen(process.env.PORT || 3000, function() {
  console.log("Server listening on 3000");
});
