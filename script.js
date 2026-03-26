// Initialize only mobile menu functionality after navigation is loaded
function initializeMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = document.querySelectorAll('.dropdown');

  // Handle dropdown toggles for mobile
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');

    toggle.addEventListener('click', (e) => {
      // Only handle clicks for mobile view
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('active');
        
        // Close other dropdowns if open
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
          }
        });
      }
    });
  });

  // Toggle mobile menu when hamburger is clicked
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
    
    // Close all dropdowns when menu is closed
    if (!isExpanded) {
      dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    }
  });

  // Add accessibility support
  function addAccessibility() {
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', false);
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');

    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
      }
    });
  }

  // Initialize accessibility features
  addAccessibility();

  // Close mobile menu when clicking on a regular link (not dropdown toggle)
  const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown-toggle)');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
      }
    });
  });
}

// Keep scroll functionality
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

//---------------
// Code Downloading Functions
function copyCode(elementId) {
    const codeElement = document.getElementById(elementId);
    const textArea = document.createElement('textarea');
    textArea.value = codeElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Show success message
    const message = document.getElementById('successMessage');
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}

function downloadAllFiles() {
    // Create file contents
    const files = {
        'index.html': document.getElementById('html-code').textContent,
        'styles.css': document.getElementById('css-code').textContent,
        'script.js': document.getElementById('js-code').textContent,
        'README.txt': `CodeFiddle - Web-Based Code Editor\n\nINSTRUCTIONS:\n1. Save all files in the same folder\n2. Open index.html in a web browser\n3. Start coding!\n\nFiles included:\n- index.html (main HTML structure)\n- styles.css (styling and layout)\n- script.js (editor functionality)\n\nFeatures:\n- HTML, CSS, JavaScript, TypeScript editing\n- Live preview\n- Syntax highlighting\n- Tab system\n- TypeScript compilation\n\nHappy coding! 🚀`
    };

    // Create ZIP file
    const zip = new JSZip();
    for (const [filename, content] of Object.entries(files)) {
        zip.file(filename, content);
    }

    // Generate and download ZIP
    zip.generateAsync({type: 'blob'}).then(function(content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'codefiddle-project.zip';
        link.click();
        URL.revokeObjectURL(link.href);
    });
}

// Load JSZip library for ZIP functionality
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(script);

// Add this to each page's script or in a separate script loaded on every page
document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage || 
        (currentPage === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });
});

//---------------
// Paint Diary

async function loadPaintDiary(jsonFile) {
  try {
    const response = await fetch(jsonFile);

    if (!response.ok) {
      throw new Error("Failed to load " + jsonFile);
    }

    const data = await response.json();
    const summary = calculateSummary(data);
    renderSummary(summary);

    const paintedModels = calculatePaintedModelsSummary(data);
    renderPaintedModelsSummary(paintedModels);

    renderPaintDiary(data);
  } catch (error) {
    console.error("Error loading " + jsonFile, error);
  }
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

function renderSummary(summary) {
  const container = document.getElementById("summary");

  container.innerHTML = `
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