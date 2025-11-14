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
    value: "console.log('Hello from JavaScript');\nconsole.log(\"Hello, world!\");\nconsole.log(42);\nconsole.log(true);\nconsole.log(null);\nconsole.log(undefined);\nconsole.log({ name: \"Alice\", age: 30, skills: [\"JavaScript\", \"Python\"] });\nconsole.log([1, 2, 3, { a: 1, b: 2 }]);\nconsole.log(\"Multiple\", \"arguments\", { key: \"value\" });",
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
  function renderValue(val) {
    // Null / undefined
    if (val === null) return createText('null', '#888');
    if (val === undefined) return createText('undefined', '#888');

    const type = typeof val;

    // Primitives
    if (type === 'string') return createText(`"${val}"`, '#0ff');
    if (type === 'number') return createText(val, '#fd0');
    if (type === 'boolean') return createText(val, '#fd0');
    if (type === 'function') return createText('[Function]', '#fa0');

    // Arrays
    if (Array.isArray(val)) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = `Array(${val.length})`;
      summary.style.color = '#0af';
      details.appendChild(summary);

      const container = document.createElement('div');
      container.style.marginLeft = '1em';

      val.forEach((item, index) => {
        const line = document.createElement('div');
        const keySpan = createText(`${index}: `, '#999');
        line.appendChild(keySpan);
        line.appendChild(renderValue(item));
        container.appendChild(line);
      });

      details.appendChild(container);
      return details;
    }

    // Objects
    if (type === 'object') {
      const keys = Object.keys(val);
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = `Object { ${keys.length} keys }`;
      summary.style.color = '#0af';
      details.appendChild(summary);

      const container = document.createElement('div');
      container.style.marginLeft = '1em';

      keys.forEach(key => {
        const line = document.createElement('div');
        const keySpan = createText(`${key}: `, '#999');
        line.appendChild(keySpan);
        line.appendChild(renderValue(val[key]));
        container.appendChild(line);
      });

      details.appendChild(container);
      return details;
    }

    // Fallback
    return createText(String(val), '#eee');
  }

  function createText(text, color) {
    const span = document.createElement('span');
    span.style.color = color;
    span.textContent = text;
    return span;
  }

  let showTimestamps = true;
  const consoleMessages = []; // stores { type, values, timestamp }

  function addConsoleMessage(type, values) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-GB', { hour12: false }) + '.' + 
                      now.getMilliseconds().toString().padStart(3, '0');

    // Save message to buffer
    consoleMessages.push({ type, values, timestamp });

    // Render the new line
    renderConsole();
  }

  function renderConsole() {
    consolePanel.innerHTML = '';

    consoleMessages.forEach(msg => {
      const line = document.createElement('div');
      line.className = 'console-' + msg.type;

      if (showTimestamps) {
        const timeSpan = document.createElement('span');
        timeSpan.style.color = '#888';
        timeSpan.style.marginRight = '0.5em';
        timeSpan.textContent = `[${msg.timestamp}]`;
        line.appendChild(timeSpan);
      }

      if (Array.isArray(msg.values)) {
        msg.values.forEach((val, i) => {
          if (i > 0) line.appendChild(document.createTextNode(' '));
          line.appendChild(renderValue(val));
        });
      } else {
        line.appendChild(renderValue(msg.values));
      }

      consolePanel.appendChild(line);
    });

    consolePanel.scrollTop = consolePanel.scrollHeight;
  }

  const toggleTimestampsBtn = document.getElementById('toggle-timestamps-btn');

  toggleTimestampsBtn.addEventListener('click', () => {
    showTimestamps = !showTimestamps;
    toggleTimestampsBtn.textContent = showTimestamps ? 'Hide Timestamps' : 'Show Timestamps';
    renderConsole(); // 👈 refresh console display
  });

  function clearConsole() {
    consolePanel.innerHTML = '';
    const line = document.createElement('div');
    line.className = 'console-clear';
    line.textContent = '--- Console cleared ---';
    consolePanel.appendChild(line);
  }
  
  // Attach Clear Console button
  document.getElementById('clear-console-btn').addEventListener('click', clearConsole);

  // --- Toggle Console Panel ---
  const consolePanel = document.getElementById('console-panel');
  const toggleConsoleBtn = document.getElementById('toggle-console-btn');
  let consoleVisible = true;

  function toggleConsole() {
    consoleVisible = !consoleVisible;
    consolePanel.classList.toggle('hidden', !consoleVisible);
    toggleConsoleBtn.textContent = consoleVisible ? 'Hide Console' : 'Show Console';
  }

  toggleConsoleBtn.addEventListener('click', toggleConsole);

  // Keyboard shortcut: Ctrl+` to toggle Console
  document.addEventListener('keydown', e => {
    if((e.ctrlKey||e.metaKey)&&e.key==='`'){
      e.preventDefault();
      toggleConsole();
    }
  });

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
              const send = (type, args) => parent.postMessage({type, args}, '*');
              console.log = (...args) => send('log', args);
              console.warn = (...args) => send('warn', args);
              console.error = (...args) => send('error', args);
              window.onerror = (msg, src, line, col, err) => {
                send('error', [msg + ' (' + line + ':' + col + ')']);
              };
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
    const { type, args } = e.data;
    if (type && args !== undefined) addConsoleMessage(type, args);
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