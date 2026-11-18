// A monotonic curve keeps the light's vertical position tied to the viewport.
export function createThreadPath(anchors, width, mobile) {
  if (!anchors.length || !(width > 0)) return { d: '', segments: [] };
  let previous = { x: width * .92, y: 0 };
  const segments = [];
  for (const anchor of anchors) {
    const gap = anchor.y - previous.y;
    const segment = {
      from: previous,
      c1: { x: mobile ? width * .035 : width * .97, y: previous.y + gap * .34 },
      c2: { x: mobile ? width * .035 : width * .52, y: previous.y + gap * .72 },
      to: anchor,
    };
    segments.push(segment);
    previous = anchor;
  }
  const d = `M${segments[0].from.x} ${segments[0].from.y}` + segments.map(s =>
    ` C${s.c1.x} ${s.c1.y} ${s.c2.x} ${s.c2.y} ${s.to.x} ${s.to.y}`
  ).join('');
  return { d, segments };
}

export function progressAtY(path, y) {
  const length = path.getTotalLength();
  if (!(length > 0)) return 0;
  if (y <= path.getPointAtLength(0).y) return 0;
  if (y >= path.getPointAtLength(length).y) return 1;
  let low = 0, high = length;
  for (let i = 0; i < 20; i++) {
    const middle = (low + high) * .5;
    if (path.getPointAtLength(middle).y < y) low = middle;
    else high = middle;
  }
  return (low + high) * .5 / length;
}

export function arcDash(progress, maxLength = 48) {
  const head = Math.min(1, Math.max(0, progress)) * 1000;
  const length = Math.min(head, maxLength);
  return { array: `${length} ${1000 - length}`, offset: length - head };
}
