import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { useGameStore } from "../../store/useGameStore";
import GameOverModal from "../GameOverModal";

vi.mock("../../store/useGameStore", () => ({
  useGameStore: vi.fn(),
}));

type SelectorFunction = (state: ReturnType<typeof useGameStore>) => unknown;

describe("GameOverModal", () => {
  const mockResetGame = vi.fn();
  const mockQuitGame = vi.fn();
  const mockUseGameStore = useGameStore as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when game is not over", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("gameOver")) return "NONE";
      if (selector.toString().includes("score")) return 0;
      if (selector.toString().includes("gamesPlayed")) return 0;
      if (selector.toString().includes("resetGame")) return mockResetGame;
      if (selector.toString().includes("quitGame")) return mockQuitGame;
      return undefined;
    });

    const { container } = render(<GameOverModal />);
    expect(container.firstChild).toBeNull();
  });

  it("should render win modal with correct content", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("gameOver")) return "WIN";
      if (selector.toString().includes("score")) return 30;
      if (selector.toString().includes("gamesPlayed")) return 0;
      if (selector.toString().includes("resetGame")) return mockResetGame;
      if (selector.toString().includes("quitGame")) return mockQuitGame;
      return undefined;
    });

    render(<GameOverModal />);

    expect(screen.getByText("🎉 You Win!")).toBeInTheDocument();
    expect(screen.getByText("Final Score: 30")).toBeInTheDocument();
    expect(screen.getByText("Games played: 1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New Game" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quit" })).toBeInTheDocument();
  });

  it("should render lose modal with correct content", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("gameOver")) return "LOSE";
      if (selector.toString().includes("score")) return 15;
      if (selector.toString().includes("gamesPlayed")) return 2;
      if (selector.toString().includes("resetGame")) return mockResetGame;
      if (selector.toString().includes("quitGame")) return mockQuitGame;
      return undefined;
    });

    render(<GameOverModal />);

    expect(screen.getByText("💀 Game Over")).toBeInTheDocument();
    expect(screen.getByText("Final Score: 15")).toBeInTheDocument();
    expect(screen.getByText("Games played: 3")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New Game" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quit" })).toBeInTheDocument();
  });

  it("should call resetGame when New Game button is clicked", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("gameOver")) return "WIN";
      if (selector.toString().includes("score")) return 30;
      if (selector.toString().includes("gamesPlayed")) return 1;
      if (selector.toString().includes("resetGame")) return mockResetGame;
      if (selector.toString().includes("quitGame")) return mockQuitGame;
      return undefined;
    });

    render(<GameOverModal />);

    const newGameButton = screen.getByRole("button", { name: "New Game" });
    fireEvent.click(newGameButton);

    expect(mockResetGame).toHaveBeenCalledTimes(1);
  });

  it("should call quitGame when Quit button is clicked", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("gameOver")) return "LOSE";
      if (selector.toString().includes("score")) return 15;
      if (selector.toString().includes("gamesPlayed")) return 3;
      if (selector.toString().includes("resetGame")) return mockResetGame;
      if (selector.toString().includes("quitGame")) return mockQuitGame;
      return undefined;
    });

    render(<GameOverModal />);

    const quitButton = screen.getByRole("button", { name: "Quit" });
    fireEvent.click(quitButton);

    expect(mockQuitGame).toHaveBeenCalledTimes(1);
  });

  it("should have correct styling for win state", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("gameOver")) return "WIN";
      if (selector.toString().includes("score")) return 30;
      if (selector.toString().includes("gamesPlayed")) return 1;
      if (selector.toString().includes("resetGame")) return mockResetGame;
      if (selector.toString().includes("quitGame")) return mockQuitGame;
      return undefined;
    });

    render(<GameOverModal />);

    const title = screen.getByText("🎉 You Win!");
    expect(title).toHaveClass("text-lime-400");
  });

  it("should have correct styling for lose state", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("gameOver")) return "LOSE";
      if (selector.toString().includes("score")) return 15;
      if (selector.toString().includes("gamesPlayed")) return 3;
      if (selector.toString().includes("resetGame")) return mockResetGame;
      if (selector.toString().includes("quitGame")) return mockQuitGame;
      return undefined;
    });

    render(<GameOverModal />);

    const title = screen.getByText("💀 Game Over");
    expect(title).toHaveClass("text-red-500");
  });

  it("should have proper modal overlay styling", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("gameOver")) return "WIN";
      if (selector.toString().includes("score")) return 30;
      if (selector.toString().includes("gamesPlayed")) return 1;
      if (selector.toString().includes("resetGame")) return mockResetGame;
      if (selector.toString().includes("quitGame")) return mockQuitGame;
      return undefined;
    });

    render(<GameOverModal />);

    const overlay = document.querySelector(".absolute.inset-0");
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass("bg-black/70");
  });

  it("should have proper button styling", () => {
    mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
      if (selector.toString().includes("gameOver")) return "WIN";
      if (selector.toString().includes("score")) return 30;
      if (selector.toString().includes("gamesPlayed")) return 1;
      if (selector.toString().includes("resetGame")) return mockResetGame;
      if (selector.toString().includes("quitGame")) return mockQuitGame;
      return undefined;
    });

    render(<GameOverModal />);

    const newGameButton = screen.getByRole("button", { name: "New Game" });
    const quitButton = screen.getByRole("button", { name: "Quit" });

    expect(newGameButton).toHaveClass("bg-lime-500", "text-black");
    expect(quitButton).toHaveClass("bg-slate-600");
  });

  it("should display correct score and games played", () => {
    const testCases = [
      { score: 0, gamesPlayed: 0, expectedDisplay: 1 },
      { score: 15, gamesPlayed: 5, expectedDisplay: 6 },
      { score: 30, gamesPlayed: 10, expectedDisplay: 11 },
    ];

    testCases.forEach(({ score, gamesPlayed, expectedDisplay }) => {
      mockUseGameStore.mockImplementation((selector: SelectorFunction) => {
        if (selector.toString().includes("gameOver")) return "WIN";
        if (selector.toString().includes("score")) return score;
        if (selector.toString().includes("gamesPlayed")) return gamesPlayed;
        if (selector.toString().includes("resetGame")) return mockResetGame;
        if (selector.toString().includes("quitGame")) return mockQuitGame;
        return undefined;
      });

      render(<GameOverModal />);

      expect(screen.getByText(`Final Score: ${score}`)).toBeInTheDocument();
      expect(
        screen.getByText(`Games played: ${expectedDisplay}`),
      ).toBeInTheDocument();
    });
  });
});
