import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TtsService {
    private synth: SpeechSynthesis;
    private readonly voice: SpeechSynthesisVoice;

    constructor() {
        this.synth = window.speechSynthesis;
        const voices = this.synth.getVoices();
        this.voice = <SpeechSynthesisVoice>voices.find(voice => voice.lang === 'es-ES')
    }

    speak(text: string): void {
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;

        // Customize speech parameters
        utterance.pitch = 0.8; // 0 to 2, where 1 is normal pitch
        utterance.rate = 1.3;  // 0.1 to 10, where 1 is normal speed
        utterance.volume = 0.85; // 0 to 1, where 1 is full volume

        this.synth.speak(utterance);
    }
}
