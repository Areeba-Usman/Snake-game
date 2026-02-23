const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

// ── MOUSE + TOUCH ──
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("touchmove", e => {
  e.preventDefault();
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, { passive: false });

window.addEventListener("touchstart", e => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

// ── DOTS ──
let dots = [];

function initDots() {
  dots = [];
  let gap = window.innerWidth < 600 ? 20 : 30;
  for (let y = 0; y < canvas.height; y += gap) {
    for (let x = 0; x < canvas.width; x += gap) {
      dots.push({ x, y, ox: x, oy: y });
    }
  }
}

function updateDots() {
  dots.forEach(d => {
    let dx = mouse.x - d.x;
    let dy = mouse.y - d.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 100) {
      d.x -= dx * 0.03;
      d.y -= dy * 0.03;
    } else {
      d.x += (d.ox - d.x) * 0.08;
      d.y += (d.oy - d.y) * 0.08;
    }

    let close = dist < 100;
    ctx.beginPath();
    ctx.arc(d.x, d.y, close ? 3 : 1.5, 0, Math.PI * 2);
    ctx.fillStyle = close ? "cyan" : "rgba(255,255,255,0.2)";
    ctx.fill();
  });
}

// ── DRAGON ──
let tail = [];
for (let i = 0; i < 50; i++) {
  tail.push({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
}

function updateDragon() {
  tail[0].x += (mouse.x - tail[0].x) * 0.2;
  tail[0].y += (mouse.y - tail[0].y) * 0.2;

  for (let i = 1; i < tail.length; i++) {
    tail[i].x += (tail[i - 1].x - tail[i].x) * 0.4;
    tail[i].y += (tail[i - 1].y - tail[i].y) * 0.4;
  }

  tail.forEach((seg, i) => {
    let t = i / tail.length;
    let r = 10 - t * 7;
    let hue = (200 + i * 3 + Date.now() * 0.05) % 360;

    ctx.beginPath();
    ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${1 - t * 0.6})`;
    ctx.fill();
  });
}

// ── RESIZE ──
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initDots();
}

window.addEventListener("resize", resize);
window.addEventListener("orientationchange", () => {
  setTimeout(resize, 200);
});

// ── START ──
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

initDots();

function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  updateDots();
  updateDragon();
  requestAnimationFrame(draw);
}

draw();