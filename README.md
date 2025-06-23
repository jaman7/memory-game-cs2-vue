# Memory Game CS2 – Vue 3 + TypeScript

An interactive memory game featuring weapon graphics from Counter-Strike 2.

## Demo

[https://memory-game-cs2-vue.pages.dev](https://memory-game-cs2-vue.pages.dev)

---

## 🔗 Vitest Coverage Report

[https://memory-game-cs2-vue-tests.pages.dev/](https://memory-game-cs2-vue-tests.pages.dev/)

## Technologies

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue I18n](https://vue-i18n.intlify.dev/)
- SCSS (modular with mixins and variables)
- HTML5 Canvas
- LocalStorage
- Custom hooks + logical composition

## Description of functionality

### Game

- Discovering pairs of identical tiles (CS2 weapons).
- Parallax effect on tiles (mouse interaction).
- Three difficulty levels: easy, medium, hard.
- Possibility to enter `seed` - same seed = same layout.

### Interface

- Rendering the board in `<canvas>`.
- Background gradients and colors dependent on weapon rarity.
- Sounds: tile rotation, pair matching.
- Game start and end modals.

### State of the game

- Game continues after refreshing the browser.
- History of games played: number of moves, time, seed, difficulty.
- Saving and restoring the state via the developer panel.

### Other

- Responsive layout for desktop and mobile.
- Multiple language support (e.g. PL / EN).
- Volume slider and mute button.

## Local launch

```bash
# Clone the repository
git clone https://github.com/jaman7/memory-game-cs2-vue.git .

# Dependency installation
npm install

# Starting a local dev server
npm run dev

# Production build
npm run build

# Local build preview
npm run preview
```

```bash
# Tests
npm run test

# Tests UI
npm run test:ui

# Run tests with report:
npm run testreport

# The app will be available at:
http://localhost:5173
```

## Architecture

```
src/
├── components/ # UI components and game logic
├── hooks/ # Custom Hooks (Timer, Animations, Canvas)
├── stores/ # Pinia stores
├── assests/scss/ # SCSS with mixins and variables
├── i18n/ # Language files
├── shared/ # Common Components (Button, Input, Spinner etc.)
└── main.ts # Application initialization
```
