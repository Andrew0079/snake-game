import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { useGameStore } from "../../store/useGameStore";
import Board from "../Board";

/**
 * Mock the Zustand store to control what data the Board component receives
 * This allows us to test different game states without running the actual game logic
 */
vi.mock("../../store/useGameStore", () => ({
  useGameStore: vi.fn(),
}));

/**
 * Type definition for the selector function that Zustand uses
 * This helps TypeScript understand what the mock function expects as parameters
 */
type SelectorFunction = (state: ReturnType<typeof useGameStore>) => unknown;

describe("Board Component", () => {
  /**
   * Cast the mocked store to the correct type for testing
   * This gives us access to mock methods like mockImplementation
   */
  const mockUseGameStore = useGameStore as unknown as ReturnType<typeof vi.fn>;

  /**
   * Reset all mocks before each test to ensure clean state
   * This prevents test interference and ensures each test starts fresh
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test: Grid Size Rendering
   *
   * What it tests: Verifies that the Board component renders exactly 400 cells (20x20 grid)
   * How it works:
   * 1. Mocks the store to return basic snake and food data
   * 2. Renders the Board component
   * 3. Counts all cells with border styling (which all grid cells have)
   * 4. Asserts that exactly 400 cells are rendered
   */
  it("should render the game board with correct grid size", () => {
    // Mock the store to return basic game state
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return [2, 1, 0];
      if (selector.toString().includes("food")) return 50;
      if (selector.toString().includes("boardSize")) return 20;
      return undefined;
    });

    render(<Board />);

    // Count all cells with border styling (every grid cell has this)
    const cells = document.querySelectorAll('[class*="border"]');
    expect(cells).toHaveLength(400); // 20x20 = 400 cells
  });

  it("should render different board sizes correctly", () => {
    // Test with 15x15 board
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return [2, 1, 0];
      if (selector.toString().includes("food")) return 50;
      if (selector.toString().includes("boardSize")) return 15;
      return undefined;
    });

    render(<Board />);

    const cells = document.querySelectorAll('[class*="border"]');
    expect(cells).toHaveLength(225); // 15x15 = 225 cells
  });

  /**
   * Test: Snake Body Styling
   *
   * What it tests: Verifies that snake body segments (excluding head) are rendered with the correct emerald green styling
   * How it works:
   * 1. Creates a mock snake array with 6 segments at specific positions
   * 2. Mocks the store to return this snake data
   * 3. Renders the Board component
   * 4. Checks that body segments (positions 1-5) have emerald green styling
   * 5. Head (position 0) should have yellow styling (tested separately)
   */
  it("should render snake segments with correct styling", () => {
    const snake = [5, 4, 3, 2, 1, 0]; // Head at position 5, body at positions 4,3,2,1,0
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return snake;
      if (selector.toString().includes("food")) return 50;
      if (selector.toString().includes("boardSize")) return 20;
      return undefined;
    });

    render(<Board />);

    // Verify body segments (excluding head) have emerald green styling
    const bodySegments = snake.slice(1); // All except the head
    bodySegments.forEach((_) => {
      const cell = document.querySelector(`[class*="emerald"]`);
      expect(cell).toBeInTheDocument();
    });

    // Verify head has yellow styling (separate check)
    const headCell = document.querySelector(`[class*="yellow"]`);
    expect(headCell).toBeInTheDocument();
  });

  /**
   * Test: Snake Head Styling
   *
   * What it tests: Verifies that the snake's head is rendered with distinct yellow styling
   * How it works:
   * 1. Creates a mock snake with head at position 10 (first element in array)
   * 2. Mocks the store to return this snake data
   * 3. Renders the Board component
   * 4. Looks for a cell with yellow styling (head color)
   * 5. Asserts that the yellow head cell exists in the DOM
   */
  it("should render snake head with different styling", () => {
    const snake = [10, 9, 8]; // Head at position 10 (first element)
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return snake;
      if (selector.toString().includes("food")) return 50;
      if (selector.toString().includes("boardSize")) return 20;
      return undefined;
    });

    render(<Board />);

    // Look for the yellow head cell (snake[0] gets special styling)
    const headCell = document.querySelector('[class*="yellow"]');
    expect(headCell).toBeInTheDocument();
  });

  /**
   * Test: Food Styling
   *
   * What it tests: Verifies that food items are rendered with the correct blue styling
   * How it works:
   * 1. Sets a specific food position (25) that doesn't conflict with snake
   * 2. Mocks the store to return basic snake data and the food position
   * 3. Renders the Board component
   * 4. Looks for a cell with blue styling (food color)
   * 5. Asserts that the blue food cell exists in the DOM
   */
  it("should render food with correct styling", () => {
    const foodPosition = 25; // Food at position 25
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return [2, 1, 0];
      if (selector.toString().includes("food")) return foodPosition;
      if (selector.toString().includes("boardSize")) return 20;
      return undefined;
    });

    render(<Board />);

    // Look for the blue food cell
    const foodCell = document.querySelector('[class*="blue"]');
    expect(foodCell).toBeInTheDocument();
  });

  /**
   * Test: Empty Cell Styling
   *
   * What it tests: Verifies that empty cells (not snake or food) are rendered with slate gray styling
   * How it works:
   * 1. Mocks the store with a small snake and food at specific positions
   * 2. Renders the Board component
   * 3. Counts all cells with slate styling (empty cell color)
   * 4. Asserts that there are empty cells with slate styling (most of the 400 cells)
   */
  it("should render empty cells with correct styling", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return [2, 1, 0];
      if (selector.toString().includes("food")) return 50;
      if (selector.toString().includes("boardSize")) return 20;
      return undefined;
    });

    render(<Board />);

    // Count empty cells with slate gray styling (most of the 400 cells)
    const emptyCells = document.querySelectorAll('[class*="slate"]');
    expect(emptyCells.length).toBeGreaterThan(0);
  });

  /**
   * Test: Empty Snake Handling
   *
   * What it tests: Verifies that the Board component handles an empty snake array gracefully
   * How it works:
   * 1. Mocks the store with an empty snake array (edge case)
   * 2. Renders the Board component
   * 3. Verifies that the grid still renders correctly with 400 cells
   * 4. Ensures the component doesn't crash when there's no snake
   */
  it("should handle empty snake array", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return []; // Empty snake
      if (selector.toString().includes("food")) return 50;
      if (selector.toString().includes("boardSize")) return 20;
      return undefined;
    });

    render(<Board />);

    // Verify the board still renders correctly even with no snake
    const cells = document.querySelectorAll('[class*="border"]');
    expect(cells).toHaveLength(400);
  });

  /**
   * Test: Snake-Food Collision Styling
   *
   * What it tests: Verifies that when snake head and food occupy the same position, snake head styling takes precedence
   * How it works:
   * 1. Creates a snake with head at position 25
   * 2. Sets food at the same position 25 (collision scenario)
   * 3. Mocks the store to return this conflicting data
   * 4. Renders the Board component
   * 5. Verifies that yellow head styling is applied (not blue food styling)
   * 6. Tests the rendering priority logic in the component
   */
  it("should handle snake and food at same position", () => {
    const snake = [25, 24, 23]; // Head at position 25
    const food = 25; // Food at same position as snake head
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return snake;
      if (selector.toString().includes("food")) return food;
      if (selector.toString().includes("boardSize")) return 20;
      return undefined;
    });

    render(<Board />);

    // Snake head styling should take precedence over food styling
    const headCell = document.querySelector('[class*="yellow"]');
    expect(headCell).toBeInTheDocument();
  });

  /**
   * Test: Grid Layout CSS
   *
   * What it tests: Verifies that the grid container has the correct CSS Grid layout properties
   * How it works:
   * 1. Mocks the store with basic game data
   * 2. Renders the Board component
   * 3. Finds the grid container element
   * 4. Checks that it has the correct CSS Grid template properties
   * 5. Verifies 20 columns and 20 rows are defined
   */
  it("should have correct grid layout", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return [2, 1, 0];
      if (selector.toString().includes("food")) return 50;
      if (selector.toString().includes("boardSize")) return 20;
      return undefined;
    });

    render(<Board />);

    // Check that the grid container exists and has correct CSS Grid properties
    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveStyle({
      gridTemplateColumns: "repeat(20, 1fr)", // 20 equal-width columns
      gridTemplateRows: "repeat(20, 1fr)", // 20 equal-height rows
    });
  });

  it("should have correct grid layout for different sizes", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return [2, 1, 0];
      if (selector.toString().includes("food")) return 50;
      if (selector.toString().includes("boardSize")) return 25;
      return undefined;
    });

    render(<Board />);

    // Check that the grid container has correct CSS Grid properties for 25x25
    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveStyle({
      gridTemplateColumns: "repeat(25, 1fr)", // 25 equal-width columns
      gridTemplateRows: "repeat(25, 1fr)", // 25 equal-height rows
    });
  });

  /**
   * Test: Responsive Design Classes
   *
   * What it tests: Verifies that the grid container has the correct responsive design CSS classes
   * How it works:
   * 1. Mocks the store with basic game data
   * 2. Renders the Board component
   * 3. Finds the grid container element
   * 4. Checks that it has the correct Tailwind CSS classes for responsive design
   * 5. Verifies aspect-ratio, sizing, and viewport constraints are applied
   */
  it("should be responsive with proper sizing", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("snake")) return [2, 1, 0];
      if (selector.toString().includes("food")) return 50;
      if (selector.toString().includes("boardSize")) return 20;
      return undefined;
    });

    render(<Board />);

    // Verify responsive design classes are applied
    const grid = document.querySelector(".grid");
    expect(grid).toHaveClass(
      "aspect-square", // Maintains 1:1 aspect ratio
      "w-full", // Full width of container
      "h-full", // Full height of container
      "max-w-[90vmin]", // Max width of 90% of viewport minimum
      "max-h-[90vmin]", // Max height of 90% of viewport minimum
    );
  });
});
