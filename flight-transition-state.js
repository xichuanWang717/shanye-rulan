const clamp = value => Math.max(0, Math.min(1, value));

export const PAVILION_FLIGHT_DURATION = 6.8;
export const REDUCED_PAVILION_FLIGHT_DURATION = 0.5;

export function isPavilionFlightComplete(time, reduced) {
  return time > (reduced ? REDUCED_PAVILION_FLIGHT_DURATION : PAVILION_FLIGHT_DURATION);
}

export function getFlightTransitionFrame(time, active, reduced) {
  if (!active) return {visible: false, phase: 'hidden', gather: 0, veil: 0};
  if (reduced) return {visible: true, phase: 'still-cloth', gather: 1, veil: 0};

  const elapsed = Math.max(0, time);
  const gather = clamp((elapsed - 2.4) / 2.1);
  const veil = clamp((elapsed - 6) / 0.8);
  const phase = veil > 0 ? 'fade' : gather >= 1 ? 'cloth' : gather > 0 ? 'gather' : 'wind';
  return {visible: true, phase, gather, veil};
}
