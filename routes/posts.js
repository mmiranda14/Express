const { Router } = require("express");
var express = require("express");
var router = express.Router();
const mysql = require("mysql2");
const { render } = require("../app");
var models = require("../models");
const users = require("../models/users");
var authService = require("../services/auth");

router.get("/", function (req, res, next) {
	let token = req.cookies.jwt;
	if (token) {
		authService.verifyUser(token).then(user => {
			if (user) {
				models.posts
					.findAll({
						where: { UserId: user.UserId, Deleted: false },
					})
					.then(result => res.render("posts", { posts: result }));
			} else {
				res.status(401);
				res.send("Invalid authentication token");
			}
		});
	} else {
		res.status(401);
		res.send("Must be logged in");
	}
});

router.get("/:id", function (req, res, next) {
	let postId = parseInt(req.params.id);
	models.posts.findOne({ where: { PostId: postId }, raw: true }).then(post => {
		console.log(post);
		res.render("editPost", post);
	});
});

router.post("/", function (req, res, next) {
	let token = req.cookies.jwt;
	if (token) {
		authService.verifyUser(token).then(user => {
			if (user) {
				models.posts
					.findOrCreate({
						where: {
							UserId: user.UserId,
							PostTitle: req.body.postTitle,
							PostBody: req.body.postBody,
						},
					})
					.spread((result, created) => res.redirect("/posts"));
			} else {
				res.status(401);
				res.send("Invalid authentication token");
			}
		});
	} else {
		res.status(401);
		res.send("Must be logged in");
	}
});

module.exports = router;
