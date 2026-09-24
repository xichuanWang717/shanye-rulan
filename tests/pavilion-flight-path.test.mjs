import assert from 'node:assert/strict';
import test from 'node:test';

import {getPavilionBirdPosition, PAVILION_FLIGHT_ORIGIN_X} from '../pavilion-flight-path.js';

test('the flock emerges beside the pavilion instead of inside the left mountain', () => {
  for (let index = 0; index < 48; index += 1) {
    const bird = getPavilionBirdPosition(0, index);
    assert.ok(
      Math.abs(bird.x - PAVILION_FLIGHT_ORIGIN_X) < 1,
      `bird ${index} starts too far from the pavilion: x=${bird.x}`,
    );
    assert.ok(bird.z <= -10, `bird ${index} starts in front of the mountain line: z=${bird.z}`);
  }
});

test('the flock climbs through the open right-hand corridor', () => {
  for (const flightTime of [0.5, 1, 2, 3, 5, 7.5]) {
    for (let index = 0; index < 48; index += 1) {
      const delay = (index % 8) * 0.12;
      if (flightTime < delay) continue;
      const bird = getPavilionBirdPosition(flightTime - delay, index);
      assert.ok(bird.x > 2.4, `bird ${index} crosses the left mountain at t=${flightTime}: x=${bird.x}`);
      assert.ok(bird.z <= -10, `bird ${index} flies through foreground terrain at t=${flightTime}: z=${bird.z}`);
    }
  }
});
