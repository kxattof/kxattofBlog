const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ARTICLES_PATH = path.join(__dirname, "articles.json");
const ARTICLES_DIRECTORY = path.join(__dirname, "Articles");
const PUBLIC_DIRECTORY = path.join(__dirname, "public");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html", "htm"] }));

const imageContainerHtml =
  "<div class='article-image-box' data-layout='{{ALIGNMENT}}' style='flex-direction: {{ALIGNMENT}};'> <div class='article-image-container'> <img src='{{IMAGE_SRC}}' alt='{{CAPTION}}' class='article-image'/> </div> <div class='article-image-caption-container'> <p class='article-image-caption'>{{CAPTION}}</p> </div> </div>";

function htmlThings(value) {
  return String(value).replace(
    /<img>(.*?);;\s*(.*?);;\s*(.*?)<\/img>/g,
    (match, src, caption, alignment) => {
      return imageContainerHtml
        .replace("{{IMAGE_SRC}}", src.trim())
        .replaceAll("{{CAPTION}}", caption.trim())
        .replaceAll("{{ALIGNMENT}}", alignment.trim());
    },
  );
}

function renderMarkdown(markdown) {
  if (!markdown) {
    return "";
  }

  const lines = markdown.replace(/\r/g, "").split("\n");
  let html = "";
  let paragraphLines = [];

  const flushParagraph = () => {
    if (paragraphLines.length) {
      html += `<p>${paragraphLines.join(" ")}</p>\n`;
      paragraphLines = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length;
      html += `<h${level}>${headingMatch[2]}</h${level}>\n`;
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      html += `<ul><li>${trimmed.replace(/^[-*]\s+/, "")}</li></ul>\n`;
      return;
    }

    if (/^>\s+/.test(trimmed)) {
      flushParagraph();
      html += `<blockquote>${trimmed.replace(/^>\s+/, "")}</blockquote>\n`;
      return;
    }

    if (/^<[^>]+>.*<\/[^>]+>$/.test(trimmed) || /^<[^>]+>$/.test(trimmed)) {
      flushParagraph();
      html += `${trimmed}\n`;
      return;
    }

    paragraphLines.push(trimmed);
  });

  flushParagraph();

  return htmlThings(html);
}

async function loadArticles() {
  const raw = await fs.readFile(ARTICLES_PATH, "utf-8");
  return JSON.parse(raw);
}

app.get(["/", "/home"], async (req, res) => {
  try {
    const data = await loadArticles();
    res.render("home", {articles: data.blog.articles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.get("/article/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const data = await loadArticles();
    const article = data.blog.articles.find((entry) => entry.id === id);

    if (!article || !article.source) {
      return res.status(404).render("404", { reason: "Article not found" });
    }

    const contentPath = path.join(ARTICLES_DIRECTORY, article.source);
    const content = await fs.readFile(contentPath, "utf-8");

    res.render("article", {
      pageTitle: `Kxattof | ${article.title}`,
      articleTitle: article.title,
      articleContent: renderMarkdown(content),
      articleId: id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.get("/about", async (req, res) => {
  try {
    const contentPath = path.join(PUBLIC_DIRECTORY, "about-content.md");
    const content = await fs.readFile(contentPath, "utf-8");

    return res.render("about", {
      articleContent: (content),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
});

app.get("/.env", (req, res) => {
  res.json({ message: "Nice try, lmfao" })
});

app.get("/server.js", (req, res) => {
  res.send("Nice try, lmfao");
});

app.use("/articles.json", express.static(path.join(__dirname, "articles.json")));

app.use((req, res) => {
  return res.status(404).render("404", { reason: "Page not found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
