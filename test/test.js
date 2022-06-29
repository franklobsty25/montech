var request = require("supertest");
var { expect } = require("chai");
var dotenv = require("dotenv").config();

var app = require("../app");
var User = require("../models/user");
var Role = require("../models/role");
var Article = require("../models/article");

var token;
var articleId;

describe("Montech API", () => {
  // Test GET route
  describe("GET /api/v1/users", () => {
    it("It should GET all the users array", (done) => {
      request(app)
        .get("/api/v1/users/")
        .expect(200)
        .then((res) => {
          expect(res.body.data).to.a("array");
          done();
        })
        .catch((err) => done(err));
    });
  });

  // Test GET by Id route

  // Test POST route
  describe("POST /api/v1/users/signup", () => {
    it("It should register user with valid credentials", (done) => {
      request(app)
        .post("/api/v1/users/signup")
        .send({
          firstName: "Frank",
          lastName: "Kodie",
          email: "frankkodie@yahoo.com",
          password: "frankkodie",
          role: "1",
          articles: [],
        })
        .expect(201)
        .then((res) => {
          expect(res.body.email).to.eql("frankkodie@yahoo.com");
          token = `Bearer ${res.body.token}`;
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("POST /api/v1/users/signup", () => {
    it("It shouldn't accept user already exists", (done) => {
      request(app)
        .post("/api/v1/users/signup")
        .send({
          firstName: "Frank",
          lastName: "Kodie",
          email: "frankkodie@yahoo.com",
          password: "frankkodie",
          role: "1",
          articles: [],
        })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.eql("User with email already exists.");
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("POST /api/v1/users/login", () => {
    it("It shouldn't accept invalid password", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          email: "frankkodie@yahoo.com",
          password: "frankkodi",
        })
        .expect(403)
        .then((res) => {
          expect(res.body.message).to.eql(
            "Please invalid password, try again!"
          );
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("POST /api/v1/articles/create", () => {
    it("It should create user article object", (done) => {
      request(app)
        .post("/api/v1/articles/create")
        .send({
          title: "Coding Challenge",
          content: "This is a coding challenge",
        })
        .set({ Authorization: token })
        .expect(201)
        .then((res) => {
          expect(res.body.data).to.a("object");
          articleId = res.body.data._id;
          done();
        })
        .catch((err) => done(err));
    });
  });

  // Test PUT route
  describe("PUT /api/v1/articles/update", () => {
    it("It should edit user article", (done) => {
      request(app)
        .put("/api/v1/articles/update/" + articleId)
        .send({
          title: "Montech Test",
          content: "This is montech apitudes test",
        })
        .set({ Authorization: token })
        .expect(200)
        .then((res) => {
          expect(res.body.data).to.a("object");
          done();
        })
        .catch((err) => done(err));
    });
  });

  // Test DELETE route
  describe("DE;ETE /api/v1/articles/delete", () => {
    it("It should delete user article", (done) => {
      request(app)
        .delete("/api/v1/articles/delete/" + articleId)
        .set({ Authorization: token })
        .expect(200)
        .then((res) => {
          expect(res.body.message).to.eql("Article deleted.");
          done();
        })
        .catch((err) => done(err));
    });
  });

  // Delete temporary data from database
  after(async () => {
    try {
      await User.deleteOne({ email: "frankkodie@yahoo.com" });
      await Role.deleteOne({ name: "author" });
      await Article.deleteOne({ title: "Coding Challenge" });
    } catch (err) {
      console.error(err);
    }
  });
});
