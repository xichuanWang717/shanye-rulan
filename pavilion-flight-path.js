export const PAVILION_FLIGHT_ORIGIN_X = 3.8;

export function getPavilionBirdPosition(rise, index) {
  const flockTime = rise + (index % 8) * 0.12;
  const gather = Math.min(1, Math.max(0, (flockTime - 2.3) / 1.2));
  const courseTime = rise + (index % 8) * 0.12 * gather;
  const spread = Math.min(1, Math.max(0, courseTime) / 3);
  const wingSpace = 1 - gather * 0.85;
  const offset = index * 0.42;
  const lane = (index % 7 - 3) * 0.45;

  return {
    x: PAVILION_FLIGHT_ORIGIN_X
      + spread * 6
      + (Math.sin(rise * 0.55 + offset) * (0.65 + spread * 2)
      + lane * spread) * wingSpace,
    y: 2.4 + courseTime * 1.25 + courseTime * courseTime * 0.11 + (index % 5) * 0.48 * wingSpace,
    z: -14 + (index % 6) * 0.65 - rise * (0.35 + (index % 3) * 0.05),
  };
}

export function getPavilionFlockFocus(flightTime) {
  let x = 0;
  let y = 0;
  let z = 0;
  let visibleCount = 0;

  for (let index = 0; index < 48; index += 1) {
    const delay = (index % 8) * 0.12;
    if (flightTime < delay) continue;
    const bird = getPavilionBirdPosition(Math.max(0, flightTime - delay), index);
    x += bird.x;
    y += bird.y;
    z += bird.z;
    visibleCount += 1;
  }

  return {
    x: x / visibleCount,
    y: y / visibleCount,
    z: z / visibleCount,
  };
}

export function aimPavilionCamera(camera, flightTime, reduced = false) {
  const focus = getPavilionFlockFocus(reduced ? 0 : flightTime);
  camera.position.x = focus.x;
  camera.lookAt(focus.x, focus.y, focus.z);
  return focus;
}
