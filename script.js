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

// Keep scroll functionality (optional)
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

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