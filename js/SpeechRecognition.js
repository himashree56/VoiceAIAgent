/*
isRecognitionSupported()
        ↓
Can this browser recognize speech?

createRecognizer()
        ↓
Create and configure the recognizer

startRecognition()
        ↓
Start microphone recognition

stopRecognition()
        ↓
Stop microphone recognition
*/
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
export function isSpeechRecognitionSupported() {
    return !!SpeechRecognition;
}

export function createRecognizer() {
    if (!isSpeechRecognitionSupported()) {
        return null;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = navigator.language || "en-US";

    return recognizer;
}
export function startRecognition(recognizer) {
    try {
        recognizer.start();
    } catch (e) {
        if (e.name !== "InvalidStateError") {
            throw e;
        }
    }
}
export function stopRecognition(recognizer) {
    try {
        recognizer.stop();
    } catch (e) {
        // Ignore if already stopped
    }
}