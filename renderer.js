const { ipcRenderer } = require('electron')
const btn = document.getElementById('start-btn')
const status = document.getElementById('status')
const transcriptEl = document.getElementById('transcript')
const container = document.getElementById('update-container')
const progressBar = document.getElementById('progressBar')
const progressTxt = document.getElementById('progressText')
let isListening = false

btn.addEventListener('click', () => {
  if (!isListening) {
    ipcRenderer.send('start-transcriptie')
    transcriptEl.textContent = ''
    status.textContent = 'Luisteren…'
    btn.textContent = 'Stop'
    isListening = true
  } else {
    ipcRenderer.send('stop-transcriptie')
    status.textContent = 'Transcriptie gestopt'
    btn.textContent = 'Start Transcriptie'
    isListening = false
  }
})

ipcRenderer.on('transcriptie', (_, text) => {
  transcriptEl.textContent += text + '\n'
})

ipcRenderer.on('download-progress', (_, percent) => {
  container.style.display = 'flex'
  progressBar.value = percent
  progressTxt.textContent = `${percent}%`
  if (percent >= 100) {
    setTimeout(() => {
      container.style.display = 'none'
    }, 1500)
  }
})
