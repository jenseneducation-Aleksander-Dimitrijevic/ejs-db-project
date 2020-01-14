const articles = document.querySelectorAll(".notes");
for (let article of articles) {
  const editButton = article.querySelector(".edit-btn");
  editButton.addEventListener("click", () => {
    article.querySelector(".edit-form").classList.toggle("hidden");
    article.querySelector(".article-content").classList.toggle("hidden");
  });
}
