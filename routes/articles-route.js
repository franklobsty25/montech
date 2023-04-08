var express = require("express");
var router = express.Router();
var { check } = require("express-validator");
var { auth, verifyEditor } = require("../auth");

var articlesController = require("../controllers/articles-controller");

// Get articles route
/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Returns a list of articles
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *                 type: array
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   status:
 *                     type: string
 *                   user:
 *                     type: string
 *                 example:
 *                  title: Appollo Thirteen
 *                  content: Appollo was a great person from city titans
 *                  status: Approved
 *                  user: 64309e341e583cf424b9e1e7
 */
router.get("/", articlesController.getArticles);

// Authentication before accessing further routes
router.use(auth);

// Getarticlse by Id
/**
 * @swagger
 * /api/v1/articles/article/{articleId}:
 *   get:
 *     security: [ Authorization: []]
 *     tags:
 *       - Articles
 *     summary: Returns specific article
 *     parameters:
 *      - name: articleId
 *        in: path
 *        description: Article ID
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   status:
 *                     type: string
 *                   user:
 *                     type: string
 *                 example:
 *                  title: Appollo Thirteen
 *                  content: Appollo was a great person from city titans
 *                  status: Approved
 *                  user: 64309e341e583cf424b9e1e7
 */
router.get("/article/:articleId", articlesController.getArticleById);

// Get article by userId
// Getarticlse by Id
/**
 * @swagger
 * /api/v1/articles/{user}/article:
 *   get:
 *     security: [ Authorization: []]
 *     tags:
 *       - Articles
 *     summary: Returns Article created by a specific user
 *     parameters:
 *      - name: user
 *        in: path
 *        description: User ID
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   status:
 *                     type: string
 *                   user:
 *                     type: string
 *                 example:
 *                  title: Appollo Thirteen
 *                  content: Appollo was a great person from city titans
 *                  status: Approved
 *                  user: 64309e341e583cf424b9e1e7
 */
router.get("/:user/article", articlesController.getArticlesByUserId);

// Create article route
/**
 * @swagger
 * /api/v1/articles/create:
 *   post:
 *     security: [ Authorization: []]
 *     tags:
 *       - Articles
 *     summary: Add an article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              content:
 *                type: string
 *     responses:
 *       UnauthorizedError:
 *         description: Unauthorized
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   status:
 *                     type: string
 *                   user:
 *                     type: string
 *                 example:
 *                  title: Appollo Thirteen
 *                  content: Appollo was a great person from city titans
 *                  status: Approved
 *                  user: 64309e341e583cf424b9e1e7
 */
router.post(
  "/create",
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  articlesController.createArticle
);

// Update article
/**
 * @swagger
 * /api/v1/articles/update/{articleId}:
 *   put:
 *     security: [ Authorization: []]
 *     tags:
 *       - Articles
 *     summary: Edit an article
 *     parameters:
 *       - name: articleId
 *         in: path
 *         description: Article ID
 *         required: true
 *         schema:
 *          type: string
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              content:
 *                type: string
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   status:
 *                     type: string
 *                   user:
 *                     type: string
 *                 example:
  *                  title: Appollo Thirteen
  *                  content: Appollo was a great person from city titans
  *                  status: Approved
  *                  user: 64309e341e583cf424b9e1e7
 */
router.put(
  "/update/:articleId",
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  articlesController.updateArticleById
);

// Delete article
/**
 * @swagger
 * /api/v1/articles/delete/{articleId}:
 *   delete:
 *     security: [ Authorization: []]
 *     tags:
 *       - Articles
 *     summary: Delete an article
 *     parameters:
 *       - name: articleId
 *         in: path
 *         description: Article ID
 *         required: true
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 example:
 *                  message: Article deleted
 */
router.delete("/delete/:articleId", articlesController.deleteArticleById);

router.use(verifyEditor);

// Editor route to approve or reject an article
/**
 * @swagger
 * /api/v1/articles/status/{articleId}:
 *   put:
 *     security: [ Authorization: []]
 *     tags:
 *       - Articles
 *     summary: Approve an article status
 *     parameters:
 *       - name: articleId
 *         in: path
 *         description: Article ID
 *         required: true
 *         schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   status:
 *                     type: string
 *                   user:
 *                     type: string
 *                 example:
  *                  title: Appollo Thirteen
  *                  content: Appollo was a great person from city titans
  *                  status: Approved
  *                  user: 64309e341e583cf424b9e1e7
 */
router.put(
  "/status/:articleId",
  [check("status").not().isEmpty()],
  articlesController.approveRejectArticleStatus
);

module.exports = router;
