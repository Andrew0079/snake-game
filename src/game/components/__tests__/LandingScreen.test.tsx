import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { useGameStore } from "../../store/useGameStore";
import LandingScreen from "../LandingScreen";

// Mock the store
vi.mock("../../store/useGameStore", () => ({
  useGameStore: vi.fn(),
}));

type SelectorFunction = (state: ReturnType<typeof useGameStore>) => unknown;

describe("LandingScreen Component", () => {
  const mockSetPlayerName = vi.fn();
  const mockSetStarted = vi.fn();
  const mockSetBoardSize = vi.fn();
  const mockUseGameStore = useGameStore as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("playerName")) return "";
      if (selector.toString().includes("setPlayerName"))
        return mockSetPlayerName;
      if (selector.toString().includes("setStarted")) return mockSetStarted;
      if (selector.toString().includes("boardSize")) return 20;
      if (selector.toString().includes("setBoardSize")) return mockSetBoardSize;
      return undefined;
    });
  });

  it("should render the landing screen with title", () => {
    render(<LandingScreen />);

    expect(screen.getByText("Sneaky")).toBeInTheDocument();
  });

  it("should render player name input", () => {
    render(<LandingScreen />);

    const nameInput = screen.getByPlaceholderText("Enter your name...");
    expect(nameInput).toBeInTheDocument();
  });

  it("should handle player name input", () => {
    render(<LandingScreen />);

    const nameInput = screen.getByPlaceholderText("Enter your name...");
    fireEvent.change(nameInput, { target: { value: "TestPlayer" } });

    expect(mockSetPlayerName).toHaveBeenCalledWith("TestPlayer");
  });

  it("should render board size selector", () => {
    render(<LandingScreen />);

    expect(screen.getByText("Board Size: 20×20")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("should display current board size", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("playerName")) return "";
      if (selector.toString().includes("setPlayerName"))
        return mockSetPlayerName;
      if (selector.toString().includes("setStarted")) return mockSetStarted;
      if (selector.toString().includes("boardSize")) return 15;
      if (selector.toString().includes("setBoardSize")) return mockSetBoardSize;
      return undefined;
    });

    render(<LandingScreen />);

    expect(screen.getByText("Board Size: 15×15")).toBeInTheDocument();
  });

  it("should handle board size changes", () => {
    render(<LandingScreen />);

    const sizeSlider = screen.getByRole("slider");
    fireEvent.change(sizeSlider, { target: { value: "25" } });

    expect(mockSetBoardSize).toHaveBeenCalledWith(25);
  });

  it("should have correct slider attributes", () => {
    render(<LandingScreen />);

    const sizeSlider = screen.getByRole("slider");
    expect(sizeSlider).toHaveAttribute("min", "10");
    expect(sizeSlider).toHaveAttribute("max", "30");
    expect(sizeSlider).toHaveAttribute("step", "5");
    expect(sizeSlider).toHaveAttribute("value", "20");
  });

  it("should render size labels", () => {
    render(<LandingScreen />);

    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
  });

  it("should render play button", () => {
    render(<LandingScreen />);

    const playButton = screen.getByRole("button", { name: "Play" });
    expect(playButton).toBeInTheDocument();
  });

  it("should disable play button when no player name", () => {
    render(<LandingScreen />);

    const playButton = screen.getByRole("button", { name: "Play" });
    expect(playButton).toBeDisabled();
  });

  it("should enable play button when player name is entered", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("playerName")) return "TestPlayer";
      if (selector.toString().includes("setPlayerName"))
        return mockSetPlayerName;
      if (selector.toString().includes("setStarted")) return mockSetStarted;
      if (selector.toString().includes("boardSize")) return 20;
      if (selector.toString().includes("setBoardSize")) return mockSetBoardSize;
      return undefined;
    });

    render(<LandingScreen />);

    const playButton = screen.getByRole("button", { name: "Play" });
    expect(playButton).not.toBeDisabled();
  });

  it("should start game when play button is clicked", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("playerName")) return "TestPlayer";
      if (selector.toString().includes("setPlayerName"))
        return mockSetPlayerName;
      if (selector.toString().includes("setStarted")) return mockSetStarted;
      if (selector.toString().includes("boardSize")) return 20;
      if (selector.toString().includes("setBoardSize")) return mockSetBoardSize;
      return undefined;
    });

    render(<LandingScreen />);

    const playButton = screen.getByRole("button", { name: "Play" });
    fireEvent.click(playButton);

    expect(mockSetStarted).toHaveBeenCalledWith(true);
  });

  it("should render game instructions", () => {
    render(<LandingScreen />);

    expect(screen.getByText("Avoid collisions!")).toBeInTheDocument();
  });
});
