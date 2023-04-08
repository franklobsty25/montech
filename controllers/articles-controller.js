var mongoose = require("mongoose");
var { validationResult } = require("express-validator");

var User = require("../models/user");
var Article = require("../models/article");

// Get all articles
var getArticles = async (req, res, next) => {
  try {
    var articles = await Article.find({});

    res.status(200).json({ data: articles });
  } catch (err) {
    return next(err);
  }
};

// Get specific article with id
var getArticleById = async (req, res, next) => {
  var articleId = req.params.articleId;

  try {
    var article = await Article.findById(articleId);

    if (!article) {
      return next(new Error("Article with id: " + articleId + " not found."));
    }

    res.status(200).json({ data: article });
  } catch (err) {
    return next(err);
  }
};

// Get author article(s) with it's id
var getArticlesByUserId = async (req, res, next) => {
  var userId = req.params.user;

  try {
    var authorWithArticles = await User.findById(userId).populate("articles");

    if (!authorWithArticles || authorWithArticles.articles.length === 0) {
      return next(new Error("No articles found for author."));
    }

    res.status(200).json({ data: authorWithArticles });
  } catch (err) {
    return next(err);
  }
};

// Creating article(s)
var createArticle = async (req, res, next) => {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs passed, please check your data."));
  }

  var { title, content } = req.body;

  try {
    var createdArticle = new Article({
      title,
      content,
      user: req.userId,
    });

    var user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).send({message: "User could not be found."});
    }

    var sess = await mongoose.startSession();
    sess.startTransaction();
    await createdArticle.save({ session: sess });
    user.articles.push(createdArticle);
    await user.save({ session: sess });
    await sess.commitTransaction();

    res.status(201).json({ data: createdArticle });
  } catch (err) {
    return next(err);
  }
};

var updateArticleById = async (req, res, next) => {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next("Invalid inputs passed, please check your data.");
  }

  try {
    var articleId = req.params.articleId;

    var { title, content } = req.body;

    var article = await Article.findById(articleId);

    if (article.user.toString() === articleId) {
      return next(new Error("You are not authorized to edit this article."));
    }

    article.title = title;
    article.content = content;

    await article.save();

    res.status(200).json({ data: article });
  } catch (err) {
    return next(err);
  }
};

var deleteArticleById = async (req, res, next) => {
  var articleId = req.params.articleId;
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next("Invalid inputs passed, please check your data.");
  }

  try {
    var article = await Article.findById(articleId).populate("user");

    if (article.user.id !== req.userId) {
      return next(new Error("You are not authorized to delete this article."));
    }

    var sess = await mongoose.startSession();
    sess.startTransaction();
    await article.remove({ session: sess });
    article.user.articles.pull(article);
    await article.user.save({ session: sess });
    await sess.commitTransaction();

    res.status(200).json({ message: "Article deleted." });

  } catch (err) {
    return next(err);
  }
};

var approveRejectArticleStatus = async (req, res, next) => {
    var articleId = req.params.articleId;

    try {
        var article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).send({ message: "Article not found." });
        }

        article.status = req.body.status.toLowerCase();
        article.save();

        res.json({data: article});
        
    } catch (err) {
        return next(err);
    }
};

module.exports = {
  approveRejectArticleStatus,
  getArticles,
  getArticleById,
  getArticlesByUserId,
  createArticle,
  updateArticleById,
  deleteArticleById,
};
