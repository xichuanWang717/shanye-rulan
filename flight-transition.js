import {getFlightTransitionFrame} from './flight-transition-state.js?v=1';

// Carry the flock into the exact batik pattern with a screen-space particle reveal.
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
    sample.height = Math.round(180 * pattern.naturalHeight / pattern.naturalWidth);
    const sampleContext = sample.getContext('2d');
    sampleContext.drawImage(pattern, 0, 0, sample.width, sample.height);
    const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;

    for (let y = 0; y < sample.height; y += 2) {
      for (let x = 0; x < sample.width; x += 2) {
        const pixel = (y * sample.width + x) * 4;
        if (Math.min(pixels[pixel], pixels[pixel + 1], pixels[pixel + 2]) > 160) {
          motif.push([x / sample.width, y / sample.height]);
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
    const centerX = width * 0.5;
    const centerY = height * 0.42;

    if (frame.phase === 'still-cloth') {
      ctx.fillStyle = 'rgba(7,30,49,.88)';
      ctx.fillRect(0, 0, width, height);
      drawCloth(ctx, pattern, width, height);
      return frame;
    }

    const power = Math.sin(Math.min(1, time / 6.8) * Math.PI);
    const spread = Math.min(1, Math.max(0, time / 2.4));
    const scatter = spread * spread * (3 - 2 * spread);
    ctx.save();
    for (let index = 0; index < 72; index += 1) {
      const angle = index * 2.399963 + time * 0.42;
      const ring = 0.035 + ((index * 7) % 17) / 17 * 0.4;
      const distance = ring * Math.min(width, height) * scatter;
      const x = centerX + Math.cos(angle) * distance * 1.3;
      const y = centerY + Math.sin(angle) * distance;
      const radius = 1.15 + (index % 3) * 0.55;

      ctx.globalAlpha = Math.min(1, time / 0.35) * (0.48 + power * 0.42);
      ctx.shadowColor = 'rgba(241,232,206,.9)';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#1d5366';
      ctx.strokeStyle = '#f1e8ce';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    if (frame.gather > 0) {
      const ease = frame.gather * frame.gather * (3 - 2 * frame.gather);
      ctx.fillStyle = `rgba(7,30,49,${ease * 0.93})`;
      ctx.fillRect(0, 0, width, height);

      const cloth = clothBounds(width, height, pattern);
      if (pattern.complete && pattern.naturalWidth) {
        ctx.globalAlpha = frame.gather;
        ctx.drawImage(pattern, cloth.x, cloth.y, cloth.width, cloth.height);
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = `rgba(241,232,206,${frame.gather})`;
      motif.forEach(([u, v], index) => {
        const angle = index * 2.399963;
        const sourceX = centerX + Math.cos(angle + time * 0.2) * width * 0.6;
        const sourceY = centerY + Math.sin(angle) * height * 0.55;
        const x = sourceX * (1 - ease) + (cloth.x + u * cloth.width) * ease;
        const y = sourceY * (1 - ease) + (cloth.y + v * cloth.height) * ease;
        ctx.fillRect(x, y, Math.max(1, width / 250), Math.max(1, height / 170));
      });
    }

    return frame;
  };
}

function drawCloth(ctx, pattern, width, height) {
  if (!pattern.complete || !pattern.naturalWidth) return;
  const cloth = clothBounds(width, height, pattern);
  ctx.drawImage(pattern, cloth.x, cloth.y, cloth.width, cloth.height);
}

function clothBounds(width, height, pattern) {
  const aspect = pattern.naturalWidth && pattern.naturalHeight
    ? pattern.naturalWidth / pattern.naturalHeight
    : 1.5;
  const mobile = width < 700;
  const maxWidth = width * (mobile ? 0.82 : 0.58);
  const maxHeight = height * (mobile ? 0.4 : 0.52);
  const clothWidth = Math.min(maxWidth, maxHeight * aspect);
  const clothHeight = clothWidth / aspect;

  return {
    x: (width - clothWidth) / 2,
    y: (height - clothHeight) / 2,
    width: clothWidth,
    height: clothHeight,
  };
}
