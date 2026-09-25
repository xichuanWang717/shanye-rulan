import assert from 'node:assert/strict';
import test from 'node:test';

import * as THREE from '../three.module.js';
import * as flightPath from '../pavilion-flight-path.js';
const transition = await import('../flight-transition-state.js').catch(() => ({}));

test('the camera keeps the pavilion flock centered as it follows the open sky corridor', () => {
  assert.equal(typeof flightPath.getPavilionFlockFocus, 'function');
  assert.equal(typeof flightPath.aimPavilionCamera, 'function');

  const camera = new THREE.PerspectiveCamera(43, 16 / 9, 0.1, 160);
  camera.position.set(0, 6.5, 18);

  const openingFocus = flightPath.aimPavilionCamera(camera, 0, false);
  assert.ok(openingFocus.x > 3.5 && openingFocus.x < 4);
  camera.updateMatrixWorld(true);
  const openingProjection = new THREE.Vector3(
    openingFocus.x,
    openingFocus.y,
    openingFocus.z,
  ).project(camera);
  assert.ok(Math.abs(openingProjection.x) < 1e-6);
  assert.ok(Math.abs(openingProjection.y) < 1e-6);

  const risingFocus = flightPath.aimPavilionCamera(camera, 3, false);
  assert.ok(risingFocus.x > 8.5 && risingFocus.x < 10.5);
  camera.updateMatrixWorld(true);
  const risingProjection = new THREE.Vector3(
    risingFocus.x,
    risingFocus.y,
    risingFocus.z,
  ).project(camera);
  assert.ok(Math.abs(risingProjection.x) < 1e-6);
  assert.ok(Math.abs(risingProjection.y) < 1e-6);
});

test('birds finish before any particle appears, then the original motif assembles', () => {
  assert.equal(typeof transition.getFlightTransitionFrame, 'function');
  assert.deepEqual(transition.getFlightTransitionFrame(1, true, false), {
    visible: false,
    phase: 'birds',
    gather: 0,
    veil: 0,
  });
  assert.equal(transition.getFlightTransitionFrame(3.59, true, false).phase, 'birds');
  const gathering = transition.getFlightTransitionFrame(4.8, true, false);
  assert.equal(gathering.visible, true);
  assert.equal(gathering.phase, 'particles');
  assert.ok(gathering.gather > 0 && gathering.gather < 1);
  assert.equal(gathering.veil, 0);
  const later = transition.getFlightTransitionFrame(5.25, true, false);
  assert.equal(later.phase, 'particles');
  assert.ok(later.gather > gathering.gather);
  assert.equal(later.veil, 0);
  const fading = transition.getFlightTransitionFrame(6.4, true, false);
  assert.equal(fading.visible, true);
  assert.equal(fading.phase, 'fade');
  assert.equal(fading.gather, 1);
  assert.ok(Math.abs(fading.veil - 0.5) < 1e-12);
});

test('visible birds and visible particles never overlap', () => {
  assert.equal(typeof transition.arePavilionBirdsVisible, 'function');
  for (const time of [0, 1, 2.4, 3.59, 3.6, 4.8, 6.4]) {
    const frame = transition.getFlightTransitionFrame(time, true, false);
    assert.equal(transition.arePavilionBirdsVisible(time, false) && frame.visible, false, `overlap at ${time}`);
  }
  assert.equal(transition.arePavilionBirdsVisible(3.59, false), true);
  assert.equal(transition.arePavilionBirdsVisible(3.6, false), false);
});

test('reduced-motion flight keeps a still cloth cue instead of hiding the transition', () => {
  assert.equal(typeof transition.getFlightTransitionFrame, 'function');
  assert.deepEqual(transition.getFlightTransitionFrame(0.25, true, true), {
    visible: true,
    phase: 'still-cloth',
    gather: 1,
    veil: 0,
  });
  assert.deepEqual(transition.getFlightTransitionFrame(0.25, false, true), {
    visible: false,
    phase: 'hidden',
    gather: 0,
    veil: 0,
  });
});

test('flight duration matches the transition and reduced mode completes promptly', () => {
  assert.equal(typeof transition.isPavilionFlightComplete, 'function');
  assert.equal(transition.isPavilionFlightComplete(6.8, false), false);
  assert.equal(transition.isPavilionFlightComplete(6.81, false), true);
  assert.equal(transition.isPavilionFlightComplete(0.5, true), false);
  assert.equal(transition.isPavilionFlightComplete(0.51, true), true);
});
