const { Router } = require("express");
var express = require("express");
var router = express.Router();
const mysql = require("mysql2");
const { render } = require("../app");
var models = require("../models");
var authService = require("../services/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.get("/signup", function (req, res, next) {
	res.render("signup");
});

router.post("/signup", function (req, res, next) {
	models.users
		.findOrCreate({
			where: {
				Username: req.body.username,
			},
			defaults: {
				FirstName: req.body.firstName,
				LastName: req.body.lastName,
				Email: req.body.email,
				Password: authService.hashPassword(req.body.password),
			},
		})
		.spread(function (result, created) {
			if (created) {
				res.redirect("login");
			} else {
				res.send("This user already exists");
			}
		});
});

router.get("/profile", function (req, res, next) {
	let token = req.cookies.jwt;
	if (token) {
		authService.verifyUser(token).then(user => {
			if (user) {
				models.users
					.findAll({
						where: { UserId: user.UserId },
						include: [{ model: models.posts }],
					})
					.then(result => {
						console.log(result);
						res.render("profile", { user: result[0] });
					});
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

// router.get("/admin", function (req, res, next) {
// 	let token = req.cookies.jwt;
// 	if (token) {
// 		authService.verifyUser(token).then(user => {
// 			if (user.Admin) {
// 				models.users
// 					.findAll({
// 						where: { UserId: user.UserId },
// 						include: [{ model: models.posts }],
// 					})
// 					.then(result => {
// 						console.log(result);
// 						res.render("admin", { user: result[0] });
// 					});
// 			} else {
// 				res.status(401);
// 				res.send("Invalid authentication token");
// 			}
// 		});
// 	} else {
// 		res.status(401);
// 		res.send("Must be logged in");
// 	}
// });

router.get("/admin", function (req, res, next) {
	let token = req.cookies.jwt;
	if (token) {
		authService.verifyUser(token).then(user => {
			if (user.Admin) {
				models.users
					.findAll({ where: { Deleted: false }, raw: true })
					.then(usersFound => res.render("admin", { users: usersFound }));
			} else {
				res.send("unauthorized");
			}
		});
	}
});

// router.get("/profile", function (req, res, next) {
//   let token = req.cookies.jwt;
// 	models.users.findAll().then(user => {
// 		if (user) {
// 			res.render("profile", {
// 				FirstName: user.FirstName,
// 				LastName: user.LastName,
// 				Email: user.Email,
// 				Username: user.Username,
// 			});
// 		} else {
// 			res.send("User not found");
// 		}
// 	});
// });

router.get("/login", function (req, res, next) {
	res.render("login");
});

router.post("/login", function (req, res, next) {
	models.users
		.findOne({
			where: {
				Username: req.body.username,
				//Password: req.body.password,
			},
		})
		.then(user => {
			if (!user) {
				console.log("User not found");
				return res.status(401).json({
					message: "Login Failed",
				});
			} else {
				let passwordMatch = authService.comparePasswords(
					req.body.password,
					user.Password
				);
				if (passwordMatch) {
					let token = authService.signUser(user);
					res.cookie("jwt", token);
					//res.send("Login successful");
					res.redirect("profile");
				} else {
					console.log("Wrong password");
					res.send("Wrong password");
				}
			}
		});
});

router.get("/logout", function (req, res, next) {
	res.cookie("jwt", "", { expires: new Date(0) });
	res.send("Logged out");
});

//GET /
//Show all users, if ADMIN
router.get("/", function (req, res, next) {
	if (req.user && req.user.Admin) {
		models.users
			.findAll({})
			.then(users => res.render("users", { users: users }));
	} else {
		res.redirect("unauthorized");
	}
});

// admin edit user route specifically target ID /:id
//

module.exports = router;
