const { Model, KaldiRecognizer } = require('vosk')
const record = require('node-record-lpcm16')

const MODEL_PATH = './model'
const SAMPLE_RATE = 16000
let model
let recognizer
let recording

function startRecognition(win) {
  if (!model) {
    model = new Model(MODEL_PATH)
  }
  recognizer = new KaldiRecognizer(model, SAMPLE_RATE)
  recording = record.record({
    sampleRateHertz: SAMPLE_RATE,
    threshold: 0,
    verbose: false,
    recordProgram: 'sox',
    silence: '1.0'
  }).stream().on('data', data => {
    if (recognizer.acceptWaveform(data)) {
      const result = JSON.parse(recognizer.result())
      if (result.text) {
        win.webContents.send('transcriptie', result.text)
      }
    }
  }).on('end', () => {
    recognizer.free()
  })
}

function stopRecognition() {
  if (recording) {
    record.stop()
    recording = null
  }
}

module.exports = { startRecognition, stopRecognition }
