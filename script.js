// Engine Configuration
const ENGINE = {
    frameRate: 30,
    displayWidth: 64,
    displayHeight: 64
};

// Game State
let gameState = null;
let isRunning = false;
let gameLoopInterval = null;
let frameCount = 0;

// Initialize the game engine
function initEngine() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Reset the canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Initialize game state if it exists
    if (gameState) {
        try {
            // Create function from initCode
            const initFunc = new Function(gameState.initCode);
            initFunc();
        } catch (error) {
            console.error('Error in init code:', error);
            alert('Error initializing game: ' + error.message);
        }
    }
}

// Game loop function
function gameLoop() {
    if (!gameState || !isRunning) return;
    
    try {
        // Create function from updateCode
        const updateFunc = new Function(gameState.updateCode);
        updateFunc();
    } catch (error) {
        console.error('Error in update code:', error);
        stopGame();
    }
    frameCount++;
}

// Start the game
function startGame() {
    if (!gameState) return;
    
    isRunning = true;
    initEngine();
    gameLoopInterval = setInterval(gameLoop, 1000 / ENGINE.frameRate);
}

// Stop the game
function stopGame() {
    isRunning = false;
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
        gameLoopInterval = null;
    }
}

// Export game code to JSON
function exportCode() {
    const gameState = {
        initCode: document.getElementById('initCode').value,
        updateCode: document.getElementById('updateCode').value,
        displayMode: document.getElementById('displayMode').value,
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(gameState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-code.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import game code from JSON
async function importCode() {
    document.getElementById('fileInput').click();
}

// Handle file selection
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        gameState = JSON.parse(text);

        // Validate the imported data
        if (!gameState.initCode || !gameState.updateCode) {
            throw new Error('Invalid game file format');
        }

        if (document.getElementById('initCode')) {
            // We're in the IDE
            document.getElementById('initCode').value = gameState.initCode;
            document.getElementById('updateCode').value = gameState.updateCode;
            if (gameState.displayMode) {
                document.getElementById('displayMode').value = gameState.displayMode;
            }
        } else {
            // We're in the game view - start automatically
            startGame();
        }
    } catch (error) {
        console.error('Error importing file:', error);
        alert('Error importing file. Please make sure it\'s a valid game code JSON file.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // File input listener
    const fileInput = document.getElementById('fileInput') || document.getElementById('gameFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    // Auto-start behavior
    const path = window.location.pathname.toLowerCase();
    const isIdePage = path.includes('index.html') || path.endsWith('/') || path.includes('editor');

    if (isIdePage) {
        // IDE initialization
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        if (exportBtn) exportBtn.addEventListener('click', exportCode);
        if (importBtn) importBtn.addEventListener('click', importCode);
    } else {
        // Game view initialization (play.html or other play route)
        const gameFileInput = document.getElementById('gameFileInput');
        if (gameFileInput) {
            gameFileInput.addEventListener('change', (event) => {
                handleFileSelect(event).then(() => {
                    if (gameState) startGame();
                });
            });
        }

        // Try to auto-load the sample game JSON for quick testing
        // If the fetch or parsing fails, users can still load via the file input.
        (async function tryLoadSample() {
            try {
                const resp = await fetch('sample-game.json', { cache: 'no-store' });
                if (!resp.ok) throw new Error('sample-game.json not found');
                const text = await resp.text();
                const parsed = JSON.parse(text);
                // Apply and start
                gameState = parsed;
                // Give a tiny delay to ensure canvas exists and other init steps complete
                setTimeout(() => {
                    try {
                        startGame();
                    } catch (err) {
                        console.error('Error starting sample game:', err);
                    }
                }, 50);
                console.log('Auto-loaded sample-game.json');
            } catch (err) {
                console.warn('Auto-load sample-game.json failed:', err);
            }
        })();
    }
});