const KEY = "war-vault-battlemap-v1";

export function saveState(state) {
  const data = {
    x: state.x, y: state.y, scale: state.scale,
    gridSize: state.gridSize,
    fogEnabled: state.fogEnabled,
    fogClears: state.fogClears,
    bgSrc: state.bg ? (state.bg.__src || null) : null
  };
  localStorage.setItem(KEY, JSON.stringify(data));
}

export async function loadState(state) {
  const raw =