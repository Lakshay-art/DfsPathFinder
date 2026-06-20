const CELL = {
  OPEN: 0,
  WALL: 1,
  VISITED: 2,
};

export class MazeModel {
  constructor(rows, cols, blockedCount) {
    this.rows = rows;
    this.cols = cols;
    this.source = { row: 0, col: 0 };
    this.destination = { row: rows - 1, col: cols - 1 };
    this.grid = this.#createGrid(blockedCount);
  }

  #createGrid(blockedCount) {
    const grid = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(CELL.OPEN)
    );

    this.#placeWalls(grid, blockedCount);
    grid[this.source.row][this.source.col] = CELL.OPEN;
    grid[this.destination.row][this.destination.col] = CELL.OPEN;

    return grid;
  }

  #placeWalls(grid, count) {
    const maxWalls = this.rows * this.cols - 2;
    const wallCount = Math.min(count, maxWalls);
    let placed = 0;

    while (placed < wallCount) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);

      if (this.#isFixedCell(row, col) || grid[row][col] === CELL.WALL) {
        continue;
      }

      grid[row][col] = CELL.WALL;
      placed++;
    }
  }

  #isFixedCell(row, col) {
    return (
      (row === this.source.row && col === this.source.col) ||
      (row === this.destination.row && col === this.destination.col)
    );
  }

  isWall(row, col) {
    return this.grid[row][col] === CELL.WALL;
  }

  isInBounds(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  cloneGrid() {
    return this.grid.map((row) => [...row]);
  }
}

export { CELL };
