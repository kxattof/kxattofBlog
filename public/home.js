fetch('articles.json')
  .then(response => response.json())
  .then(data => {
    const articlesArray = data.blog.articles;

    const content = document.querySelector(".content");
    const itemContainerContainer = document.createElement("div");
    itemContainerContainer.className = "itemContainerContainer";

    const importantContainer = document.createElement("div");
    importantContainer.className = "itemContainer";

    const otherContainer = document.createElement("div");
    otherContainer.className = "itemContainer";

    const spacer = document.createElement("div");
    spacer.className = "verticalSpacer";

    itemContainerContainer.appendChild(importantContainer);
    itemContainerContainer.appendChild(spacer);
    itemContainerContainer.appendChild(otherContainer);

    content.appendChild(itemContainerContainer);

    articlesArray.forEach((article) => {
      let targetContainer = otherContainer;
      if (article.important) {
        targetContainer = importantContainer;
      }

      const articleElement = document.createElement("div");
      articleElement.className = "article";

      if (article.image) {
        const imageElement = document.createElement("img");
        imageElement.src = article.image;
        imageElement.alt = article.title || "Article image";
        imageElement.className = "articleImage";
        articleElement.appendChild(imageElement);
      }

      const titleElement = document.createElement("h2");
      titleElement.textContent = article.title;
      titleElement.classList.add("hepta");

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = article.description;
      descriptionElement.classList.add("montserrat");

      articleElement.appendChild(titleElement);
      articleElement.appendChild(descriptionElement);
      articleElement.addEventListener("click", () => {
      window.location.href = `/article/${article.id}`;
      });

      targetContainer.appendChild(articleElement);
    });
  });
