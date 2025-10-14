let editors = {};
let rightSplit;
let consoleVisible = true;
let previousSizes = [70,30]; // preview | console

// Split panels
Split(['#editor-panel','#right-panel'], { sizes:[50,50], minSize:200, gutterSize:6, cursor:'col-resize' });
rightSplit = Split(['#preview-panel','#console-panel'], { direction:'vertical', sizes:previousSizes, minSize:[100,50], gutterSize:6, cursor:'row-resize' });

// Monaco setup
require.config({ paths:{ 'vs':'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' } });
require(['vs/editor/editor.main'], () => {
  editors.html = monaco.editor.create(document.getElementById('html-editor'), { value:"<h1>Hello Monaco!</h1>\n<p>Ctrl+~ toggles console</p>", language:'html', theme:'vs-dark', automaticLayout:true });
  editors.css  = monaco.editor.create(document.getElementById('css-editor'), { value:"h1 { color: dodgerblue; }", language:'css', theme:'vs-dark', automaticLayout:true });
  editors.js   = monaco.editor.create(document.getElementById('js-editor'), { value:"console.log('JS ready');", language:'javascript', theme:'vs-dark', automaticLayout:true });
  editors.ts   = monaco.editor.create(document.getElementById('ts-editor'), { value:"console.log('TS works too!');", language:'typescript', theme:'vs-dark', automaticLayout:true });

  // Tab switching
  document.querySelectorAll('#tabs button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelector('#tabs button.active').classList.remove('active');
    btn.classList.add('active');
    document.querySelector('.editor-container.active').classList.remove('active');
    document.getElementById(btn.dataset.tab+'-editor').classList.add('active');
  }));

  const consolePanel = document.getElementById('console-panel');
  const toggleBtn = document.getElementById('toggle-console-btn');
  const clearBtn  = document.getElementById('clear-console-btn');

  // Console rendering helpers
  function createText(text,color){ const s=document.createElement('span'); s.style.color=color; s.textContent=text; return s; }
  function renderValue(val){
    if(val===null) return createText('null','#888');
    if(val===undefined) return createText('undefined','#888');
    const t=typeof val;
    if(t==='string') return createText(`"${val}"`,'#0ff');
    if(t==='number'||t==='boolean') return createText(val,'#fd0');
    if(t==='function') return createText('[Function]','#fa0');
    if(Array.isArray(val)){
      const d=document.createElement('details');
      const s=document.createElement('summary');
      s.textContent=`Array(${val.length})`; s.style.color='#0af';
      d.appendChild(s);
      const inner=document.createElement('div'); inner.style.marginLeft='1em';
      val.forEach((v,i)=>{ const line=document.createElement('div'); line.appendChild(createText(i+': ','#999')); line.appendChild(renderValue(v)); inner.appendChild(line); });
      d.appendChild(inner);
      return d;
    }
    if(t==='object'){
      const keys=Object.keys(val);
      const d=document.createElement('details');
      const s=document.createElement('summary');
      s.textContent=`Object {${keys.length}}`; s.style.color='#0af';
      d.appendChild(s);
      const inner=document.createElement('div'); inner.style.marginLeft='1em';
      keys.forEach(k=>{ const line=document.createElement('div'); line.appendChild(createText(k+': ','#999')); line.appendChild(renderValue(val[k])); inner.appendChild(line); });
      d.appendChild(inner);
      return d;
    }
    return createText(String(val),'#eee');
  }

  function addConsoleMessage(type,values){
    const line=document.createElement('div'); line.className='console-'+type;
    values.forEach((v,i)=>{ if(i>0) line.appendChild(document.createTextNode(' ')); line.appendChild(renderValue(v)); });
    consolePanel.appendChild(line);
    consolePanel.scrollTop=consolePanel.scrollHeight;
  }

  function clearConsole(){
    consolePanel.innerHTML='';
    const line=document.createElement('div');
    line.className='console-clear';
    line.textContent='--- Console cleared ---';
    consolePanel.appendChild(line);
  }
  clearBtn.addEventListener('click', clearConsole);

  function toggleConsole(){
    consoleVisible = !consoleVisible;
    if(!consoleVisible){
      previousSizes = rightSplit.getSizes();
      consolePanel.classList.add('hidden');
      rightSplit.setSizes([100, 0]);
      toggleBtn.textContent = 'Show Console';
    } else {
      consolePanel.classList.remove('hidden');
      rightSplit.setSizes(previousSizes);
      toggleBtn.textContent = 'Hide Console';
    }
  }
  toggleBtn.addEventListener('click', toggleConsole);

  document.addEventListener('keydown', e => {
    if((e.ctrlKey||e.metaKey)&&e.key==='`'){
      e.preventDefault();
      toggleConsole();
    }
  });

  // Preview update
  function updatePreview(){
    clearConsole();
    const html = editors.html.getValue();
    const css  = `<style>${editors.css.getValue()}</style>`;
    const js   = editors.js.getValue();
    const tsCode = editors.ts.getValue();

    monaco.languages.typescript.getTypeScriptWorker()
      .then(worker => worker(editors.ts.getModel().uri))
      .then(client => client.getEmitOutput(editors.ts.getModel().uri.toString()))
      .then(output => {
        const tsJs = output.outputFiles[0]?.text || "";
        const fullCode = `<html><head>${css}</head><body>${html}<script>
          (function(){
            const send=(t,a)=>parent.postMessage({type:t,args:a},'*');
            console.log=(...a)=>send('log',a);
            console.warn=(...a)=>send('warn',a);
            console.error=(...a)=>send('error',a);
            window.onerror=(msg,src,line,col)=>send('error',[msg+' ('+line+':'+col+')']);
            try{${js}\n${tsJs}}catch(e){console.error(e);}
          })();
        <\/script></body></html>`;
        document.getElementById('preview-frame').srcdoc = fullCode;
      });
  }

  window.addEventListener('message', e => {
    const {type,args}=e.data;
    if(type && args) addConsoleMessage(type,args);
  });

  const debounce=(fn,delay=400)=>{ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),delay); } };
  const debouncedUpdate = debounce(updatePreview);
  Object.values(editors).forEach(ed => ed.onDidChangeModelContent(debouncedUpdate));
  updatePreview();
});
