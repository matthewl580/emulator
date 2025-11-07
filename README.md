# ChipCode — 64x64  Game Engine

A lightweight browser-based engine + editor for building and playing 64x64 pixel retro-style games.

Badges (add CI/license badges here if available)

---

## What this project does

- Provides a tiny runtime that runs games authored as JSON payloads containing `initCode` and `updateCode` (JavaScript).
- Ships a browser-based editor with live preview, import/export, and sample games in `samples/`.
- Built-in lightweight audio support using Tone.js for SFX and background music.

Key files

- `index.html` — sample game library and links to Editor / Play views
- `editor/index.html` and `editor/script.js` — web-based code editor and preview runner
- `game/` — runtime page used to load and play exported samples
- `samples/` — collection of ready-to-run game JSON files (pinball, snake, breakout, etc.)
- `css/style.css` — global styles for the UI

---

## Why this project is useful

- Fast prototyping of small pixel games using just JavaScript and an HTML canvas.
- Educational: each sample demonstrates game patterns (init/update loop, input handling, audio, UI).
- Self-contained: runs in the browser with minimal dependencies (Tone.js is loaded from CDN in the editor).

---

## Quick start (developer)

1. Clone the repository:

```bash
git clone <your-repo-url>
cd emulator
```

2. Serve the project locally (recommended; some browsers block fetch requests from file://):

PowerShell / Windows:
```powershell
cd c:\Users\Matth\Downloads\emulater\emulator
python -m http.server 8000
# open http://localhost:8000/ in your browser
```

macOS / Linux:
```bash
python3 -m http.server 8000
# open http://localhost:8000/ in your browser
```

3. Open the Editor to author and run games:

- Editor: `http://localhost:8000/editor/`
- Play a sample directly: `http://localhost:8000/game/?sample=snake` (or open `index.html` and click Play)

Notes about audio: modern browsers require a user interaction to start audio. Click the page or press "Run Preview" in the editor to allow Tone.js to start the Transport and play background loops.

---

## Project structure (high level)

```
emulator/
├─ index.html             # Game library
├─ editor/
│  ├─ index.html          # Web editor UI
│  └─ script.js           # Editor runtime + prefill + Run Preview
├─ game/
│  └─ index.html          # Runtime view for exported samples
├─ samples/               # JSON samples (initCode / updateCode)
├─ css/style.css          # UI styles
└─ README.md
```

---

## How games are authored

Each sample is a JSON file with at least two keys: `initCode` and `updateCode`.

- `initCode` — runs once when the game loads. Use this to set `window._state`, attach input handlers, and initialize audio.
- `updateCode` — runs each frame (or on a timed tick). Use this to update state, perform physics, and draw to `window._ctx`.

Example minimal sample structure:

```json
{
  "initCode": "// run once\nwindow._state = { x: 32, y: 32 };",
  "updateCode": "// called each frame\nconst ctx = window._ctx; ctx.clearRect(0,0,512,512); ctx.fillRect(window._state.x, window._state.y, 8, 8);",
  "displayMode": "1"
}
```

Canvas API notes

- Logical canvas is 64x64. The preview scales it to the visible canvas size. Use `window._ctx` (Canvas 2D context) and standard drawing calls.

Audio

- Tone.js is used in editor and samples for SFX and background music. Samples include optional Tone.js usage; starting audio usually requires a user gesture (click Run Preview).

---

## Usage examples

- Run the Snake sample in the editor: open `/editor/`, click "Run Preview". The editor preloads `samples/snake.json` by default.
- Export your game: use the Export button in the editor to download a `.json` containing `initCode` and `updateCode`.
- Run exported game in player: place exported JSON in `samples/` and visit `/game/?sample=<filename-without-extension>` or use `game/index.html` to load a sample

---

## Where to get help and documentation

- Basic docs and examples are in the `docs/` folder: `docs/index.html` and `docs/examples/`.
- Open an issue in the repository to report bugs or request features.

If you need more hands-on guidance, add an Issue describing what you tried and attach the sample JSON — that helps reproduce problems quickly.

---

## Contributing

Contributions are welcome. For small fixes and improvements:

1. Fork the repository and create a branch for your change.
2. Make your changes and open a Pull Request to `main`.
3. Describe the purpose of the change and any manual verification steps.

Please keep changes small and focused. If you want to add new samples, place them under `samples/` and follow the existing JSON structure.

For more structured contribution instructions, consider adding a `CONTRIBUTING.md` in the repo (not present yet) and link to it from here.

---

## Maintainers

- Repository owner / main maintainer: matthewl580

Want to help maintain? Open an issue and say which area you'd like to work on (UI, samples, audio, editor features).

---

## License

This project is licensed under the MIT License — see `LICENSE` for the full text.

---

If you'd like, I can also:

- Add a CONTRIBUTING.md with a simple PR checklist
- Add a license file (MIT) and CI badge placeholders
- Add a small developer script (npm/powershell) to run a local dev server and linters

Happy to implement any of those — tell me which and I'll add them.
