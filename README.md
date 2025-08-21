# Snake Game

A modern React-based Snake game built with Vite, TypeScript, Tailwind CSS, and Zustand for state management. Features configurable board sizes, responsive design, and comprehensive test coverage.

## Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.12
- **State Management**: Zustand 5.0.2
- **Testing**: Vitest 3.2.4 + React Testing Library 16.1.0
- **Code Quality**: ESLint 9.33.0 + Prettier 3.3.3
- **Git Hooks**: Husky 9.1.7 + lint-staged 15.5.2

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd snake-game
```

2. Install dependencies:

```bash
npm install
```

## Running the Project

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Game Features

- **Classic Snake Gameplay**: Navigate the snake to eat food and grow
- **Configurable Board Size**: Choose from 10x10 to 30x30 grid sizes
- **Responsive Design**: Works on desktop and mobile devices
- **Score Tracking**: Keep track of your current score and games played
- **Keyboard Controls**: Use arrow keys to control the snake
- **Game Over Detection**: Collision with walls or self ends the game
- **Restart Functionality**: Quick restart and quit options

### How to Play

1. Enter your name on the landing screen
2. Choose your preferred board size (10-30)
3. Click "Start Game" to begin
4. Use arrow keys to move the snake
5. Eat the blue food to grow and increase your score
6. Avoid hitting walls or the snake's own body

## State Management with Zustand

This project uses **Zustand** for lightweight, efficient state management. The game state is centralized in `src/game/store/useGameStore.ts` and includes:

### Game State Structure

```typescript
interface GameState {
  // Game status
  started: boolean;
  gameOver: boolean;
  won: boolean;

  // Player data
  playerName: string;
  score: number;
  gamesPlayed: number;

  // Game configuration
  boardSize: number; // Configurable 10-30

  // Game entities
  snake: number[]; // Array of cell positions
  food: number; // Single cell position
  direction: Direction; // UP, DOWN, LEFT, RIGHT
  nextDirection: Direction;
}
```

### Store Actions

- `setStarted(started: boolean)`: Start/stop the game
- `setPlayerName(name: string)`: Set player name
- `setBoardSize(size: number)`: Configure board size
- `moveSnake()`: Handle snake movement and collision detection
- `setDirection(direction: Direction)`: Change snake direction
- `resetGame()`: Reset game state for new game
- `incrementGamesPlayed()`: Track game statistics

### Using the Store

```typescript
import { useGameStore } from "./store/useGameStore";

// Subscribe to specific state
const snake = useGameStore((state) => state.snake);
const score = useGameStore((state) => state.score);

// Access actions
const moveSnake = useGameStore((state) => state.moveSnake);
const resetGame = useGameStore((state) => state.resetGame);
```

## Testing

This project has comprehensive test coverage using **Vitest** and **React Testing Library**.

### Running Tests

```bash
# Run all tests in watch mode (recommended during development)
npm run test

# Run all tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI (interactive test runner)
npm run test:ui
```

### Running Individual Tests

```bash
# Run specific test file
npm run test:run src/game/store/__tests__/useGameStore.test.ts

# Run tests matching a pattern
npm run test:run --grep "Board Component"

# Run tests in a specific directory
npm run test:run src/game/components/__tests__/
```

### Test Coverage

The project includes tests for:

- **Store Logic** (`useGameStore.test.ts`): 16 tests covering state management, game logic, collision detection, and board size configuration
- **Components** (`Board.test.tsx`, `GameOverModal.test.tsx`, `LandingScreen.test.tsx`): 34 tests covering rendering, styling, and user interactions
- **Hooks** (`useKeyboard.test.ts`): 7 tests covering keyboard input handling and direction mapping

### Test Structure

```
src/
├── game/
│   ├── components/
│   │   └── __tests__/
│   │       ├── Board.test.tsx
│   │       ├── GameOverModal.test.tsx
│   │       └── LandingScreen.test.tsx
│   ├── hooks/
│   │   └── __tests__/
│   │       └── useKeyboard.test.ts
│   └── store/
│       └── __tests__/
│           └── useGameStore.test.ts
└── test/
    └── setup.ts  # Test environment configuration
