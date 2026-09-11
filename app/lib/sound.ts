"use client";

/**
 * BoulotMan Signature Sound Engine
 * Option 1: Modern Soft Double-Chime (D5 -> A5 ascending chime)
 * Works flawlessly across browser tab lifecycles and background polling.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      // Pre-warm audio element
      try {
        this.audioEl = new Audio("/sounds/boulotman_chime.wav");
        this.audioEl.preload = "auto";
      } catch {}

      // Auto-unlock on first user interaction
      const unlockAudio = () => {
        this.unlock();
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("pointerdown", unlockAudio);
      };

      window.addEventListener("click", unlockAudio, { passive: true });
      window.addEventListener("keydown", unlockAudio, { passive: true });
      window.addEventListener("touchstart", unlockAudio, { passive: true });
      window.addEventListener("pointerdown", unlockAudio, { passive: true });
    }
  }

  public unlock() {
    if (this.isUnlocked) return;
    try {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume().then(() => {
          this.isUnlocked = true;
        }).catch(() => {});
      } else if (ctx) {
        this.isUnlocked = true;
      }
    } catch {}
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Option 1: Signature Modern Soft Double-Chime (D5 -> A5)
   * Plays when a new message, task bid, or notification arrives.
   */
  playNotificationSound() {
    try {
      const ctx = this.getAudioContext();

      // If AudioContext is ready and running, use high-fidelity synthesis
      if (ctx && ctx.state === "running") {
        this.synthesizeChime(ctx);
        return;
      }

      // If AudioContext is suspended, attempt to resume it or use audio element
      if (ctx && ctx.state === "suspended") {
        ctx.resume().then(() => {
          this.synthesizeChime(ctx);
        }).catch(() => {
          this.playAudioElementFallback();
        });
        return;
      }

      // Fallback to HTML5 audio element
      this.playAudioElementFallback();
    } catch {
      this.playAudioElementFallback();
    }
  }

  private synthesizeChime(ctx: AudioContext) {
    try {
      const now = ctx.currentTime;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.32, now);
      masterGain.connect(ctx.destination);

      // Tone 1: 587.33 Hz (D5) - Soft introductory chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.7, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.24);

      // Tone 2: 880 Hz (A5) with octave harmonic - Crisp pleasant finish
      const osc2 = ctx.createOscillator();
      const osc2Harmonic = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880.0, now + 0.09);

      osc2Harmonic.type = "triangle";
      osc2Harmonic.frequency.setValueAtTime(1760.0, now + 0.09);

      gain2.gain.setValueAtTime(0, now + 0.09);
      gain2.gain.linearRampToValueAtTime(0.85, now + 0.105);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

      osc2.connect(gain2);
      osc2Harmonic.connect(gain2);
      gain2.connect(masterGain);

      osc2.start(now + 0.09);
      osc2Harmonic.start(now + 0.09);
      osc2.stop(now + 0.52);
      osc2Harmonic.stop(now + 0.52);
    } catch {
      this.playAudioElementFallback();
    }
  }

  private playAudioElementFallback() {
    try {
      const audio = new Audio("/sounds/boulotman_chime.wav");
      audio.volume = 0.7;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch {}
  }

  /**
   * Outgoing Message Sent: Subtle 0.08s soft pop
   */
  playMessageSentSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || ctx.state !== "running") return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Action Completed / Payment Successful: Warm ascending triad
   */
  playSuccessSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || ctx.state !== "running") return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.07 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch {}
  }
}

export const sound = new SoundEngine();
