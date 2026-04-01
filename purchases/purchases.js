async function loadPurchases(jsonFile, element) {
  const data = await getData(jsonFile);
  const items = data.items;

  const year = element.getAttribute("year");

  // total
  const total = items.reduce((sum, item) => sum + item.price, 0);

  // list
  const listItems = items
    .map((item) => {
      const name = item.link
        ? `<a href="${item.link}">${item.name}</a>`
        : item.name;

      return `<li>${name} - £${item.price.toFixed(2)}</li>`;
    })
    .join("");

  // unique id (important if multiple years on page)
  const accordionId = `purchases-${year}`;

  element.innerHTML = `
    <div class="card">
      <h2>${year}</h2>
      <section class="accordion">
        <input type="checkbox" id="${accordionId}" />
        <h3 class="handle">
          <label for="${accordionId}">
            Purchases - £${total.toFixed(2)}
          </label>
        </h3>
        <div class="content">
          <ul>
            ${listItems}
          </ul>
        </div>
      </section>
    </div>
  `;
}