const MOVE_DELAY_MS = 20;

export class MazeAnimator {
  constructor(renderer) {
    this.renderer = renderer;
    this.steps = [];
    this.currentIndex = 0;
    this.isPaused = false;
    this.isRunning = false;
    this.timerId = null;
    this.onComplete = null;
    this.onFail = null;
  }

  load(steps) {
    this.steps = steps;
    this.currentIndex = 0;
    this.isPaused = false;
    this.isRunning = false;
    this.#clearTimer();
  }

  start() {
    if (this.steps.length === 0) return;

    this.isRunning = true;
    this.isPaused = false;
    this.#scheduleNext();
  }

  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    this.#clearTimer();
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    this.#scheduleNext();
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  reset() {
    this.#clearTimer();
    this.currentIndex = 0;
    this.isPaused = false;
    this.isRunning = false;
  }

  #scheduleNext() {
    this.#clearTimer();
    this.timerId = setTimeout(() => this.#processStep(), MOVE_DELAY_MS);
  }

  #processStep() {
    if (this.isPaused || this.currentIndex >= this.steps.length) return;

    const step = this.steps[this.currentIndex];
    const { row, col, action } = step;

    if (action === "move") {
      this.renderer.markPath(row, col);
      this.renderer.updateRatPosition(row, col);
    } else {
      this.renderer.markBacktrack(row, col);
      this.renderer.updateRatPosition(row, col);
    }

    this.currentIndex++;

    if (this.currentIndex >= this.steps.length) {
      this.isRunning = false;
      const lastStep = this.steps[this.steps.length - 1];
      if (lastStep.action === "move") {
        this.onComplete?.();
      } else {
        this.onFail?.();
      }
      return;
    }

    this.#scheduleNext();
  }

  #clearTimer() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
