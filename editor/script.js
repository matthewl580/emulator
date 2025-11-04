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
  if (exportBtn) exportBtn.addEventListener('click', exportCodeEditor);
  if (importBtn) importBtn.addEventListener('click', importCodeEditor);
  if (fileInput) fileInput.addEventListener('change', handleFileInputEditor);
});