/**
 * Audio instruction system for the assessment training
 */
import type { TrainingZone, AudioInstruction } from './assessmentTrainingTypes';

export class AudioInstructions {
  private isMuted: boolean = false;
  private speechSynthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
      this.loadVoices();
      
      // Listen for voice changes
      this.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }

  /**
   * Load available voices
   */
  private loadVoices(): void {
    if (this.speechSynthesis) {
      this.voices = this.speechSynthesis.getVoices();
    }
  }

  /**
   * Get the best matching voice for Russian language
   * @returns SpeechSynthesisVoice or null if not found
   */
  private getRussianVoice(): SpeechSynthesisVoice | null {
    // Try to find a Russian voice
    const russianVoices = this.voices.filter(voice => 
      voice.lang.startsWith('ru') || 
      voice.name.toLowerCase().includes('russian') ||
      voice.name.toLowerCase().includes('русский')
    );
    
    // Prefer a female voice if available
    const femaleVoice = russianVoices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('женский')
    );
    
    return femaleVoice || russianVoices[0] || null;
  }

  /**
   * Mute audio instructions
   */
  public mute(): void {
    this.isMuted = true;
    if (this.speechSynthesis && this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
  }

  /**
   * Unmute audio instructions
   */
  public unmute(): void {
    this.isMuted = false;
  }

  /**
   * Play an audio instruction
   * @param instructionType Type of instruction to play
   * @param zone Current zone (if applicable)
   * @param nextZone Next zone (if applicable)
   * @param seconds Seconds for countdown (if applicable)
   */
  public playInstruction(
    instructionType: AudioInstruction,
    zone?: TrainingZone,
    nextZone?: TrainingZone,
    seconds?: number
  ): void {
    if (this.isMuted || !this.speechSynthesis) {
      return;
    }

    let text = '';
    
    switch (instructionType) {
      case 'ZONE_START':
        if (zone) {
          const effortText = zone.targetEffort > 0 
            ? `${zone.targetEffort} процентов` 
            : `${zone.targetEffortRange?.min}-${zone.targetEffortRange?.max} процентов`;
          text = `Сейчас ${zone.name} зона. Бегите с усилием ${effortText}.`;
        }
        break;
        
      case 'ZONE_END_WARNING':
        if (zone && nextZone) {
          text = `Через 30 секунд завершается ${zone.name} зона, далее последует ${nextZone.name} зона.`;
        }
        break;
        
      case 'ZONE_COUNTDOWN':
        if (seconds !== undefined && seconds >= 0 && seconds <= 5) {
          if (seconds === 0) {
            text = 'Старт новой зоны!';
          } else {
            text = seconds.toString();
          }
        }
        break;
        
      case 'ERROR_NOTIFICATION':
        text = 'Произошла ошибка. Пожалуйста, проверьте подключение к датчику скорости.';
        break;
        
      case 'PAUSE_NOTIFICATION':
        text = 'Тренировка приостановлена.';
        break;
        
      case 'RESUME_NOTIFICATION':
        if (zone) {
          text = `Продолжаем тренировку. ${zone.name} зона.`;
        } else {
          text = 'Тренировка возобновлена.';
        }
        break;
    }
    
    if (text) {
      this.speak(text);
    }
  }

  /**
   * Speak the given text using speech synthesis
   * @param text Text to speak
   */
  private speak(text: string): void {
    if (!this.speechSynthesis) return;
    
    // Cancel any ongoing speech
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
    
    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    const voice = this.getRussianVoice();
    if (voice) {
      utterance.voice = voice;
    }
    
    // Set speech parameters
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Max volume
    
    // Speak
    this.speechSynthesis.speak(utterance);
  }

  /**
   * Play a sequence of instructions with delays
   * @param instructions Array of instructions to play
   */
  public playInstructionSequence(instructions: {
    type: AudioInstruction;
    zone?: TrainingZone;
    nextZone?: TrainingZone;
    seconds?: number;
    delay?: number;
  }[]): void {
    let delay = 0;
    
    instructions.forEach((instruction, index) => {
      delay += instruction.delay || 0;
      
      setTimeout(() => {
        this.playInstruction(
          instruction.type,
          instruction.zone,
          instruction.nextZone,
          instruction.seconds
        );
      }, delay);
    });
  }
}

// Export singleton instance
export const audioInstructions = new AudioInstructions();