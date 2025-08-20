# Snake Game

A modern React-based Snake game built with Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.12
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

## Development

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
│   ├── assets/           # Images and other assets
│   ├── App.tsx           # Main application component
│   ├── App.css           # Application styles
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
├── eslint.config.js      # ESLint configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tsconfig.app.json     # App-specific TypeScript config
├── tsconfig.node.json    # Node-specific TypeScript config
└── vite.config.ts        # Vite build configuration
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

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check for linting issues |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run format` | Check code formatting |
| `npm run format:fix` | Format code automatically |
| `npm run type-check` | Run TypeScript type checking |
| `npm run type-check:watch` | Run TypeScript type checking in watch mode |

## Next Steps

The project is set up with a solid foundation. You can now:

1. **Start building the Snake game logic** in `src/App.tsx`
2. **Add game components** in the `src/` directory
3. **Implement game state management** (consider using React Context or a state management library)
4. **Add keyboard controls** for snake movement
5. **Implement collision detection** and game over logic
6. **Add scoring system** and high score tracking
7. **Style the game** using Tailwind CSS classes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all linting and type checks pass
5. Commit your changes (hooks will auto-format)
6. Push to your branch
7. Create a pull request

## License

This project is licensed under the MIT License.
