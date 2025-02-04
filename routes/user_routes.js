const { Router } = require("express");
const User = require("../models/user_model");

const router = Router();

router.get("/signup", (req, res) => {
	return res.render("signup");
});

router.get("/signin", (req, res) => {
	return res.render("signin");
});

router.post("/signin", async (req, res) => {
	const { email, password } = req.body;
	try {
		const token = await User.matchPasswordAndGenerateToken(email, password);

		return res.cookie("token", token).redirect("/");
	} catch (error) {
		return res.render("signin", {
			error: "Incorrect mail or password",
		});
	}
});

router.get("/logout", (req, res) => {
	res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
	const { fullName, email, password } = req.body;

	const user = await User.create({
		fullName,
		email,
		password,
	});

	console.log(user);

	return res.redirect("/");
});

module.exports = router;
