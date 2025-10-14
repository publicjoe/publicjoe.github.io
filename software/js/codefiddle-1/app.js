let editors = {};

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' } });
require(['vs/editor/editor.main'], () => {

  // --- Create editors ---
  editors.html = monaco.editor.create(document.getElementById('html-editor'), {
    value: "<h1>Hello Monaco!</h1>\n<p>This is HTML</p>",
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

  // --- Preview rendering ---
  function updatePreview() {
    const html = editors.html.getValue();
    const css = `<style>${editors.css.getValue()}</style>`;
    const js = editors.js.getValue();

    // Compile TypeScript to JavaScript using Monaco's built-in TS compiler
    const tsCode = editors.ts.getValue();
    const transpiled = monaco.languages.typescript.getTypeScriptWorker()
      .then(worker => worker(editors.ts.getModel().uri))
      .then(client => client.getEmitOutput(editors.ts.getModel().uri.toString()))
      .then(output => {
        const tsJs = output.outputFiles[0]?.text || "";
        const combined = html + css + `<script>${js}\n${tsJs}<\/script>`;
        const iframe = document.getElementById('preview-frame');
        iframe.srcdoc = combined;
      });
  }

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