const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const articlesSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articlesSchema);

app.get("/articles", (req, res) => {
    Article.find({}, (err, foundArticles) => {
        err ? res.send(err) : res.send(foundArticles);
    });
});

app.post("/articles", (req, res) => {
    const reqTitle = req.body.title;
    const reqContent = req.body.content;
    // console.log({reqTitle, reqContent});
    const reqArticle = new Article({
        title: reqTitle,
        content: reqContent
    });
    reqArticle.save((err) => {
       err ? res.send(err) : res.send("Successfully added new Article.");
    });
});

app.delete("/articles", (req, res) => {
    Article.deleteMany({}, (err) => {
        err ? res.send(err) : res.send("Successfully deleted all Articles.");
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
