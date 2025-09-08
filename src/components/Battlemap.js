import { screenToWorld, resizeToDisplay, applyCamera } from '../utils/mapTools.js';
import { loadState, saveState, loadBackgroundFromFile } from '../utils/io.js';

export default class BattleMap {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    this.state = {
      x: 0,
      y: 0,
      scale: 1,
      gridSize: 50,
      bg: null,
      tool: 'pan',
      isPointerDown: false,
      pointerStart: { x: 0, y: 0 },
      worldStart: { x: 0, y: 0 },
      rulerActive: false,
      rulerStart: null,
      rulerEnd: null,
      fogEnabled: false,
      fogClears: []
    };

    this.initEventListeners();
    this.animate();
  }

  initEventListeners() {
    window.addEventListener('resize', () => resizeToDisplay(this.state));
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.canvas.addEventListener('wheel', this.onWheel.bind(this));
  }

  onPointerDown(e) {
    this.state.isPointerDown = true;
    this.canvas.setPointerCapture(e.pointerId);
    this.state.pointerStart = { x: e.clientX, y: e.clientY };
    const world = screenToWorld(this.state, e.clientX, e.clientY);
    this.state.worldStart = world;

    if (this.state.tool === 'ruler') {
      this.state.rulerStart = world;
      this.state.rulerEnd = world;
    } else if (this.state.tool === 'fog' && this.state.fogEnabled) {
      this.state.fogClears.push({ x: world.x, y: world.y, r: 60 });
    }
  }

  onPointerMove(e) {
    if (!this.state.isPointerDown) return;
    const dx = e.clientX - this.state.pointerStart.x;
    const dy = e.clientY - this.state.pointerStart.y;

    if (this.state.tool === 'pan') {
      this.state.x += dx / this.state.scale;
      this.state.y += dy / this.state.scale;
      this.state.pointerStart = { x: e.clientX, y: e.clientY };
    } else if (this.state.tool === 'ruler' && this.state.rulerActive && this.state.rulerStart) {
      this.state.rulerEnd = screenToWorld(this.state, e.clientX, e.clientY);
    } else if (this.state.tool === 'fog' && this.state.fogEnabled) {
      const world = screenToWorld(this.state, e.clientX, e.clientY);
      this.state.fogClears.push({ x: world.x, y: world.y, r: 30 });
    }
  }

  onPointerUp(e) {
    this.state.isPointerDown = false;
    this.canvas.releasePointerCapture(e.pointerId);
  }

  onWheel(e) {
    e.preventDefault();
    const old = this.state.scale;
    const delta = Math.sign(e.deltaY) * -0.1;
    const next = Math.min(6, Math.max(0.2, old * (1 + delta)));
    const cursor = screenToWorld(this.state, e.clientX, e.clientY);
    this.state.x = cursor.x - (cursor.x - this.state.x) * (old / next);
    this.state.y = cursor.y - (cursor.y - this.state.y) * (old / next);
    this.state.scale = next;
  }

  animate() {
    resizeToDisplay(this.state);
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }

  render() {
    applyCamera(this.state);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.state.bg) {
      const w = this.state.bg.naturalWidth;
      const h = this.state.bg.naturalHeight;
      this.ctx.drawImage(this.state.bg, -w / 2, -h / 2);
    }

    this.drawGrid();
    this.drawRuler();
    this.drawFog();
  }

  drawGrid() {
    const { ctx, gridSize } = this.state;
    const gs = gridSize;
    const viewSize = 4000;

    ctx.save();
    ctx.lineWidth = 1 / this.state.scale;
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath();
    for (let x = -viewSize; x < viewSize; x += gs) {
      ctx.moveTo(x, -viewSize);
      ctx.lineTo(x, viewSize);
    }
    for (let y = -viewSize; y < viewSize; y += gs) {
      ctx.moveTo(-viewSize, y);
      ctx.lineTo(viewSize, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  drawRuler() {
    if (this.state.rulerActive && this.state.rulerStart && this.state.rulerEnd) {
      this.ctx.strokeStyle = "#7aa2f7";
      this.ctx.lineWidth = 2 / this.state.scale;
      this.ctx.setLineDash([8 / this.state.scale, 8 / this.state.scale]);
      this.ctx.beginPath();
      this.ctx.moveTo(this.state.rulerStart.x, this.state.rulerStart.y);
      this.ctx.lineTo(this.state.rulerEnd.x, this.state.rulerEnd.y);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
  }

  drawFog() {
    if (this.state.fogEnabled) {
      const viewW = 40000, viewH = 40000;
      this.ctx.save();
      this.ctx.fillStyle = "rgba(5,6,10,0.85)";
      this.ctx.fillRect(-viewW / 2, -viewH / 2, viewW, viewH);
      this.ctx.globalCompositeOperation = "destination-out";
      for (const c of this.state.fogClears) {
        this.ctx.beginPath();
        this.ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
  }
}
