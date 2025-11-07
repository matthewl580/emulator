// Editor page script: wire export/import to the IDE editor elements
// This file is intentionally lightweight and uses the root's sample-game.json when exporting.

function exportCodeEditor() {
  const payload = {
    initCode: document.getElementById('initCode').value,
    updateCode: document.getElementById('updateCode').value,
    displayMode: '1',
    timestamp: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'game-code.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function importCodeEditor() {
  document.getElementById('fileInput').click();
}

async function handleFileInputEditor(e) {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  try {
    const parsed = JSON.parse(text);
    document.getElementById('initCode').value = parsed.initCode || '';
    document.getElementById('updateCode').value = parsed.updateCode || '';
    alert('Imported into editor');
  } catch (err) {
    alert('Invalid JSON');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const fileInput = document.getElementById('fileInput');
  const runBtn = document.getElementById('runBtn');
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  window._ctx = ctx;
  if (exportBtn) exportBtn.addEventListener('click', exportCodeEditor);
  if (importBtn) importBtn.addEventListener('click', importCodeEditor);
  if (fileInput) fileInput.addEventListener('change', handleFileInputEditor);

  // Prefill editor with the pinball sample if available
  (async function prefill() {
    try {
      const res = await fetch('/samples/snake.json');
      if (!res.ok) throw new Error('not found');
      const sample = await res.json();
      document.getElementById('initCode').value = sample.initCode || '';
      document.getElementById('updateCode').value = sample.updateCode || '';
    } catch (err) {
      // fallback: leave blank
      console.warn('Could not load sample pinball:', err);
    }
  })();

  // Simple runner: executes init once, then runs update each animation frame.
  let raf = null;
  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function startLoop() {
    stopLoop();
    // run init code once
    try {
      const initSrc = document.getElementById('initCode').value || '';
      if (initSrc.trim()) new Function(initSrc)();
    } catch (e) {
      console.error('Init error', e);
      alert('Init code error: ' + e.message);
      return;
    }

    function tick() {
      try {
        const updateSrc = document.getElementById('updateCode').value || '';
        if (updateSrc.trim()) new Function(updateSrc)();
      } catch (e) {
        console.error('Update error', e);
        // stop on runtime error to avoid spam
        stopLoop();
        alert('Update code error: ' + e.message);
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }

  if (runBtn) runBtn.addEventListener('click', startLoop);
});