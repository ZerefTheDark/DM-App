export function screenToWorld(state, sx, sy) {
  const rect = state.canvas.getBoundingClientRect();
  const x = (sx - rect.left - state.canvas.width / 2) / state.scale - state.x;
  const y = (sy - rect.top - state.canvas.height / 2) / state.scale - state.y;
  return { x, y };
}

export function resizeToDisplay(state) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = Math.round(state.canvas.clientWidth * dpr);
  const h = Math.round(state.canvas.clientHeight * dpr);
  if (state.canvas.width !== w || state.canvas.height !== h) {
    state.canvas.width = w;
    state.canvas.height = h;
  }
  state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function applyCamera(state) {
  const ctx = state.ctx;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  ctx.scale(dpr, dpr);
  ctx.translate(state.canvas.clientWidth / 2, state.canvas.clientHeight / 2);
  ctx.scale(state.scale, state.scale);
  ctx.translate(state.x, state.y);
}
