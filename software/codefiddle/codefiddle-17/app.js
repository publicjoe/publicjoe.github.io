let editors = {};
let consoleVisible = true;
let showTimestamps = true;
const consolePanel = document.getElementById('console-panel');
const toggleConsoleBtn = document.getElementById('toggle-console-btn');
const toggleTimestampsBtn = document.getElementById('toggle-timestamps-btn');
const STORAGE_KEY = 'codefiddle-';

// Split helper functions
const disableIframe = () => {
  document.getElementById('preview-frame').style.pointerEvents = 'none';
};
const enableIframe = () => {
  document.getElementById('preview-frame').style.pointerEvents = 'auto';
};

// Horizontal split: editor | preview+console
Split(['#editor-panel', '#right-panel'], {
  sizes: [50, 50],
  minSize: 200,
  gutterSize: 6,
  cursor: 'col-resize',
  onDragStart: disableIframe,
  onDragEnd: enableIframe
});

// Vertical split inside right panel: preview | console
Split(['#preview-panel', '#console-panel'], {
  direction: 'vertical',
  sizes: [70, 30],
  minSize: [100, 50],
  gutterSize: 6,
  cursor: 'row-resize',
  onDragStart: disableIframe,
  onDragEnd: enableIframe
});

// --- Setup Monaco Editors ---
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' } });
require(['vs/editor/editor.main'], () => {

  const commonOptions = {
    theme: 'vs-dark',
    automaticLayout: true,
    autoClosingBrackets: 'always',
    matchBrackets: 'always',
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    formatOnType: true,
    formatOnPaste: true
  };

  function createEditor(id, language, value) {
    return monaco.editor.create(document.getElementById(id), {
      ...commonOptions,
      language: language,
      value: value
    });
  }

  editors.html = createEditor('html-editor', 'html', "<h1>Welcome to CodeFiddle!</h1>\n<p>Start editing to see live changes.</p>");
  editors.css  = createEditor('css-editor', 'css', "h1 { color: dodgerblue; }");
  editors.js   = createEditor('js-editor', 'javascript', "console.log('Hello from JavaScript');");
  editors.ts   = createEditor('ts-editor', 'typescript', "let message: string = 'Hello from TypeScript';\nconsole.log(message);");

  editors.html.onKeyDown((event) => {
    if (event.browserEvent.key === '>') {
      const model = editors.html.getModel();
      const position = editors.html.getPosition();
      
      // Look back from current position to find the tag name
      const lineContent = model.getLineContent(position.lineNumber).substring(0, position.column - 1);
      const match = lineContent.match(/<(\w+)$/);

      if (match) {
        const tagName = match[1];

        // List of self closing tags to ignore
        const selfClosingTags = [
          'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
          'link', 'meta', 'param', 'source', 'track', 'wbr'
        ];

        if (selfClosingTags.includes(tagName.toLowerCase())) {
          return;
        }
        
        const closingTag = `</${tagName}>`;

        // Use setTimeout to let the '>' actually get rendered into the editor first
        setTimeout(() => {
          // Get the updated position AFTER the '>' has been inserted
          const newPos = editors.html.getPosition();
          
          editors.html.executeEdits("auto-close", [{
            // Insert the closing tag immediately after the '>'
            range: new monaco.Range(newPos.lineNumber, newPos.column, newPos.lineNumber, newPos.column),
            text: closingTag,
            forceMoveMarkers: false // Prevents the cursor from being pushed by the edit
          }]);

          // Explicitly place the cursor between the tags
          editors.html.setPosition(newPos);
        }, 0);
      }
    }
  });

  // Restore editor contents
  ['html', 'css', 'js', 'ts'].forEach(lang => {
    const saved = localStorage.getItem(STORAGE_KEY + lang);
    if (saved !== null) editors[lang].setValue(saved);
  });

  // Restore active tab
  const savedTab = localStorage.getItem(STORAGE_KEY + 'activeTab');
  if (savedTab) {
    document.querySelector('#tabs button.active').classList.remove('active');
    document.querySelector(`#tabs button[data-tab="${savedTab}"]`).classList.add('active');

    document.querySelector('.editor-container.active').classList.remove('active');
    document.getElementById(savedTab + '-editor').classList.add('active');
  }

  // Restore console visibility
  const savedConsoleVisible = localStorage.getItem(STORAGE_KEY + 'consoleVisible');
  if (savedConsoleVisible !== null) {
    consoleVisible = savedConsoleVisible === 'true';
  } else {
    consoleVisible = true; // default visible
  }

  consolePanel.classList.toggle('visible', consoleVisible);
  toggleConsoleBtn.textContent = consoleVisible ? 'Hide Console' : 'Show Console';
  toggleConsoleBtn.style.visibility = 'visible'; // reveal button

  // Restore timestamp setting
  const savedTimestamps = localStorage.getItem(STORAGE_KEY + 'showTimestamps');
  if (savedTimestamps !== null) {
    showTimestamps = savedTimestamps === 'true';
  } else {
    showTimestamps = true; // default show timestamps
  }

  toggleTimestampsBtn.textContent = showTimestamps ? 'Hide Timestamps' : 'Show Timestamps';
  toggleTimestampsBtn.style.visibility = 'visible'; // reveal button

  // --- Tab switching ---
  document.querySelectorAll('#tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('#tabs button.active').classList.remove('active');
      btn.classList.add('active');

      document.querySelector('.editor-container.active').classList.remove('active');
      document.getElementById(btn.dataset.tab + '-editor').classList.add('active');

      // Save the active tab
      localStorage.setItem(STORAGE_KEY + 'activeTab', btn.dataset.tab);

      // Refresh layout
      editors[btn.dataset.tab].layout();
    });
  });

  // Console handling
  /**
   * Renders a value into a DOM element for the virtual console.
   * @param {*} val - The value to render (string, number, object, etc.)
   * @param {number} depth - Current recursion depth to prevent infinite loops.
   * @param {Set} seen - Track objects already processed (circular reference protection).
   */
  function renderValue(val, depth = 0, seen = new Set()) {
    const MAX_DEPTH = 5; // Prevent the UI from becoming unreadable

    // Handle Null and Undefined
    if (val === null) return createText('null', '#888');
    if (val === undefined) return createText('undefined', '#888');

    const type = typeof val;

    // Handle Primitives
    if (type === 'string') return createText(`"${val}"`, '#0ff');
    if (type === 'number' || type === 'boolean') return createText(val, '#fd0');
    if (type === 'function') return createText('ƒ () {}', '#fa0');
    if (type === 'symbol') return createText(val.toString(), '#fa0');

    // Prevent deep nesting or circular references
    if (depth > MAX_DEPTH) return createText('[Max Depth Reached]', '#888');
    if (val && typeof val === 'object') {
      if (seen.has(val)) return createText('[Circular Reference]', '#f55');
      seen.add(val);
    }

    // Handle Arrays
    if (Array.isArray(val)) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      
      summary.style.color = '#0af';
      summary.style.cursor = 'pointer';
      summary.textContent = `Array(${val.length}) [ ${val.slice(0, 3).map(v => (typeof v === 'string' ? '"' + v + '"' : v)).join(', ')}${val.length > 3 ? '...' : ''} ]`;
      
      details.appendChild(summary);

      const container = document.createElement('div');
      container.style.marginLeft = '1.5em';
      container.style.borderLeft = '1px solid #444';
      container.style.paddingLeft = '0.5em';

      val.forEach((item, index) => {
        const line = document.createElement('div');
        line.appendChild(createText(`${index}: `, '#999'));
        line.appendChild(renderValue(item, depth + 1, seen));
        container.appendChild(line);
      });

      details.appendChild(container);
      return details;
    }

    // Handle Objects
    if (type === 'object') {
      const keys = Object.keys(val);
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      
      summary.style.color = '#0af';
      summary.style.cursor = 'pointer';
      summary.textContent = `Object { ${keys.slice(0, 2).join(', ')}${keys.length > 2 ? '...' : ''} }`;
      
      details.appendChild(summary);

      const container = document.createElement('div');
      container.style.marginLeft = '1.5em';
      container.style.borderLeft = '1px solid #444';
      container.style.paddingLeft = '0.5em';

      keys.forEach(key => {
        const line = document.createElement('div');
        line.appendChild(createText(`${key}: `, '#999'));
        try {
          line.appendChild(renderValue(val[key], depth + 1, seen));
        } catch (e) {
          line.appendChild(createText('[Unreadable]', '#f55'));
        }
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
    // Clear the UI before re-rendering the message buffer
    consolePanel.innerHTML = '';

    consoleMessages.forEach(msg => {
      const line = document.createElement('div');
      line.className = 'console-' + msg.type;
      line.style.marginBottom = '4px';
      line.style.borderBottom = '1px solid #2a2a2a';
      line.style.paddingBottom = '2px';

      // Add Timestamp if enabled
      if (showTimestamps) {
        const timeSpan = document.createElement('span');
        timeSpan.style.color = '#888';
        timeSpan.style.marginRight = '0.8em';
        timeSpan.style.fontSize = '11px';
        timeSpan.textContent = `[${msg.timestamp}]`;
        line.appendChild(timeSpan);
      }

      // Process all arguments passed to console.log/warn/error
      if (Array.isArray(msg.values)) {
        msg.values.forEach((val, i) => {
          // Add a space between multiple arguments
          if (i > 0) {
            const spacer = document.createTextNode(' ');
            line.appendChild(spacer);
          }
          
          // Render each value with a fresh depth count (0) 
          // and a fresh Set for circular reference tracking
          line.appendChild(renderValue(val, 0, new Set()));
        });
      } else {
        // Single value fallback
        line.appendChild(renderValue(msg.values, 0, new Set()));
      }

      consolePanel.appendChild(line);
    });

    // Auto-scroll to bottom
    consolePanel.scrollTop = consolePanel.scrollHeight;
  }

  toggleTimestampsBtn.addEventListener('click', () => {
    showTimestamps = !showTimestamps;
    localStorage.setItem(STORAGE_KEY + 'showTimestamps', showTimestamps);
    toggleTimestampsBtn.textContent = showTimestamps ? 'Hide Timestamps' : 'Show Timestamps';
    renderConsole(); // 👈 refresh console display
  });

  function clearConsole() {
    // Wipe the message history
    consoleMessages.length = 0; 
    
    // Add a special notification message to the history
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-GB', { hour12: false });
    
    consoleMessages.push({ 
      type: 'clear', 
      values: ['--- Console cleared ---'], 
      timestamp 
    });

    // Update the UI
    renderConsole();
  }
  
  // Attach Clear Console button
  document.getElementById('clear-console-btn').addEventListener('click', clearConsole);

  // --- Toggle Console Panel ---
  function toggleConsole() {
    consoleVisible = !consoleVisible;
    localStorage.setItem(STORAGE_KEY + 'consoleVisible', consoleVisible);
    consolePanel.classList.toggle('visible', consoleVisible);
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
  async function updatePreview() {
    // Clear the console UI and internal message buffer for a fresh run
    consoleMessages.length = 0; 
    renderConsole();

    const html = editors.html.getValue();
    const css = `<style>${editors.css.getValue()}</style>`;
    const js = editors.js.getValue();
    const tsCode = editors.ts.getValue();

    let tsJs = "";

    // Only invoke the TS worker if there is code to compile
    if (tsCode.trim() !== "") {
      try {
        const worker = await monaco.languages.typescript.getTypeScriptWorker();
        const client = await worker(editors.ts.getModel().uri);
        const output = await client.getEmitOutput(editors.ts.getModel().uri.toString());
        tsJs = output.outputFiles[0]?.text || "";
      } catch (e) {
        console.error("TypeScript Compilation Error:", e);
        addConsoleMessage('error', ["TypeScript Compilation failed. Check syntax."]);
      }
    }

    // Construct the final document string
    // We use a "Session ID" or simple timestamp to help the console identify the latest run
    const fullCode = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        ${css}
      </head>
      <body>
        ${html}
        <script>
          (function() {
            // Proxy console methods to parent window
            const send = (type, args) => parent.postMessage({ type, args }, '*');
            
            console.log = (...args) => send('log', args);
            console.warn = (...args) => send('warn', args);
            console.error = (...args) => send('error', args);

            // Catch runtime errors
            window.onerror = (msg, src, line, col, err) => {
              send('error', [msg + ' (Line: ' + line + ')']);
            };

            try {
              // Execute standard JavaScript
              ${js}
              // Execute compiled TypeScript
              ${tsJs}
            } catch (e) {
              console.error(e.message);
            }
          })();
        <\/script>
      </body>
      </html>
    `;

    // Update the iframe
    const previewFrame = document.getElementById('preview-frame');
    previewFrame.srcdoc = fullCode;
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
  Object.entries(editors).forEach(([lang, editor]) => {
    editor.onDidChangeModelContent(() => {
      localStorage.setItem(STORAGE_KEY + lang, editor.getValue());
      debouncedUpdate();
    });
  });

  // Initial render
  updatePreview();
});