async function loadProduct(jsonFile) {
  try {
    const response = await fetch(jsonFile);

     if (!response.ok) {
      throw new Error("Failed to load " + jsonFile);
    }

    const product = await response.json();
    renderProduct(product);
  } catch (error) {
    console.error("Error loading " + jsonFile, error);
  }
}

function renderProduct(product) {
  const container = document.getElementById("product");

  container.innerHTML = `
    <div class="product-card">
      <h1 align="center" class="product-title">${product.title}</h1>
      <img
        src="${product.image}"
        alt="${product.imageAlt}"
        style="
          display: block;
          margin: 20px auto;
          max-width: 450px;
          width: 100%;
        "
      />
        
      <div class="product-description">
        ${product.description.map((item) => `<p>${item.paragraph}</p>`).join("")}
      </div>
      <h2>Contents</h2>
      <div class="product-description">
        <p>${product.contents[0].introduction}</p>
        <div class="components">
          ${product.contents[0].components.map((section) => `
            <div class="component-section">
              <h3>${section.name}</h3>
              <ul>
                ${section.list.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
          `).join("")}
        </div>
      </div>
      ${product.contents[0].link ? `
      <div class="quest-section">
        <h2>Quests</h2>
        <p>
          Here is a link to the <a href="${product.contents[0].link.url}" target="_blank" rel="noopener noreferrer">
            ${product.contents[0].link["url-text"]}
          </a>
        </p>
        <h3>Quests List:</h3>
        <ol>
          ${product.contents[0].link.quests.map((quest) => `<li>${quest}</li>`).join("")}
        </ol>
      </div>
      ` : ""}
    </div>
  `;
}