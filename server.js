const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

// posts array
let postsArr = [];
let counterID = 1;

app.get("/", (req, res) => {
  // store added post in object
  res.render("index", { data: postsArr });
});

// add posts
app.post("/add", (req, res) => {
  counterID++;
  postsArr.push({ post: req.body.post, _id: counterID });
  res.redirect("/");
});

// delete posts
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  postsArr = postsArr.filter(post => post._id != id);
  res.redirect("/");
});

// edit posts
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  postsArr = postsArr.filter(post => post._id != id);
  res.redirect("/");
});

// update posts
app.post("/update/:id", (req, res) => {
  const id = req.params.id;
  postsArr = postsArr.filter(post => post._id != id);
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
