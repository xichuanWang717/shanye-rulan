import {getFlightTransitionFrame} from './flight-transition-state.js?v=2';

// The flock disappears before the original square-particle batik reveal begins.
export function createFlightTransition() {
  const canvas = document.createElement('canvas');
  canvas.className = 'flight-wind';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  const motif = [];
  const pattern = new Image();
  pattern.onload = () => {
    const sample = document.createElement('canvas');
    sample.width = 180;
    sample.height = 110;
    const sc = sample.getContext('2d');
    sc.drawImage(pattern, 0, 0, 180, 110);
    const pixels = sc.getImageData(0, 0, 180, 110).data;
    for (let y = 0; y < 110; y += 2) {
      for (let x = 0; x < 180; x += 2) {
        const i = (y * 180 + x) * 4;
        if (Math.min(pixels[i], pixels[i + 1], pixels[i + 2]) > 160) {
          motif.push([x / 180, y / 110]);
        }
      }
    }
  };
  pattern.src = './老师指定蜡染-无圆形.png';

  function resize() {
    width = innerWidth;
    height = innerHeight;
    const ratio = Math.min(devicePixelRatio, 1.5);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  resize();
  addEventListener('resize', resize);

  return function update(time, active, reduced) {
    const frame = getFlightTransitionFrame(time, active, reduced);
    canvas.hidden = !frame.visible;
    if (canvas.hidden) return frame;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#071e31';
    ctx.fillRect(0, 0, width, height);
    drawMotif(frame.phase === 'still-cloth' ? 1 : frame.gather, time);
    return frame;
  };

  function drawMotif(gather, time) {
    const ease = gather * gather * (3 - 2 * gather);
    const cx = width * 0.5;
    const cy = height * 0.42;
    ctx.fillStyle = `rgba(241,232,206,${gather})`;
    motif.forEach(([u, v], i) => {
      const angle = i * 2.399963;
      const sx = cx + Math.cos(angle + time * 0.2) * width * 0.6;
      const sy = cy + Math.sin(angle) * height * 0.55;
      const x = sx * (1 - ease) + u * width * ease;
      const y = sy * (1 - ease) + v * height * ease;
      ctx.fillRect(x, y, Math.max(1, width / 250), Math.max(1, height / 170));
    });
  }
}
