import { MazeModel } from './MazeModel.js';
import { MazeSolver } from './MazeSolver.js';
import { MazeRenderer } from './MazeRenderer.js';
import { MazeAnimator } from './MazeAnimator.js';
import { Toast } from './Toast.js';

export class MazeController {
  constructor(elements) {
    this.elements = elements;
    this.solver = new MazeSolver();
    this.renderer = new MazeRenderer(elements.mazeContainer);
    this.animator = new MazeAnimator(this.renderer);
    this.toast = new Toast(elements.toastContainer);
    this.maze = null;
    this.solved = false;

    this.#bindEvents();
    this.#setupAnimatorCallbacks();
    this.generateMaze();
  }

  generateMaze() {
    const size = this.#readInput('size', 5, 3, 15);
    const blocked = this.#readInput('blocked', 0, 0);

    this.maze = new MazeModel(size, size, blocked);
    this.renderer.render(this.maze);
    this.animator.reset();
    this.solved = false;
    this.#setButtonStates({ start: true, pause: false, restart: false });
  }

  start() {
    if (this.animator.isRunning && this.animator.isPaused) {
      this.animator.resume();
      this.toast.show('Resumed!', 'info');
      this.#setButtonStates({ start: false, pause: true, restart: true });
      return;
    }

    const result = this.solver.solve(this.maze);

    if (!result.solved) {
      this.toast.show('No path found! Try generating a new maze.', 'error');
      return;
    }

    this.renderer.resetVisuals(this.maze);
    this.animator.load(result.steps);
    this.solved = true;
    this.animator.start();
    this.#setButtonStates({ start: false, pause: true, restart: true });
  }

  pause() {
    this.animator.pause();
    this.toast.show('Paused. Press Start or Space to resume.', 'info');
    this.#setButtonStates({ start: true, pause: false, restart: true });
  }

  restart() {
    this.animator.reset();
    this.renderer.resetVisuals(this.maze);
    this.#setButtonStates({ start: true, pause: false, restart: false });
  }

  #bindEvents() {
    const { generateBtn, startBtn, pauseBtn, restartBtn } = this.elements;

    generateBtn.addEventListener('click', () => this.generateMaze());
    startBtn.addEventListener('click', () => this.start());
    pauseBtn.addEventListener('click', () => this.pause());
    restartBtn.addEventListener('click', () => this.restart());

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.animator.isRunning) {
          this.animator.isPaused ? this.start() : this.pause();
        } else if (!this.elements.startBtn.disabled) {
          this.start();
        }
      }
    });
  }

  #setupAnimatorCallbacks() {
    this.animator.onComplete = () => {
      const { row, col } = this.maze.destination;
      this.renderer.showVictoryFlag(row, col);
      this.toast.show('🎉 Victory! The rat reached the destination!', 'success', 4000);
      this.#setButtonStates({ start: false, pause: false, restart: true });
    };

    this.animator.onFail = () => {
      this.toast.show('No path found!', 'error');
      this.#setButtonStates({ start: true, pause: false, restart: true });
    };
  }

  #readInput(id, fallback, min = 0, max = Infinity) {
    const el = document.getElementById(id);
    let value = parseInt(el.value, 10);
    if (isNaN(value)) value = fallback;
    value = Math.max(min, Math.min(max, value));
    el.value = value;
    return value;
  }

  #setButtonStates({ start, pause, restart }) {
    this.elements.startBtn.disabled = !start;
    this.elements.pauseBtn.disabled = !pause;
    this.elements.restartBtn.disabled = !restart;
  }

}
