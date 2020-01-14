const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fs = require("fs");
const app = express();
require("dotenv").config();
app.use(cookieParser());

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

// data
const users = require("./data/users.json");
const secrets = require("./data/secrets.json");

// posts array
let postsArr = [];
let counterID = 1;

app.use(
  session({
    secret: process.env.SECRET
  })
);

app.get("/", (req, res) => {
  // store added post in object
  res.render("index");
});

// add posts
app.post("/add", (req, res) => {
  counterID++;
  postsArr.push({
    post: req.body.post,
    _id: counterID
  });
  res.redirect("/dashboard");
});

// delete posts
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  postsArr = postsArr.filter(post => post._id != id);
  res.redirect("/dashboard");
});

// edit posts
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const note = postsArr.find(post => post._id == id);
  note.post = req.body.post;
  res.redirect("/dashboard");
});

// register & hash password
app.post("/register", (req, res) => {
  if (req.body.password == req.body.repeatPassword) {
    const user = users.find(user => user.username == req.body.username);
    if (user) {
      res.send("User already exists");
    } else {
      // const passwordHash = await bcrypt.hash(req.body.password, 10);
      const newUser = {
        username: req.body.username,
        password: req.body.password
      };
      users.push(newUser);
      fs.writeFileSync("./data/users.json", JSON.stringify(users));
      req.session.user = newUser.username;
      res.redirect("/dashboard");
    }
  } else {
    res.send("Passwords do not match");
  }
});

// login
app.post("/auth", (req, res) => {
  const user = users.find(user => user.username == req.body.username);
  if (!user) {
    res.status(403).send("Invalid Credentials!");
  } else {
    // const passwordMatch = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );
    // const passwordMatch = req.body.password === user.password;
    if (req.body.password === user.password) {
      req.session.user = user.username;
      res.redirect("/dashboard");
    } else {
      res.status(403);
      res.send("Invalid Credentials");
    }
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});

// Dashboard
app.get("/dashboard", (req, res) => {
  res.render("dashboard", { data: postsArr });
});

// logout
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) res.status(403).send(`Error: ${err}`);
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
