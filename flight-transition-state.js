const clamp = value => Math.max(0, Math.min(1, value));

export const PAVILION_FLIGHT_DURATION = 6.8;
export const REDUCED_PAVILION_FLIGHT_DURATION = 0.5;
export const PAVILION_PARTICLE_START = 3.6;

export function arePavilionBirdsVisible(time, reduced) {
  return reduced ? false : time < PAVILION_PARTICLE_START;
}

export function isPavilionFlightComplete(time, reduced) {
  return time > (reduced ? REDUCED_PAVILION_FLIGHT_DURATION : PAVILION_FLIGHT_DURATION);
}

export function getFlightTransitionFrame(time, active, reduced) {
  if (!active) return {visible: false, phase: 'hidden', gather: 0, veil: 0};
  if (reduced) return {visible: true, phase: 'still-cloth', gather: 1, veil: 0};

  const elapsed = Math.max(0, time);
  if (elapsed < PAVILION_PARTICLE_START) {
    return {visible: false, phase: 'birds', gather: 0, veil: 0};
  }
  const gather = clamp((elapsed - PAVILION_PARTICLE_START) / 2.4);
  const veil = clamp((elapsed - 6) / 0.8);
  const phase = veil > 0 ? 'fade' : 'particles';
  return {visible: true, phase, gather, veil};
}
