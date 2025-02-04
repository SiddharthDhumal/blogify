const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const userRouter = require("./routes/user_routes");
const blogRouter = require("./routes/blog_routes");
const mongoose = require("mongoose");
const {
	checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const Blog = require("./models/blog_model");

const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URL).then(() => {
	console.log("Database is connected");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve(path.resolve("./public"))));

app.get("/", async (req, res) => {
	const allBlogs = await Blog.find({});
	res.render("home", {
		user: req.user,
		blogs: allBlogs,
	});
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(port, () => {
	console.log(`server is listening at port: ${port}`);
});
