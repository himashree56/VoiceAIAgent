import * as speechRecognition from "./SpeechRecognition.js";
import * as speechSynthesis from "./SpeechSynthesis.js";
import * as ui from "./ui.js";

let recognizer = null;
let isListening = false;
let finalTranscript = "";
let currentInterim = "";

function initialize() {
    if (!speechRecognition.isSpeechRecognitionSupported()) {
        ui.setStatus("❌ Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
        return;
    }
    if (!speechSynthesis.isSpeechSynthesisSupported()) {
        ui.setStatus("❌ Speech Synthesis is not supported by this browser.");
        return;
    }

    recognizer = speechRecognition.createRecognizer();
    setupRecognizerEvents();
    ui.getListenButton().addEventListener("click", handleListenButton);
    ui.setStatus("✅ Ready — click the button to start listening.");
}

function handleListenButton() {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
}

function startListening() {
    finalTranscript = "";
    currentInterim = "";
    ui.setTranscript("");
    ui.setResponse("");
    ui.setListeningstate(true);
    ui.setStatus("🎙️ Listening... Speak now.");
    
    try {
        speechRecognition.startRecognition(recognizer);
        isListening = true;
    } catch (err) {
        console.error("Start recognition error:", err);
        isListening = false;
        ui.setListeningstate(false);
        ui.setStatus(`❌ Failed to access microphone: ${err.message}`);
    }
}

function stopListening() {
    isListening = false;
    ui.setListeningstate(false);
    ui.setStatus("⏳ Processing...");
    speechRecognition.stopRecognition(recognizer);
}

function setupRecognizerEvents() {
    recognizer.onspeechstart = () => {
        ui.setStatus("🎙️ Voice detected, listening...");
    };

    recognizer.onresult = (event) => {
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalTranscript += transcript + " ";
            } else {
                interim += transcript;
            }
        }

        currentInterim = interim;
        const fullText = (finalTranscript + interim).trim();
        ui.setTranscript(fullText || "Listening...");
    };

    recognizer.onend = () => {
        if (isListening) {
            try {
                speechRecognition.startRecognition(recognizer);
            } catch (err) {
                console.warn("Could not restart recognizer:", err);
            }
        } else {
            handleFinalTranscript();
        }
    };

    recognizer.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        isListening = false;
        ui.setListeningstate(false);

        let errorMessage = `❌ Error: ${event.error}. Please try again.`;
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            errorMessage = "❌ Mic blocked! Allow microphone access in your browser settings or URL bar.";
        } else if (event.error === "no-speech") {
            errorMessage = "⚠️ No speech heard. Speak closer to the microphone and try again.";
        } else if (event.error === "audio-capture") {
            errorMessage = "❌ No microphone detected. Please plug in or enable your microphone in Windows.";
        } else if (event.error === "network") {
            errorMessage = "❌ Network error. Speech recognition requires internet connection to reach speech servers.";
        }

        ui.setStatus(errorMessage);
    };
}

function handleFinalTranscript() {
    const text = (finalTranscript + " " + currentInterim).trim();

    if (!text) {
        ui.setStatus("⚠️ No speech detected. Try again.");
        return;
    }

    ui.setTranscript(text);
    ui.setStatus("🗣️ Speaking response...");
    const response = generateResponse(text);
    ui.setResponse(response);
    speechSynthesis.speak(response);

    setTimeout(() => {
        ui.setStatus("✅ Done — click the button to listen again.");
    }, 1500);
}

function generateResponse(userText) {
    return `You said: "${userText}". This is where an AI response would go.`;
}

initialize();
