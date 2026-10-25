/*
isSpeechSynthesisSupported()
        ↓
Can this browser use text-to-speech?


getEnglishVoice()
        ↓
Which English voice should we use?


speak(text)
        ↓
Prepare the text for speech
        ↓
Choose the voice
        ↓
Configure pitch / rate / volume
        ↓
Speak the text 🔊
*/
export function isSpeechSynthesisSupported() {
    return 'speechSynthesis' in window;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

export function getEnglishVoices() {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(
        voice => voice.lang.startsWith('en')
    );
}

export function speak(text) {
    if (!isSpeechSynthesisSupported()) {
        throw new Error(
            'Speech Synthesis not supported'
        );
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getEnglishVoices();

    if (voice) {
        utterance.voice = voice;
    }

    utterance.pitch = 1.3;
    utterance.rate = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
}