// Minimal speech utils using Web Speech API and speechSynthesis
export function startRecognition(onResult = () => {}, lang = 'en-IN') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    console.warn('SpeechRecognition not supported in this browser')
    return { stop: () => {} }
  }
  const recog = new SpeechRecognition()
  recog.lang = lang
  recog.interimResults = false
  recog.maxAlternatives = 1
  recog.onresult = (ev) => {
    const text = ev.results[0][0].transcript
    onResult(text)
  }
  recog.onerror = (e) => console.warn('SpeechRecognition error', e)
  recog.start()
  return { stop: () => { try { recog.stop() } catch(e){} } }
}

export function speak(text, lang = 'en-IN') {
  if (!('speechSynthesis' in window)) {
    console.warn('speechSynthesis not supported')
    return
  }
  const u = new SpeechSynthesisUtterance(String(text))
  u.lang = lang
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}
