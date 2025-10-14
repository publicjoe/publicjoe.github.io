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
