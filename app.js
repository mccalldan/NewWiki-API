// Node Package Modules

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express =  require("express");

// Setting up App

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// Setting Models and Schema

const articleSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

// Express Routes

app.get("/articles", function(req,res){

  Article.find({}, function(err, foundArticles){
      console.log(foundArticles);
  });

});

// Server Setup

app.listen(process.env.PORT || 3000, function(){
  console.log("Server listening on 3000");
});
