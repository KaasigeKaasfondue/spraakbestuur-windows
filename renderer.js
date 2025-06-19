const { ipcRenderer } = require('electron')

let recognition = null
let isListening = false
let recentCommands = []

const micButton = document.getElementById('mic-button')
const micStatus = document.getElementById('mic-status')
const status = document.getElementById('status')
const transcript = document.getElementById('transcript')
const recentList = document.getElementById('recent-list')
const errorModal = document.getElementById('error-modal')
const errorMessage = document.getElementById('error-message')
const heardText = document.getElementById('heard-text')
const manualInput = document.getElementById('manual-input')
const tryManualBtn = document.getElementById('try-manual')
const cancelModalBtn = document.getElementById('cancel-modal')

function initSpeechRecognition() {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition()
  } else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition()
  } else {
    status.textContent = 'Spraakherkenning wordt niet ondersteund in deze browser'
    return false
  }

  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = 'nl-NL'

  recognition.onstart = () => {
    isListening = true
    micButton.classList.add('active')
    micStatus.textContent = 'Luisteren...'
    status.textContent = 'Luisteren naar uw commando...'
    transcript.textContent = ''
    transcript.classList.add('listening')
  }

  recognition.onresult = (event) => {
    let finalTranscript = ''
    let interimTranscript = ''

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptPart = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcriptPart
      } else {
        interimTranscript += transcriptPart
      }
    }

    transcript.textContent = finalTranscript + interimTranscript

    if (finalTranscript) {
      processCommand(finalTranscript.trim())
    }
  }

  recognition.onerror = (event) => {
    console.error('Spraakherkenning fout:', event.error)
    stopListening()
    status.textContent = 'Fout bij spraakherkenning. Probeer opnieuw.'
    transcript.classList.add('error')
  }

  recognition.onend = () => {
    stopListening()
  }

  return true
}

function startListening() {
  if (recognition && !isListening) {
    try {
      recognition.start()
    } catch (error) {
      console.error('Kan spraakherkenning niet starten:', error)
      status.textContent = 'Kan spraakherkenning niet starten'
    }
  }
}

function stopListening() {
  isListening = false
  micButton.classList.remove('active')
  micStatus.textContent = 'Niet actief'
  transcript.classList.remove('listening')
  
  if (recognition) {
    recognition.stop()
  }
}

async function processCommand(command) {
  const cleanCommand = command.toLowerCase().trim()
  
  status.textContent = `Probeer "${cleanCommand}" te openen...`
  transcript.classList.remove('listening', 'error')
  transcript.classList.add('success')
  
  addToRecentCommands(cleanCommand)
  
  try {
    const result = await ipcRenderer.invoke('open-app', cleanCommand)
    
    if (result.success) {
      status.textContent = `"${cleanCommand}" succesvol geopend!`
      setTimeout(() => {
        status.textContent = 'Klik op de microfoon om te beginnen'
        transcript.textContent = ''
        transcript.classList.remove('success')
      }, 2000)
    } else {
      showErrorModal(result.error, cleanCommand)
    }
  } catch (error) {
    console.error('Fout bij openen app:', error)
    showErrorModal('Er is een fout opgetreden', cleanCommand)
  }
}

function showErrorModal(message, heard) {
  errorMessage.textContent = message
  heardText.textContent = heard
  manualInput.value = ''
  errorModal.classList.remove('hidden')
  manualInput.focus()
  
  status.textContent = 'App niet gevonden'
  transcript.classList.remove('success', 'listening')
  transcript.classList.add('error')
}

function hideErrorModal() {
  errorModal.classList.add('hidden')
  status.textContent = 'Klik op de microfoon om te beginnen'
  transcript.textContent = ''
  transcript.classList.remove('error')
}

function addToRecentCommands(command) {
  if (!recentCommands.includes(command)) {
    recentCommands.unshift(command)
    if (recentCommands.length > 5) {
      recentCommands.pop()
    }
    updateRecentList()
  }
}

function updateRecentList() {
  if (recentCommands.length === 0) {
    recentList.textContent = 'Nog geen commando\'s gebruikt'
  } else {
    recentList.innerHTML = recentCommands.map(cmd => 
      `<span class="recent-item">${cmd}</span>`
    ).join(', ')
  }
}

micButton.addEventListener('click', () => {
  if (isListening) {
    stopListening()
  } else {
    startListening()
  }
})

tryManualBtn.addEventListener('click', async () => {
  const manualCommand = manualInput.value.trim()
  if (manualCommand) {
    hideErrorModal()
    await processCommand(manualCommand)
  }
})

cancelModalBtn.addEventListener('click', () => {
  hideErrorModal()
})

manualInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    tryManualBtn.click()
  }
})

document.querySelectorAll('.suggestion').forEach(suggestion => {
  suggestion.addEventListener('click', async () => {
    const command = suggestion.textContent.trim()
    await processCommand(command)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  if (initSpeechRecognition()) {
    status.textContent = 'Klik op de microfoon om te beginnen'
  }
  updateRecentList()
})

