"use client";

/**
 * BoulotMan Signature Sound Engine
 * Provides instant, zero-latency notification and message audio tones.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Option 1: Signature Modern Soft Double-Chime (D5 -> A5)
   * Plays when a new message, task bid, or high-priority notification arrives.
   */
  playNotificationSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) {
        // Fallback to static audio file
        const audio = new Audio("/sounds/boulotman_chime.wav");
        audio.volume = 0.65;
        audio.play().catch(() => {});
        return;
      }

      const now = ctx.currentTime;

      // Master Gain for smooth volume control
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.28, now);
      masterGain.connect(ctx.destination);

      // Tone 1: 587.33 Hz (D5) - Soft introductory ping
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.7, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Tone 2: 880 Hz (A5) with octave harmonic - High, crisp pleasant chime
      const osc2 = ctx.createOscillator();
      const osc2Harmonic = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880.0, now + 0.08);

      osc2Harmonic.type = "triangle";
      osc2Harmonic.frequency.setValueAtTime(1760.0, now + 0.08);

      gain2.gain.setValueAtTime(0, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.85, now + 0.095);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      osc2.connect(gain2);
      osc2Harmonic.connect(gain2);
      gain2.connect(masterGain);

      osc2.start(now + 0.08);
      osc2Harmonic.start(now + 0.08);
      osc2.stop(now + 0.48);
      osc2Harmonic.stop(now + 0.48);
    } catch {
      // Audio playback silently guarded
    }
  }

  /**
   * Outgoing Message Sent: Subtle 0.08s soft pop
   */
  playMessageSentSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

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
      if (!ctx) return;

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
