const { ipcRenderer } = require('electron');

const container   = document.getElementById('update-container');
const progressBar = document.getElementById('progressBar');
const progressTxt = document.getElementById('progressText');

ipcRenderer.on('download-progress', (_, percent) => {
  if (container.style.display === 'none') {
    container.style.display = 'block';
  }
  progressBar.value = percent;
  progressTxt.textContent = `${percent}%`;
  if (percent >= 100) {
    setTimeout(() => {
      container.style.display = 'none';
    }, 1500);
  }
});
