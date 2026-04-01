// Paint
async function loadPaintDiary(jsonFile, element) {
  const data = await getData(jsonFile);
  const summary = calculateSummary(data);
  renderSummary(summary, element);

  const paintedModels = calculatePaintedModelsSummary(data);
  renderPaintedModelsSummary(paintedModels);

  renderPaintDiary(data);
}

async function loadSummaryIndex(jsonFile, element) {
  const data = await getData(jsonFile);
  const summary = calculateSummary(data);
  renderSummary(summary, element);
}

function renderPaintDiary(data) {
  const container = document.getElementById("progress");

  container.innerHTML = data
    .map((month, index) => {
      const isFirst = index === 0 ? 'checked="checked"' : "";

      // --- calculate totals ---
      const totals = month.finishedModels.reduce(
        (acc, model) => {
          const amount = model.amount || 1;

          if (model.type === "Large") acc.large += amount;
          else if (model.type === "Small") acc.small += amount;
          else if (model.type === "Terrain") acc.terrain += amount;

          return acc;
        },
        { large: 0, small: 0, terrain: 0 }
      );

      return `
        <section class="accordion">
          <input
            type="checkbox"
            name="collapse"
            id="handle${month.month}"
            ${isFirst}
          />
          <h2 class="handle">
            <label for="handle${month.month}">
              ${month.month} - ${month.subtext}
            </label>
          </h2>
          <div class="content">
            <p><b>Large Models/Vehicles Finished:</b> ${totals.large}</p>
            <p><b>Figures Finished:</b> ${totals.small}</p>
            <p><b>Terrain Finished:</b> ${totals.terrain}</p>

            <ul>
              ${month.finishedModels
                .map(
                  (model) =>
                    `<li>${model.system} - ${model.faction} - ${model.name}</li>`
                )
                .join("")}
            </ul>
          </div>
        </section>
      `;
    })
    .join("");
}

//--------------- 
// Summary
function calculateSummary(data) {
  return data.reduce(
    (acc, month) => {
      // --- bought totals ---
      acc.largeBought += month.largeModelsVehiclesBought || 0;
      acc.terrainBought += month.terrainBought || 0;
      acc.modelsBought += month.modelsBought || 0;

      // --- finished totals ---
      month.finishedModels.forEach((model) => {
        const amount = model.amount || 1;

        if (model.type === "Large") acc.largeFinished += amount;
        else if (model.type === "Small") acc.modelsFinished += amount;
        else if (model.type === "Terrain") acc.terrainFinished += amount;
      });

      return acc;
    },
    {
      largeBought: 0,
      largeFinished: 0,
      terrainBought: 0,
      terrainFinished: 0,
      modelsBought: 0,
      modelsFinished: 0,
    }
  );
}

function renderSummary(summary, element) {
  element.innerHTML = `
    <p>
      <b>Large Models/Vehicles Bought:</b> ${summary.largeBought}
      |
      <b>Large Models/Vehicles Finished:</b> ${summary.largeFinished}
    </p>
    <p>
      <b>Terrain Bought:</b> ${summary.terrainBought}
      |
      <b>Terrain Finished:</b> ${summary.terrainFinished}
    </p>
    <p>
      <b>Models Bought:</b> ${summary.modelsBought}
      |
      <b>Models Finished:</b> ${summary.modelsFinished}
    </p>
  `;
}

function calculatePaintedModelsSummary(data) {
  const map = {};

  data.forEach((month) => {
    month.finishedModels.forEach((model) => {
      const key = `${model.system}|${model.faction}|${model.name}`;

      if (!map[key]) {
        map[key] = {
          system: model.system,
          faction: model.faction,
          name: model.name,
          total: 0,
        };
      }

      map[key].total += model.amount || 1;
    });
  });

  return Object.values(map);
}

function renderPaintedModelsSummary(models) {
  const container = document.getElementById("painted-models-summary");

  container.innerHTML = `
    <section class="accordion">
      <input type="checkbox" name="collapse" id="handleSummary" />
      <h2 class="handle">
        <label for="handleSummary">Summary</label>
      </h2>
      <div class="content">
        <ul>
        ${models
          .map(
            (model) =>
              `<li>${model.system} - ${model.faction} - ${model.name}</li>`
          )
          .join("")}
        </ul>
      </div>
    </section>
  `;
}