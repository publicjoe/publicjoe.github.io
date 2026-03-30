async function loadQuests(jsonFile) {
  try {
    const response = await fetch(jsonFile);

    if (!response.ok) {
      throw new Error("Failed to load " + jsonFile);
    }

    const quests = await response.json();
    renderQuests(quests);
  } catch (error) {
    console.error("Error loading " + jsonFile, error);
  }
}

function renderQuests(quests) {
  const container = document.getElementById("quests");

  container.innerHTML = quests
    .map(
      (quest) => `
        <div class="quest-card">
          <div class="quest-content">
            <div class="quest-text">
              <h2 class="quest-title">${quest.title}</h2>
              <p class="quest-meta">${quest.meta}</p>
              <p class="quest-description">${quest.description}</p>

              <div class="quest-links">
                ${quest.links
                  .map(
                    (link) =>
                      `<a href="${link.url}" target="_blank">${link.label}</a>`
                  )
                  .join("")}
              </div>
            </div>

            <div class="quest-image">
              <img src="${quest.image}" alt="${quest.title}" />
            </div>

          </div>
        </div>
      `
    )
    .join("");
}