import test from 'node:test';
import assert from 'node:assert/strict';
import { isBrowsing, canAnimateArtwork, nodeLight } from '../assets/flow/motion.mjs';

test('scrolling and arc easing finish before only the current artwork starts moving', () => {
  const elapsed = [0,0,0,0];
  const frame = (now, lastScrollAt, arcDistance, active) => elapsed.forEach((_,i) => {
    if (canAnimateArtwork({ active:i===active, visible:true, paused:false, hidden:false, modalOpen:false, scrolling:isBrowsing(now,lastScrollAt,arcDistance) })) elapsed[i] += 1;
  });
  frame(0,0,.1,0);
  frame(150,0,0,0);
  frame(300,0,.003,0);
  assert.deepEqual(elapsed,[0,0,0,0]);
  frame(700,0,0,0);
  assert.deepEqual(elapsed,[1,0,0,0]);
  frame(800,800,.1,2);
  assert.deepEqual(elapsed,[1,0,0,0]);
  frame(1300,800,0,2);
  assert.deepEqual(elapsed,[1,0,1,0]);
});

test('pause, background, offscreen and open directory each keep the current artwork still', () => {
  const idle = {active:true,visible:true,paused:false,hidden:false,scrolling:false,modalOpen:false};
  assert.ok(canAnimateArtwork(idle));
  for (const disabled of [{paused:true},{hidden:true},{visible:false},{modalOpen:true},{active:false}]) {
    assert.equal(canAnimateArtwork({...idle,...disabled}),false);
  }
});

test('node response is soft, bounded and reversible without repeated flashes', () => {
  assert.equal(nodeLight(0),1.18);
  assert.equal(nodeLight(110),1);
  assert.equal(nodeLight(1000),1);
  assert.equal(nodeLight(0,false),1);
  let previous = 1.18;
  for(let distance=1;distance<=110;distance++) {
    const light=nodeLight(distance);
    assert.ok(light>=1&&light<=1.18&&light<=previous);
    assert.equal(light,nodeLight(-distance));
    assert.ok(Math.abs(previous-light)<.003);
    previous=light;
  }
  assert.equal(nodeLight(40),nodeLight(40));
});
