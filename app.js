const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Whether sharing your expertise, breaking news, or whatever’s on your mind, you’re in good company on 'Blog.etc'. Write down you thoughts here and let the world know about your creative and uniques ideas.";
const aboutContent = "Blog.etc is a place where you can be explore your creative side by writing down and sharing your thoughts with the community . You can get to know more about the different aspects of people by reading varieties of posts.";
const contactContent = "For publishing your posts : you can mail us at satmat199@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin_mayank:test123@cluster0.f48vq.mongodb.net/blogDB");

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    if (!err)
      res.render("home", { startingContent: homeStartingContent, posts: posts });
    else
      res.send('errrrrrrrrrrrrrrrrrrr');
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully.");
});
