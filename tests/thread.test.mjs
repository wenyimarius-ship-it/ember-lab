import test from 'node:test';
import assert from 'node:assert/strict';
import { createThreadPath, progressAtY, arcDash } from '../assets/flow/thread.mjs';

function sampledPath(segments) {
  const points = [];
  let total = 0;
  for (const s of segments) {
    for (let i = 0; i <= 160; i++) {
      const t = i / 160, u = 1 - t;
      const coord = key => u ** 3 * s.from[key] + 3 * u ** 2 * t * s.c1[key] + 3 * u * t ** 2 * s.c2[key] + t ** 3 * s.to[key];
      const p = { x: coord('x'), y: coord('y') };
      const previous = points.at(-1);
      if (previous) total += Math.hypot(p.x - previous.x, p.y - previous.y);
      points.push({ ...p, length: total });
    }
  }
  return {
    points,
    getTotalLength: () => total,
    getPointAtLength(length) {
      if (length <= 0) return points[0];
      if (length >= total) return points.at(-1);
      const next = points.findIndex(p => p.length >= length);
      const a = points[next - 1], b = points[next];
      const t = (length - a.length) / (b.length - a.length);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    },
  };
}

for (const width of [320, 390, 700, 1440]) {
  test(`${width}px: the arc follows all four nodes and reverses with upward scroll`, () => {
    const anchors = [200, 1100, 2000, 2900].map(y => ({ x: width * (width <= 700 ? .12 : .6), y }));
    const { d, segments } = createThreadPath(anchors, width, width <= 700);
    assert.match(d, /^M/);
    assert.equal(segments.length, 4);
    const path = sampledPath(segments);
    for (let i = 1; i < path.points.length; i++) assert.ok(path.points[i].y >= path.points[i - 1].y);
    let previous = 0;
    for (const anchor of anchors) {
      const fraction = progressAtY(path, anchor.y);
      assert.ok(fraction > previous);
      const head = path.getPointAtLength(fraction * path.getTotalLength());
      assert.ok(Math.abs(head.y - anchor.y) < .01);
      assert.ok(Math.abs(head.x - anchor.x) < .1);
      previous = fraction;
    }
    const down = progressAtY(path, 2400), up = progressAtY(path, 600);
    assert.ok(up < down);
    assert.deepEqual(arcDash(up), arcDash(progressAtY(path, 600)));
    assert.equal(progressAtY(path, -100), 0);
    assert.equal(progressAtY(path, 9000), 1);
  });
}

test('expanding a creative record keeps the arc aligned with the later nodes', () => {
  const anchors = [200, 1400, 2300, 3200].map(y => ({x: 864, y}));
  const path = sampledPath(createThreadPath(anchors, 1440, false).segments);
  for (const anchor of anchors) {
    const head = path.getPointAtLength(progressAtY(path, anchor.y) * path.getTotalLength());
    assert.ok(Math.abs(head.y - anchor.y) < .01);
  }
});

test('the highlighted arc is bounded at both ends and stable without scrolling', () => {
  assert.deepEqual(arcDash(-1), {array:'0 1000', offset:0});
  assert.deepEqual(arcDash(2), {array:'48 952', offset:-952});
  const first = arcDash(.4);
  for (let i = 0; i < 20; i++) assert.deepEqual(arcDash(.4), first);
});
