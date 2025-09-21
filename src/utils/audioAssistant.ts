export class AudioAssistant {
  private speechSynthesis: SpeechSynthesis;
  private isSpeaking: boolean = false;
  private utteranceQueue: SpeechSynthesisUtterance[] = [];
  
  constructor() {
    this.speechSynthesis = window.speechSynthesis;
  }
  
  /**
   * Speak a message using the Web Speech API
   * @param text The text to speak
   * @param language The language code (default: 'ru-RU')
   * @param rate The speech rate (default: 1.0)
   * @param pitch The speech pitch (default: 1.0)
   */
  speak(text: string, language: string = 'ru-RU', rate: number = 1.0, pitch: number = 1.0): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if speech synthesis is supported
      if (!this.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;
      
      // Set up event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log('Audio assistant started speaking:', text);
      };
      
      utterance.onend = () => {
        this.isSpeaking = false;
        console.log('Audio assistant finished speaking:', text);
        resolve();
        
        // Process the next utterance in the queue if available
        if (this.utteranceQueue.length > 0) {
          const nextUtterance = this.utteranceQueue.shift();
          if (nextUtterance) {
            this.speechSynthesis.speak(nextUtterance);
          }
        }
      };
      
      utterance.onerror = (event) => {
        this.isSpeaking = false;
        console.error('Audio assistant error:', event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      // If already speaking, add to queue
      if (this.isSpeaking) {
        this.utteranceQueue.push(utterance);
      } else {
        // Speak immediately
        this.speechSynthesis.speak(utterance);
      }
    });
  }
  
  /**
   * Stop all speech
   */
  stop(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.utteranceQueue = [];
    }
  }
  
  /**
   * Pause speech
   */
  pause(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.pause();
    }
  }
  
  /**
   * Resume speech
   */
  resume(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.resume();
    }
  }
  
  /**
   * Check if the browser supports speech synthesis
   */
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
  
  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.speechSynthesis.getVoices();
  }
  
  /**
   * Find a voice by name
   * @param name The name of the voice to find
   */
  findVoiceByName(name: string): SpeechSynthesisVoice | undefined {
    return this.getVoices().find(voice => voice.name === name);
  }
  
  /**
   * Find a voice by language
   * @param language The language code
   */
  findVoiceByLanguage(language: string): SpeechSynthesisVoice | undefined {
    return this.getVoices().find(voice => voice.lang.startsWith(language));
  }
}

// Create a singleton instance
export const audioAssistant = new AudioAssistant();

