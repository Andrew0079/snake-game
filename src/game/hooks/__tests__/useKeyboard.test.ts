import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { useGameStore } from "../../store/useGameStore";
import { useKeyboard } from "../useKeyboard";

/**
 * Mock the Zustand store to control what data the useKeyboard hook receives
 * This allows us to test keyboard handling without running the actual game logic
 */
vi.mock("../../store/useGameStore", () => ({
  useGameStore: vi.fn(),
}));

/**
 * Type definition for the selector function that Zustand uses
 * This helps TypeScript understand what the mock function expects as parameters
 */
type SelectorFunction = (state: ReturnType<typeof useGameStore>) => unknown;

describe("useKeyboard Hook", () => {
  /**
   * Mock functions to simulate store state and actions
   * - mockSetNextDirection: Simulates the setNextDirection store action
   * - mockDirection: Simulates getting the current direction from store
   * - mockUseGameStore: Typed version of the mocked store for testing
   */
  const mockSetNextDirection = vi.fn();
  const mockDirection = vi.fn();
  const mockUseGameStore = useGameStore as unknown as ReturnType<typeof vi.fn>;

  /**
   * Reset all mocks before each test to ensure clean state
   * Sets up the mock store to return appropriate values based on what the hook requests:
   * - When hook asks for "direction", returns mockDirection() value
   * - When hook asks for "setNextDirection", returns the mock function
   */
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("direction")) {
        return mockDirection();
      }
      if (selector.toString().includes("setNextDirection")) {
        return mockSetNextDirection;
      }
      return undefined;
    });
  });

  /**
   * Test: Event Listener Setup and Cleanup
   *
   * What it tests: Verifies that the useKeyboard hook properly sets up and cleans up event listeners
   * How it works:
   * 1. Creates spies on window.addEventListener and window.removeEventListener
   * 2. Sets up mock direction state
   * 3. Renders the hook using renderHook (simulates component mounting)
   * 4. Verifies that addEventListener was called with "keydown" and a function
   * 5. Unmounts the hook (simulates component unmounting)
   * 6. Verifies that removeEventListener was called to clean up the listener
   *
   * This ensures no memory leaks from lingering event listeners
   */
  it("should set up keyboard event listeners", () => {
    // Spy on global window methods to track if they're called
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    // Mock the current direction state
    mockDirection.mockReturnValue("RIGHT");

    // Render the hook (simulates mounting a component that uses useKeyboard)
    const { unmount } = renderHook(() => useKeyboard());

    // Verify event listener was added on mount
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );

    // Unmount the hook (simulates component unmounting)
    unmount();

    // Verify event listener was removed on unmount (cleanup)
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
  });

  /**
   * Test: Arrow Key Processing
   *
   * What it tests: Verifies that arrow keys are correctly mapped to game directions
   * How it works:
   * 1. Sets up mock direction state (moving RIGHT)
   * 2. Renders the hook to activate the keyboard listener
   * 3. Creates a synthetic KeyboardEvent with "ArrowUp" key
   * 4. Uses act() to dispatch the event (ensures React updates are processed)
   * 5. Verifies that setNextDirection was called with "UP"
   *
   * This tests the KEY_TO_DIRECTION mapping: ArrowUp → "UP"
   */
  it("should handle arrow key presses correctly", () => {
    // Set current direction to RIGHT
    mockDirection.mockReturnValue("RIGHT");

    // Activate the keyboard listener
    renderHook(() => useKeyboard());

    // Create and dispatch a synthetic arrow key event
    const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
    act(() => {
      window.dispatchEvent(keydownEvent);
    });

    // Verify the key was mapped to the correct direction
    expect(mockSetNextDirection).toHaveBeenCalledWith("UP");
  });

  /**
   * Test: Non-Arrow Key Filtering
   *
   * What it tests: Verifies that non-arrow keys are ignored and don't affect snake direction
   * How it works:
   * 1. Sets up mock direction state
   * 2. Renders the hook to activate the keyboard listener
   * 3. Creates a KeyboardEvent with a non-arrow key ("Space")
   * 4. Dispatches the event using act()
   * 5. Verifies that setNextDirection was NOT called
   *
   * This ensures only arrow keys control the snake, preventing accidental direction changes
   * from other keys like spacebar, WASD, etc.
   */
  it("should ignore non-arrow keys", () => {
    // Set current direction state
    mockDirection.mockReturnValue("RIGHT");

    // Activate the keyboard listener
    renderHook(() => useKeyboard());

    // Create and dispatch a non-arrow key event
    const keydownEvent = new KeyboardEvent("keydown", { key: "Space" });
    act(() => {
      window.dispatchEvent(keydownEvent);
    });

    // Verify that non-arrow keys are ignored
    expect(mockSetNextDirection).not.toHaveBeenCalled();
  });

  /**
   * Test: Reverse Direction Prevention
   *
   * What it tests: Verifies that the snake cannot immediately reverse direction (180° turn)
   * How it works:
   * 1. Sets current direction to "UP"
   * 2. Renders the hook to activate the keyboard listener
   * 3. Attempts to press ArrowDown (opposite of UP)
   * 4. Uses act() to dispatch the event
   * 5. Verifies that setNextDirection was NOT called
   *
   * This prevents the snake from immediately colliding with itself, which would
   * cause instant game over. The OPPOSITE_DIRECTIONS mapping prevents: UP ↔ DOWN, LEFT ↔ RIGHT
   */
  it("should prevent reverse direction (180° turn)", () => {
    // Set snake to be moving UP
    mockDirection.mockReturnValue("UP");

    // Activate the keyboard listener
    renderHook(() => useKeyboard());

    // Try to reverse direction by pressing DOWN (should be prevented)
    const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
    act(() => {
      window.dispatchEvent(keydownEvent);
    });

    // Verify that reverse direction was prevented
    expect(mockSetNextDirection).not.toHaveBeenCalled();
  });

  /**
   * Test: Valid Direction Changes
   *
   * What it tests: Verifies that perpendicular direction changes are allowed
   * How it works:
   * 1. Sets current direction to "UP"
   * 2. Renders the hook to activate the keyboard listener
   * 3. Presses ArrowLeft (perpendicular to UP, not opposite)
   * 4. Uses act() to dispatch the event
   * 5. Verifies that setNextDirection was called with "LEFT"
   *
   * This tests that the snake can turn 90° (perpendicular turns), which is normal
   * gameplay behavior. Only 180° turns (direct opposites) are prevented.
   */
  it("should allow valid direction changes", () => {
    // Set snake to be moving UP
    mockDirection.mockReturnValue("UP");

    // Activate the keyboard listener
    renderHook(() => useKeyboard());

    // Try to turn left while moving up (90° turn, should be allowed)
    const keydownEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
    act(() => {
      window.dispatchEvent(keydownEvent);
    });

    // Verify that perpendicular direction change was allowed
    expect(mockSetNextDirection).toHaveBeenCalledWith("LEFT");
  });

  /**
   * Test: Multiple Arrow Keys with Direction Filtering
   *
   * What it tests: Verifies that all arrow keys are processed correctly with one being filtered out
   * How it works:
   * 1. Sets current direction to "RIGHT"
   * 2. Renders the hook to activate the keyboard listener
   * 3. Iterates through all arrow keys: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
   * 4. Dispatches each key event using act()
   * 5. Verifies that only 3 calls were made (ArrowLeft filtered out)
   * 6. Checks the exact order and values of the allowed calls
   *
   * Expected behavior when moving RIGHT:
   * - ArrowUp → "UP" (allowed, perpendicular)
   * - ArrowDown → "DOWN" (allowed, perpendicular)
   * - ArrowLeft → "LEFT" (prevented, opposite direction)
   * - ArrowRight → "RIGHT" (allowed, same direction is OK)
   */
  it("should handle arrow keys when moving right", () => {
    // Set snake to be moving RIGHT
    mockDirection.mockReturnValue("RIGHT");

    // Activate the keyboard listener
    renderHook(() => useKeyboard());

    // Test all arrow keys in sequence
    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    arrowKeys.forEach((key) => {
      const keydownEvent = new KeyboardEvent("keydown", { key });
      act(() => {
        window.dispatchEvent(keydownEvent);
      });
    });

    // When moving RIGHT, ArrowLeft should be prevented (opposite direction)
    // So we expect 3 calls: UP, DOWN, RIGHT (LEFT is filtered out)
    expect(mockSetNextDirection).toHaveBeenCalledTimes(3);
    expect(mockSetNextDirection).toHaveBeenNthCalledWith(1, "UP");
    expect(mockSetNextDirection).toHaveBeenNthCalledWith(2, "DOWN");
    expect(mockSetNextDirection).toHaveBeenNthCalledWith(3, "RIGHT");
  });

  /**
   * Test: Comprehensive Reverse Direction Prevention
   *
   * What it tests: Verifies that all possible reverse direction combinations are prevented
   * How it works:
   * 1. Defines all possible direction pairs that should be prevented
   * 2. For each test case, sets the current direction and tests the opposite
   * 3. Uses mockClear() to reset call counts between iterations
   * 4. Renders a fresh hook instance for each test
   * 5. Attempts to press the opposite arrow key
   * 6. Verifies that setNextDirection was NOT called
   *
   * Test cases cover all opposite pairs:
   * - UP ↔ DOWN: Moving up, pressing down (and vice versa)
   * - LEFT ↔ RIGHT: Moving left, pressing right (and vice versa)
   *
   * This ensures the OPPOSITE_DIRECTIONS mapping works correctly in all scenarios
   */
  it("should prevent all reverse directions", () => {
    // Define all opposite direction pairs to test
    const directionTests = [
      { current: "UP", prevented: "DOWN" },
      { current: "DOWN", prevented: "UP" },
      { current: "LEFT", prevented: "RIGHT" },
      { current: "RIGHT", prevented: "LEFT" },
    ];

    directionTests.forEach(({ current, prevented }) => {
      // Set up the current direction for this test case
      mockDirection.mockReturnValue(current);
      mockSetNextDirection.mockClear(); // Reset call count for this iteration

      // Render a fresh hook instance
      renderHook(() => useKeyboard());

      // Try to press the opposite direction key
      const keydownEvent = new KeyboardEvent("keydown", {
        key: `Arrow${prevented}`, // e.g., "ArrowDown" when prevented is "DOWN"
      });
      act(() => {
        window.dispatchEvent(keydownEvent);
      });

      // Verify that the reverse direction was prevented
      expect(mockSetNextDirection).not.toHaveBeenCalled();
    });
  });
});
