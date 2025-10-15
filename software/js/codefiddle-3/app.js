let editors = {};

// Horizontal split: editor | preview+console
Split(['#editor-panel', '#right-panel'], {
  sizes: [50, 50],
  minSize: 200,
  gutterSize: 6,
  cursor: 'col-resize'
});

// Vertical split inside right panel: preview | console
Split(['#preview-panel', '#console-panel'], {
  direction: 'vertical',
  sizes: [70, 30],
  minSize: [100, 50],
  gutterSize: 6,
  cursor: 'row-resize'
});

// --- Setup Monaco Editors ---
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' } });
require(['vs/editor/editor.main'], () => {

  // --- Create editors ---
  editors.html = monaco.editor.create(document.getElementById('html-editor'), {
    value: "<h1>Welcome to CodeFiddle!</h1>\n<p>Start editing to see live changes.</p>",
    language: 'html',
    theme: 'vs-dark',
    automaticLayout: true
  });

  editors.css = monaco.editor.create(document.getElementById('css-editor'), {
    value: "h1 { color: dodgerblue; }",
    language: 'css',
    theme: 'vs-dark',
    automaticLayout: true
  });

  editors.js = monaco.editor.create(document.getElementById('js-editor'), {
    value: "console.log('Hello from JavaScript');",
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true
  });

  editors.ts = monaco.editor.create(document.getElementById('ts-editor'), {
    value: "let message: string = 'Hello from TypeScript';\nconsole.log(message);",
    language: 'typescript',
    theme: 'vs-dark',
    automaticLayout: true
  });

  // --- Tab switching ---
  document.querySelectorAll('#tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('#tabs button.active').classList.remove('active');
      btn.classList.add('active');

      document.querySelector('.editor-container.active').classList.remove('active');
      document.getElementById(btn.dataset.tab + '-editor').classList.add('active');
    });
  });

  // Console handling
  const consolePanel = document.getElementById('console-panel');
  function addConsoleMessage(type, message) {
    const line = document.createElement('div');
    line.className = 'console-' + type;
    line.textContent = message;
    consolePanel.appendChild(line);
    consolePanel.scrollTop = consolePanel.scrollHeight;
  }

  function clearConsole() {
    consolePanel.innerHTML = '';
    const line = document.createElement('div');
    line.className = 'console-clear';
    line.textContent = '--- Console cleared ---';
    consolePanel.appendChild(line);
  }

  // --- Preview rendering ---
  function updatePreview() {
    clearConsole();
    const html = editors.html.getValue();
    const css = `<style>${editors.css.getValue()}</style>`;
    const js = editors.js.getValue();

    // Compile TypeScript to JavaScript using Monaco's built-in TS compiler
    const tsCode = editors.ts.getValue();
    monaco.languages.typescript.getTypeScriptWorker()
      .then(worker => worker(editors.ts.getModel().uri))
      .then(client => client.getEmitOutput(editors.ts.getModel().uri.toString()))
      .then(output => {
        const tsJs = output.outputFiles[0]?.text || "";
        const fullCode = `
          <html>
          <head>${css}</head>
          <body>
            ${html}
            <script>
              (function() {
                const log = (...args) => parent.postMessage({type:'log', msg: args.join(' ')}, '*');
                const warn = (...args) => parent.postMessage({type:'warn', msg: args.join(' ')}, '*');
                const error = (...args) => parent.postMessage({type:'error', msg: args.join(' ')}, '*');
                console.log = log;
                console.warn = warn;
                console.error = error;
                try {
                  ${js}
                  ${tsJs}
                } catch (e) {
                  console.error(e);
                }
              })();
            <\/script>
          </body>
          </html>
        `;
        document.getElementById('preview-frame').srcdoc = fullCode;
      });
  }

  // Listen for log messages from the iframe
  window.addEventListener('message', (e) => {
    const { type, msg } = e.data;
    if (type && msg !== undefined) addConsoleMessage(type, msg);
  });

  // --- Debounce updates to avoid excessive recompiles ---
  function debounce(fn, delay = 400) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedUpdate = debounce(updatePreview);

  // Trigger preview updates on change
  Object.values(editors).forEach(editor => {
    editor.onDidChangeModelContent(debouncedUpdate);
  });

  // Initial render
  updatePreview();
});