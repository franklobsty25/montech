var express = require("express");
var router = express.Router();
var { check } = require("express-validator");
var { auth, verifyEditor } = require("../auth");

var articlesController = require("../controllers/articles-controller");

// Get articles route
router.get("/", articlesController.getArticles);

// Authentication before accessing further routes
router.use(auth);

// Getarticlse by Id
router.get("/article/:articleId", articlesController.getArticleById);

// Get author by Id
router.get("/user/article", articlesController.getArticlesByUserId);

// Create article route
router.post(
  "/create",
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  articlesController.createArticle
);

router.put(
  "/update/:articleId",
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  articlesController.updateArticleById
);

// Delete article
router.delete("/delete/:articleId", articlesController.deleteArticleById);

router.use(verifyEditor);

// Editor route to approve or reject an article
router.put(
  "/status/:articleId",
  [check("status").not().isEmpty()],
  articlesController.approveRejectArticleStatus
);

module.exports = router;
