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


/////////////////////////All Articles///////////////////////////////////


app.route("/articles")

    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            err ? res.send(err) : res.send(foundArticles);
        });
    })

    .post((req, res) => {
        const reqArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        reqArticle.save((err) => {
            err ? res.send(err) : res.send("Successfully added new Article.");
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            err ? res.send(err) : res.send("Successfully deleted all Articles.");
        });
    });


/////////////////////////Individual Articles///////////////////////////////////


app.route("/articles/:articleTitle")

    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundDoc) => {
            if (!err) {
                if (!foundDoc) {
                    res.send(`Oh no! No Articles with name \"${req.params.articleTitle}\" in \
                        Database. Please check your spelling and try again.`);
                } else {
                    res.send(foundDoc);
                }
            } else {
                res.send(err);
            }
        });
    })

    .put((req, res) => {
        Article.findOneAndUpdate({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            }, {
                // false By default
                overwrite: true
            },
            (err) => {
                err ? res.send(err) : res.send("Successfully updated Article.");
            });
    })

    .patch((req, res) => {
        Article.findOneAndUpdate({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            (err) => {
                err ? res.send(err) : res.send("Successfully patched Article.");
            });
    })

    .delete((req, res) => {
        Article.deleteOne({
            title: req.params.articleTitle
        }, (err) => {
            err ? res.send(err) : res.send("Successfully deleted Article.");
        });
    });


app.listen(3000, () => {
    console.log("Server started on port 3000");
});