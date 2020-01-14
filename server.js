const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

// posts array
let postsArr = [];
let counterID = 1;
let err;

app.get("/", (req, res) => {
  // store added post in object
  res.render("index", { data: postsArr, err: err });
});

// add posts
app.post("/add", (req, res) => {
  counterID++;
  postsArr.push({
    post: req.body.post,
    _id: counterID
  });
  err = !req.body.post ? "Please post something..." : "";
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
  const note = postsArr.find(post => post._id == id);
  note.post = req.body.post;
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
