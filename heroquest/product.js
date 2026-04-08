async function loadProduct(productFilename) {
  const productKey = productFilename.split('/').pop().replace('.json', '');

  const [product, allQuests] = await Promise.all([
    getData(productFilename),
    getData('heroquest/quests.json')
  ]);

  // If allQuests is an array, find the object that contains our key
  const questData = allQuests.find(item => item[productKey]);
  
  if (questData) {
    product.questData = questData[productKey];
  }

  renderProduct(product);
}

function renderProduct(product) {
  const container = document.getElementById("product");
  
  // Destructure for cleaner code
  const q = product.questData;

  container.innerHTML = `
    <div class="product-card">
      <h1 align="center" class="product-title">${product.title}</h1>
      <img src="${product.image}" alt="${product.imageAlt}" style="display: block; margin: 20px auto; max-width: 450px; width: 100%;" />
        
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

      ${q ? `
      <div class="quest-section">
        <hr>
        <h2>Quests</h2>
        <p>
          Link: <a href="${q.url}" target="_blank" rel="noopener noreferrer">
            ${q.urlText || "Download Quest Book"}
          </a>
        </p>
        <h3>Quests List:</h3>
        <ol>
          ${q.quests.map((quest) => `<li>${quest}</li>`).join("")}
        </ol>
      </div>
      ` : ""}
    </div>
  `;
}