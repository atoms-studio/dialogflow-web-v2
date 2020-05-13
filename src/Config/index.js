export default {
    endpoint: 'http://localhost', // <- enter your gateway URL here
    // endpoint: 'https://chatbot-das-dev.demomwd.it', // <- enter your gateway URL here
    muted: true, // <- mute microphone at start
    start_suggestions: ['ciao'], // <- array of suggestions, displayed at the start screen
    fallback_lang: 'it', // <- fallback language code, if history mode or network is unavailable
    voice: 'native' // <- voice of Text-To-Speech; for reference, see: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/voiceURI
}