// news-viewer.js
document.addEventListener("DOMContentLoaded", () => {
  customElements.define("news-viewer", NewsViewer);
});

class NewsViewer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.loadArticles();
  }

  getCategoryURL() {
    // Detectar la categoría según el nombre de archivo actual
    const page = window.location.pathname.split("/").pop();
    switch (page) {
      case "worldnews.html":
        return "https://news-foniuhqsba-uc.a.run.app/World News";
      case "sport.html":
        return "https://news-foniuhqsba-uc.a.run.app/Sport";
      case "finance.html":
        return "https://news-foniuhqsba-uc.a.run.app/Finance";
      case "technology.html":
        return "https://news-foniuhqsba-uc.a.run.app/Technology";
      case "entertainment.html":
        return "https://news-foniuhqsba-uc.a.run.app/Entertainment";
      default:
        return "https://news-foniuhqsba-uc.a.run.app"; // Página principal o URL predeterminada
    }
  }

  async loadArticles() {
    try {
      // const response = await fetch("https://news-foniuhqsba-uc.a.run.app");
      const url = this.getCategoryURL();
      const response = await fetch(url);
      console.log(`Fetching articles from: ${url}`);
      if (!response.ok) {
        throw new Error("Error al obtener los artículos");
      }
      const articles = await response.json();
      console.log(articles);
      this.renderArticles(articles);
    } catch (error) {
      console.error("Error:", error);
      this.innerHTML = `<p>Error al cargar los artículos. Inténtelo nuevamente más tarde.</p>`;
    }
  }

  renderArticles(articles) {
    const gridContainer = document.getElementById("grid-container");
    if (!gridContainer) {
      console.error("No se encontró el elemento grid-container en el DOM");
      return;
    }
    const template = document.getElementById("article-template");

    // Limpiar contenido existente
    gridContainer.innerHTML = "";
    // this.innerHTML = "";

    articles.forEach((article) => {
      // Clonar el contenido de la plantilla
      const articleContent = document.importNode(template.content, true);

      // Rellenar la plantilla con los datos del artículo
      articleContent.querySelector(".title").textContent = article.headline;
      articleContent.querySelector(
        ".link"
      ).href = `./article.html?id=${article.id}`;

      articleContent.querySelector(".author").textContent = article.author;
      articleContent.querySelector(".description").innerHTML = article.body;

      // Añadir el artículo al componente
      gridContainer.appendChild(articleContent);
      // this.appendChild(articleContent);
    });
  }
}

// Definir el elemento personalizado
customElements.define("news-viewer", NewsViewer);

const getId = () => {
  const searchParams = new URLSearchParams(location.search.slice(1));
  return Number(searchParams.get("id"));
};
class CustomArticle extends HTMLElement {
  constructor() {
    super();
    this.id = getId();
    console.log({ id: this.id });
  }

  connectedCallback() {
    this.render();
  }

  async loadArticles() {
    return fetch("https://news-foniuhqsba-uc.a.run.app").then((res) =>
      res.json()
    );
  }

  async render() {
    // 1. API get All Articles
    const articles = await this.loadArticles();
    console.log({ articles });
    // 2. filter the 'article' by the id `this.id`
    const article = articles.find((article) => article.id == this.id);
    console.log({ article });
    // 3. remplace the html with the article data
    // Rellenar la plantilla con los datos del artículo
    this.querySelector(".title").textContent = article.headline;
    this.querySelector(".author").textContent = article.author;
    this.querySelector(".art-description").innerHTML = article.body;
    console.log("OK");
  }
}

customElements.define("custom-article", CustomArticle);
