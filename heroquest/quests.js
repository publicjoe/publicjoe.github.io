async function loadQuests(jsonFile) {
  const quests = await getData(jsonFile);
  renderQuests(quests);
}

function renderQuests(quests) {
  const container = document.getElementById("quests");

  container.innerHTML = quests
    .map((item) => {
      // Get the first value of the object (the actual quest data)
      const quest = Object.values(item)[0]; 

      return `
        <div class="quest-card">
          <div class="quest-content">
            <div class="quest-text">
              <h2 class="quest-title">${quest.title}</h2>
              <p class="quest-meta">${quest.meta}</p>
              <p class="quest-description">${quest.description}</p>
              <div>
                <a href="${quest.url}" target="_blank">${quest.urlText}</a>
              </div>
              ${quest.quests[0] !== "" ? `
                <h3>Quests</h3>
                <ol class="quest-quests">
                  ${quest.quests.map((q) => `<li>${q}</li>`).join("")}
                </ol>
              ` : ""}
            </div>
            <div class="quest-image">
              <img src="${quest.image}" alt="${quest.title}" />
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}