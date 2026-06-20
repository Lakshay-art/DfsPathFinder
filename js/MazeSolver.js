import { CELL } from "./MazeModel.js";

const DIRECTIONS = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

export class MazeSolver {
  solve(maze) {
    const grid = maze.cloneGrid();
    const steps = [];
    const solved = this.#backtrack(
      grid,
      maze.source.row,
      maze.source.col,
      maze.destination,
      steps,
    );

    return { solved, steps };
  }

  #backtrack(grid, row, col, destination, steps) {
    if (!this.#isValidMove(grid, row, col)) {
      return false;
    }

    steps.push({ row, col, action: "move" });

    if (row === destination.row && col === destination.col) {
      return true;
    }

    grid[row][col] = CELL.VISITED;

    for (const dir of DIRECTIONS) {
      const nextRow = row + dir.row;
      const nextCol = col + dir.col;

      if (this.#backtrack(grid, nextRow, nextCol, destination, steps)) {
        return true;
      }
    }

    steps.push({ row, col, action: "backtrack" });
    return false;
  }

  #isValidMove(grid, row, col) {
    const rows = grid.length;
    const cols = grid[0].length;

    return (
      row >= 0 &&
      row < rows &&
      col >= 0 &&
      col < cols &&
      grid[row][col] === CELL.OPEN
    );
  }
}
