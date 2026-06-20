import { MazeController } from './MazeController.js';

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    mazeContainer: document.getElementById('mazeContainer'),
    generateBtn: document.getElementById('generateBtn'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    restartBtn: document.getElementById('restartBtn'),
    toastContainer: document.getElementById('toastContainer'),
  };

  new MazeController(elements);
});
