const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
let particleCount = calculateParticleCount();

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
    this.fadeDelay = Math.random() * 600 + 100;
    this.fadeStart = Date.now() + this.fadeDelay;
    this.fadingOut = false;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = Math.random() / 5 + 0.1;
    this.opacity = 1;
    this.fadeDelay = Math.random() * 600 + 100;
    this.fadeStart = Date.now() + this.fadeDelay;
    this.fadingOut = false;
  }

  update() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.reset();
    }
    if (!this.fadingOut && Date.now() > this.fadeStart) {
      this.fadingOut = true;
    }
    if (this.fadingOut) {
      this.opacity -= 0.008;
      if (this.opacity <= 0) {
        this.reset();
      }
    }
  }

  draw() {
    ctx.fillStyle = `rgba(${255 - (Math.random() * 255 / 2)}, 255, 255, ${this.opacity})`;
    ctx.fillRect(this.x, this.y, 0.4, Math.random() * 2 + 1);
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animate);
}

function calculateParticleCount() {
  return Math.floor((canvas.width * canvas.height) / 6000);
}

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleCount = calculateParticleCount();
  initParticles();
}

window.addEventListener('resize', onResize);
initParticles();
animate();

const showcaseSection = document.querySelector('.showcase-section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      showcaseSection.classList.add('visible');
    }
  });
});
observer.observe(showcaseSection);

const video = document.getElementById('showcaseVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar').firstElementChild;

playPauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    video.classList.add('playing');
  } else {
    video.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
});

video.addEventListener('timeupdate', () => {
  const progress = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${progress}%`;
});

progressBar.parentElement.addEventListener('click', (e) => {
  const rect = progressBar.parentElement.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const width = rect.width;
  const clickPositionRatio = offsetX / width;
  video.currentTime = clickPositionRatio * video.duration;
});