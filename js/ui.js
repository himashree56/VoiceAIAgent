/*
<p id="status">
            Ready to listen...
        </p>
        <div id="transcript">
            Your text will appear here..
        </div>
        <button id="ListenButton">
            Start Listening
        </button>
        <div id="response"></div>
        */

const statusElement = document.getElementById("status");
const transcriptElement = document.getElementById("transcript");
const responseElement = document.getElementById("response");
const listenButtonElement = document.getElementById("ListenButton");

export function setStatus(message) {
    statusElement.textContent = message;
}

export function setTranscript(text) {
    transcriptElement.textContent = text;
}

export function setResponse(text) {
    responseElement.textContent = text;
}

export function setListeningstate(isListening) {
    listenButtonElement.textContent = isListening ? "🛑 Stop Listening" : "🎙️ Start Listening";
    listenButtonElement.classList.toggle("listening", isListening);
}

export function getListenButton() {
    return listenButtonElement;
}