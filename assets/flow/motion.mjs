export function isBrowsing(now, lastScrollAt, arcDistance) {
  return now - lastScrollAt < 240 || Math.abs(arcDistance) > .0005;
}

export function canAnimateArtwork({ active, visible, paused, hidden, scrolling, modalOpen }) {
  return active && visible && !paused && !hidden && !scrolling && !modalOpen;
}

export function nodeLight(distance, enabled = true) {
  if (!enabled) return 1;
  const x = Math.max(0, 1 - Math.abs(distance) / 110);
  return 1 + .18 * x * x * (3 - 2 * x);
}
