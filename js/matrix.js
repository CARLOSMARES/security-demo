const MatrixEffect = {
  canvas: null,
  ctx: null,
  chars: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  fontSize: 14,
  columns: 0,
  drops: [],
  animationId: null,

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    
    window.addEventListener('resize', () => this.resize());
    this.start();
  },

  resize() {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = this.canvas.width / this.fontSize;
    
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * this.canvas.height;
    }
  },

  draw() {
    if (!this.ctx) return;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = this.fontSize + 'px VT323';

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      this.ctx.fillText(char, i * this.fontSize, this.drops[i]);

      if (this.drops[i] > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i] += this.fontSize;
    }
  },

  start() {
    const animate = () => {
      this.draw();
      this.animationId = setTimeout(() => requestAnimationFrame(animate), 50);
    };
    animate();
  },

  stop() {
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
  }
};

export default MatrixEffect;