```

## Code Quality Tools

### Linting

- **Check for issues**: `npm run lint`
- **Auto-fix issues**: `npm run lint:fix`

### Code Formatting

- **Check formatting**: `npm run format`
- **Auto-format code**: `npm run format:fix`

### Type Checking

- **Type check**: `npm run type-check`
- **Type check (watch mode)**: `npm run type-check:watch`

## Git Hooks

This project uses Husky to enforce code quality standards:

- **Pre-commit**: Runs lint-staged to format and lint changed files
- **Pre-push**: Runs TypeScript type checking

### What happens on commit:

- ESLint fixes auto-fixable issues
- Prettier formats code
- Only staged files are processed

### What happens on push:

- TypeScript type checking ensures no type errors

## Project Structure

```
snake-game/
├── .husky/                 # Git hooks configuration
│   ├── pre-commit         # Runs lint-staged before commit
│   └── pre-push           # Runs type-check before push
├── public/                # Static assets
├── src/                   # Source code
│   ├── game/              # Game-specific code
│   │   ├── components/    # React components
│   │   │   ├── __tests__/ # Component tests
│   │   │   ├── Board.tsx  # Game board rendering
│   │   │   ├── GameOverModal.tsx # Game over modal
│   │   │   ├── LandingScreen.tsx # Start screen
│   │   │   └── Sidebar.tsx # Game info sidebar
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── __tests__/ # Hook tests
│   │   │   ├── useGameLoop.ts # Game loop logic
│   │   │   └── useKeyboard.ts # Keyboard input
│   │   ├── store/         # Zustand store
│   │   │   ├── __tests__/ # Store tests
│   │   │   └── useGameStore.ts # Game state management
│   │   └── index.tsx      # Main game component
│   ├── test/              # Test configuration
│   │   └── setup.ts       # Vitest setup
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application styles
│   ├── index.css          # Global styles (Tailwind)
│   └── main.tsx           # Application entry point
├── eslint.config.js       # ESLint configuration
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration for Tailwind
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json      # App-specific TypeScript config
├── tsconfig.node.json     # Node-specific TypeScript config
└── vite.config.ts         # Vite build configuration
```

## Configuration Details

### ESLint Rules

- **TypeScript strictness**: No `any` types, explicit module boundaries
- **Import organization**: Enforced import order with React imports first
- **Unused variables**: Error on unused vars (except `_` prefixed)
- **React Hooks**: Enforces rules of hooks
- **Prettier integration**: Disables conflicting stylistic rules

### TypeScript Configuration

- **Strict mode**: Enabled with all strict checks
- **Target**: ES2022
- **Module resolution**: Bundler mode
- **JSX**: React JSX transform

### Tailwind CSS

- **Version**: 4.1.12 (latest)
- **Prettier plugin**: Automatic class sorting
- **PostCSS integration**: For processing Tailwind directives

### Vitest Configuration

- **Environment**: jsdom for DOM testing
- **Global test functions**: Available without imports
- **Setup file**: Configures React Testing Library
- **CSS support**: Enabled for component testing

## Available Scripts

| Script                     | Description                                |
| -------------------------- | ------------------------------------------ |
| `npm run dev`              | Start development server                   |
| `npm run build`            | Build for production                       |
| `npm run preview`          | Preview production build                   |
| `npm run test`             | Run tests in watch mode                    |
| `npm run test:run`         | Run tests once                             |
| `npm run test:ui`          | Run tests with interactive UI              |
| `npm run test:coverage`    | Run tests with coverage report             |
| `npm run lint`             | Check for linting issues                   |
| `npm run lint:fix`         | Fix linting issues automatically           |
| `npm run format`           | Check code formatting                      |
| `npm run format:fix`       | Format code automatically                  |
| `npm run type-check`       | Run TypeScript type checking               |
| `npm run type-check:watch` | Run TypeScript type checking in watch mode |

## Development Workflow

1. **Start development**: `npm run dev`
2. **Run tests**: `npm run test` (in separate terminal)
3. **Make changes**: Edit files in `src/`
4. **Check quality**: Tests and linting run automatically
5. **Commit changes**: Git hooks ensure code quality
6. **Build for production**: `npm run build`

## Responsive Design

The game is fully responsive and works on:

- **Desktop**: Full sidebar with game information
- **Mobile**: Compact layout with score overlay and bottom controls
- **Tablet**: Adaptive layout based on screen size

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass: `npm run test:run`
5. Ensure code quality: `npm run lint` and `npm run type-check`
6. Commit your changes (hooks will auto-format)
7. Push to your branch
8. Create a pull request
