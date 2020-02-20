var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var db = require("../models");

var router = express.Router();

router.get("/scrape", function (req, res) {
    axios.get("https://nature.com/nature/articles")
        .then(function (response) {
            var $ = cheerio.load(response.data);

            $("li.pb20").each(function (i, element) {
                var result = {};

                result.title = $(element)
                    .children("article")
                    .children("div")
                    .children("h3")
                    .children("a")
                    .text()
                    .trim();


                result.link = $(element)
                    .children("article")
                    .children("div")
                    .children("h3")
                    .children("a")
                    .attr("href")
                    .trim();

                result.summary = $(element)
                    .children("article")
                    .children("div")
                    .children("div")
                    .children("p")
                    .text()
                    .trim();

                result.saved = false;

                db.Article.updateOne(result, result, { upsert: true })
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
            res.send("Scrape Complete.");
        });
});

//----------------------------------------------------------------------

router.get("/", function (req, res) {
    db.Article.find({})
        .then(function (dbResults) {
            var object = {
                articles: dbResults
            };
            res.render("index", object)
        });
});

//----------------------------------------------------------------------

router.get("/saved", function (req, res) {
    db.Article.find({ saved: true })
        .then(function (dbResults) {
            var object = {
                articles: dbResults
            };
            res.render("saved", object)
        });
});

//----------------------------------------------------------------------

router.get("/saved/articles", function (req, res) {
    db.Article.find({ saved: true })
        .then(function (dbSaved) {
            res.json(dbSaved);
        }).catch(function (error) {
            res.json(error);
        });
});

//----------------------------------------------------------------------

router.get("/saved/articles/:id", function (req, res) {
    db.Article.findOne({ saved: true, _id: req.params.id })
        .then(function (result) {
            res.json(result);
        }).catch(function (error) {
            res.json(error);
        });
});

router.put("/saved/articles/:id", function (req, res) {
    db.Article.updateOne({ _id: req.params.id }, { saved: false })
        .then(function (result) {
            res.json(result);
        }).catch(function (error) {
            res.json(error);
        });
});

//----------------------------------------------------------------------

router.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.delete("/articles", function (req, res) {
    db.Article.remove({ saved: false })
        .then(function (result) {
            res.json(result);
        }).catch(function (error) {
            res.json(error);
        })
})

//----------------------------------------------------------------------

router.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("Note")
        .then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.json(err);
        });
});

router.put("/articles/:id", function (req, res) {
    db.Article.updateOne({ _id: req.params.id }, { saved: true })
        .then(function (result) {
            res.json(result);
        }).catch(function (error) {
            res.json(error);
        });
});

//----------------------------------------------------------------------

router.post("/note/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/note/:id", function (req, res) {
    db.Note.find({ _id: req.params.id })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            res.json(error);
        });
});

module.exports = router;