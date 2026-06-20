const RAT_IMAGE = 'assets/rat.png';
const FLAG_IMAGE = 'assets/flag.png';

export class MazeRenderer {
  constructor(container) {
    this.container = container;
  }

  render(maze) {
    this.container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'maze-grid';
    grid.style.gridTemplateColumns = `repeat(${maze.cols}, 1fr)`;

    for (let row = 0; row < maze.rows; row++) {
      for (let col = 0; col < maze.cols; col++) {
        grid.appendChild(this.#createCell(maze, row, col));
      }
    }

    this.container.appendChild(grid);
    this.gridEl = grid;
  }

  #createCell(maze, row, col) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = row;
    cell.dataset.col = col;

    if (maze.isWall(row, col)) {
      cell.classList.add('wall');
    } else if (row === maze.source.row && col === maze.source.col) {
      cell.classList.add('endpoint');
      cell.dataset.endpoint = 'source';
      cell.textContent = 'S';
    } else if (row === maze.destination.row && col === maze.destination.col) {
      cell.classList.add('endpoint');
      cell.dataset.endpoint = 'destination';
      cell.textContent = 'D';
    }

    return cell;
  }

  updateRatPosition(row, col) {
    this.#clearClass('rat');
    const cell = this.#getCell(row, col);
    if (cell) {
      cell.classList.add('rat');
      cell.textContent = '';

      const img = document.createElement('img');
      img.src = RAT_IMAGE;
      img.alt = 'Rat';
      img.className = 'rat-img';
      cell.appendChild(img);
    }
  }

  markPath(row, col) {
    const cell = this.#getCell(row, col);
    if (cell && !cell.classList.contains('endpoint')) {
      cell.classList.add('path');
      cell.textContent = '';
    }
  }

  markBacktrack(row, col) {
    const cell = this.#getCell(row, col);
    if (cell && !cell.classList.contains('endpoint')) {
      cell.classList.remove('path');
      cell.classList.add('backtrack');
      cell.textContent = '';
    }
  }

  resetVisuals(maze) {
    this.render(maze);
  }

  showVictoryFlag(row, col) {
    const cell = this.#getCell(row, col);
    if (!cell || cell.querySelector('.victory-flag')) return;

    cell.classList.add('victory');

    const img = document.createElement('img');
    img.src = FLAG_IMAGE;
    img.alt = 'Victory flag';
    img.className = 'victory-flag';
    cell.appendChild(img);
  }

  #getCell(row, col) {
    return this.gridEl?.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  }

  #clearClass(className) {
    this.gridEl?.querySelectorAll(`.${className}`).forEach((el) => {
      el.classList.remove(className);
      if (className === 'rat') {
        el.querySelector('.rat-img')?.remove();
        if (el.dataset.endpoint === 'source') el.textContent = 'S';
        else if (el.dataset.endpoint === 'destination') el.textContent = 'D';
        else el.textContent = '';
      }
    });
  }
}
