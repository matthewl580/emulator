// Game-specific script (copied/adapted from root script.js)
// This file expects a `#game-canvas` and a `#gameFileInput` on the page.

const ENGINE = { frameRate: 30, displayWidth: 64, displayHeight: 64 };
let gameState = null;
let isRunning = false;
let gameLoopInterval = null;
let frameCount = 0;

function initEngine() {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState && gameState.initCode) {
    try {
      const initFunc = new Function(gameState.initCode);
      initFunc();
    } catch (err) {
      console.error('Init code error:', err);
    }
  }
}

function gameLoop() {
  if (!gameState || !isRunning) return;
  try {
    const updateFunc = new Function(gameState.updateCode);
    updateFunc();
  } catch (err) {
    console.error('Update code error:', err);
    stopGame();
  }
  frameCount++;
}

function updateStatus(message, isError = false) {
  const statusEl = document.getElementById('game-status');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#ff4444' : '#44ff44';
  }
}

function startGame() {
  if (!gameState) {
    updateStatus('No game loaded', true);
    return;
  }
  stopGame();
  isRunning = true;
  initEngine();
  gameLoopInterval = setInterval(gameLoop, 1000 / ENGINE.frameRate);
  updateStatus('Game running');
}

function stopGame() {
  isRunning = false;
  if (gameLoopInterval) { clearInterval(gameLoopInterval); gameLoopInterval = null; }
}

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  updateStatus('Loading game file...');
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    gameState = parsed;
    startGame();
  } catch (err) {
    console.error('Error loading file:', err);
    updateStatus('Invalid game file: ' + err.message, true);
  }
}

// Attach listener and attempt auto-load sample
window.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('gameFileInput');
  if (fileInput) fileInput.addEventListener('change', handleFileSelect);

  // Try to load sample game from URL parameter or default sample
  (async function tryLoadSample(){
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sampleName = urlParams.get('sample');
      const samplePath = sampleName 
        ? `../samples/${sampleName}.json`
        : '../sample-game.json';

      const resp = await fetch(samplePath, { cache: 'no-store' });
      if (!resp.ok) throw new Error('Sample not found: ' + samplePath);
      const text = await resp.text();
      gameState = JSON.parse(text);
      startGame();

      // If sample includes audio (Tone.js) the sample init will handle it
      console.log('Sample loaded:', samplePath);
    } catch (err) {
      console.error('Could not load sample:', err);
      updateStatus('Could not load requested game: ' + err.message, true);
      // Try loading default sample if specific sample failed
      if (window.location.search.includes('sample=')) {
        try {
          updateStatus('Trying to load default sample...');
          const resp = await fetch('../sample-game.json', { cache: 'no-store' });
          if (!resp.ok) throw new Error('Default sample not found');
          const text = await resp.text();
          gameState = JSON.parse(text);
          startGame();
          console.log('Fallback to default sample');
          updateStatus('Loaded default sample');
        } catch (defaultErr) {
          console.error('Could not load default sample:', defaultErr);
          updateStatus('Could not load any game: ' + defaultErr.message, true);
        }
      }
    }
  })();
    
  // Ensure audio can start: resume Tone when a user interacts (required in many browsers)
  const resumeAudio = async () => {
    try {
      if (window.Tone && Tone.context && Tone.context.state !== 'running') {
        await Tone.start();
        if (window._loop && Tone.Transport.state !== 'started') {
          Tone.Transport.start();
        }
        console.log('Audio resumed');
      }
    } catch (e) {
      console.warn('Audio resume failed', e);
    }
  };
  window.addEventListener('pointerdown', resumeAudio, { once: true });
});
