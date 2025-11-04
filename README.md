# 64x64 Game Engine

A lightweight, browser-based game engine for creating and playing retro-style 64x64 pixel games.

## Features

- 🎮 64x64 pixel game canvas with automatic scaling
- 🎨 Built-in game editor with live preview
- 🎵 Audio support using Tone.js
- 🌓 Dark mode support
- 📱 Responsive design for all devices
- 🔄 Import/Export game functionality

## Quick Start

1. Clone the repository
2. Open `index.html` in your browser
3. Click "Play" to try the sample game or "Editor" to create your own

## Game Development

### Game Structure

Games are defined by two main functions:

- `initCode`: Runs once when the game starts
- `updateCode`: Runs every frame (60 FPS)

Example:
```javascript
{
  "initCode": "// Setup code here",
  "updateCode": "// Per-frame update code here",
  "displayMode": "1"
}
```

### Canvas API

The game runs on an HTML5 canvas with a logical resolution of 64x64 pixels.

Available context: `window._ctx`
- Use standard Canvas 2D API methods
- Coordinates are automatically scaled from 64x64 to screen size

### Audio System

Built-in audio support using Tone.js:
- Synthesizers
- Sequencing
- Effects
- Background music

Example:
```javascript
// Create a synth
const synth = new Tone.Synth().toDestination();

// Play a note
synth.triggerAttackRelease("C4", "8n");
```

## Game Editor

The editor provides:
- Live code editing
- Real-time preview
- Import/Export functionality
- Error checking

## Sample Game

A sample game is included demonstrating:
- Player movement
- Background music
- Collision detection
- Score tracking

## API Reference

### Global Objects

- `window._ctx`: Canvas rendering context
- `window._synth`: Default Tone.js synthesizer
- `window._loop`: Default Tone.js loop

### Canvas Methods

- `fillRect(x, y, width, height)`: Draw filled rectangle
- `fillStyle = color`: Set fill color
- `fillText(text, x, y)`: Draw text
- More available via standard Canvas 2D API

### Helper Functions

- `getScale()`: Returns current display scale
- `resetCanvas()`: Clears the canvas
- `playSound(note, duration)`: Play a musical note

## Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.

## License

This project is licensed under the MIT License - see LICENSE.md for details.