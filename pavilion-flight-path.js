export const PAVILION_FLIGHT_ORIGIN_X = 3.8;

export function getPavilionBirdPosition(rise, index) {
  const spread = Math.min(1, Math.max(0, rise) / 3);
  const offset = index * 0.42;
  const lane = (index % 7 - 3) * 0.45;

  return {
    x: PAVILION_FLIGHT_ORIGIN_X
      + spread * 6
      + Math.sin(rise * 0.55 + offset) * (0.65 + spread * 2)
      + lane * spread,
    y: 2.4 + rise * 1.25 + rise * rise * 0.11 + (index % 5) * 0.48,
    z: -14 + (index % 6) * 0.65 - rise * (0.35 + (index % 3) * 0.05),
  };
}
