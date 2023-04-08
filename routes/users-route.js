var express = require("express");
var router = express.Router();
var { check } = require("express-validator");

var usersController = require("../controllers/users-controller");
var { auth } = require("../auth");

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Returns a list of users
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *            components:
 *             schemas:
 *               ArrayOfUsers:
 *                 items:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   articles:
 *                     type: array
 *                 example:
 *                  firstName: Frank
 *                  lastName: Kodie
 *                  email: frankkodie@yahoo.com
 *                  role: user
 *                  article: []
 */
router.get("/", usersController.getUsers);

// Author signup route
/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add a new user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string
 *                lastName:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *              example:
 *                firstName: Frank
 *                lastName: Kodie
 *                email: frankkodie@yahoo.com
 *                password: Frank@12345?
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              userId: 64309e341e583cf424b9e1e7
 *              email: frankkodie@yahoo.com
 *              token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZWQxNjkxNGZkNzk5ZDUzNDA4YTAyYSIsImVtYWlsIjoiZnJhbmsuYWR1QGJlbnRvLmFmcmljYSIsImlhdCI6MTY4MDg5NTgzOSwiZXhwIjoxNjgwOTgyMjM5fQ.-WT1kdWcqZz1fQMfr2vfNhbAD1QE76BlaKSleLuSFqg...
 *       '400':
 *        description: Bad request
 */
router.post(
  "/signup",
  [
    check("firstName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("email").normalizeEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

// Author login route
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: A user login
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *              example:
 *                email: frankkodie@yahoo.com
 *                password: Frank@12345?
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              userId: 64309e341e583cf424b9e1e7
 *              email: frankkodie@yahoo.com
 *              token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZWQxNjkxNGZkNzk5ZDUzNDA4YTAyYSIsImVtYWlsIjoiZnJhbmsuYWR1QGJlbnRvLmFmcmljYSIsImlhdCI6MTY4MDg5NTgzOSwiZXhwIjoxNjgwOTgyMjM5fQ.-WT1kdWcqZz1fQMfr2vfNhbAD1QE76BlaKSleLuSFqg...
 *       '400':
 *         description: Bad request
 */
router.post(
  "/login",
  [
    check("email").normalizeEmail(), 
    check("password").isLength({ min: 6 })
  ],
  usersController.login
);

// Authentication
router.use(auth);

// Logout user
router.get("/logout", (req, res) => {
  res.status(200).json({token: null});
});

module.exports = router;
