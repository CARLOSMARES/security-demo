const UI = {
  statusMessages: [
    'INICIANDO ANÁLISIS...',
    'CONECTANDO CON SERVIDOR...',
    'OBTENIENDO INFORMACIÓN...',
    'ANALIZANDO DISPOSITIVO...',
    'BREACH EXITOSO'
  ],
  fullscreenEnabled: false,
  dataCollected: false,
  redirectUrl: 'https://meet.hidrodigital.com/',

  init() {
    this.bindEvents();
  },

  bindEvents() {
    document.addEventListener('keydown', () => this.enableFullscreen());
    document.addEventListener('click', () => this.enableFullscreen());
    
    const closeBtn = document.getElementById('close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.handleClose());
    }
  },

  updateStatus(index) {
    const el = document.getElementById('status-text');
    if (el) el.textContent = this.statusMessages[index];
  },

  updateField(id, value, isScanning = false) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value;
      if (!isScanning) el.classList.remove('scanning');
    }
  },

  updateProgress(percent) {
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    if (fill) fill.style.width = percent + '%';
    if (text) text.textContent = percent + '%';
  },

  enableFullscreen() {
    if (this.fullscreenEnabled) return;
    
    this.fullscreenEnabled = true;
    const prompt = document.getElementById('fullscreen-prompt');
    if (prompt) prompt.classList.add('hidden');

    const elem = document.documentElement;
    const methods = [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'msRequestFullscreen'
    ];
    
    for (const method of methods) {
      if (elem[method]) {
        elem[method]().catch(() => {});
        break;
      }
    }
  },

  showModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'flex';
  },

  hideModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
  },

  exitFullscreen() {
    const methods = [
      'exitFullscreen',
      'webkitExitFullscreen',
      'msExitFullscreen'
    ];
    
    for (const method of methods) {
      if (document[method]) {
        document[method]().catch(() => {});
        break;
      }
    }
  },

  handleClose() {
    this.hideModal();
    this.exitFullscreen();
    
    setTimeout(() => {
      window.location.href = this.redirectUrl;
    }, 500);
  },

  async runSequence(collector) {
    this.updateStatus(0);
    
    await collector.fetchIP();
    this.updateField('ip', collector.clientData.ip);
    
    await this.delay(1500);
    this.updateStatus(1);
    
    await this.delay(1000);
    this.updateField('device', collector.clientData.device);
    this.updateProgress(15);
    this.updateStatus(2);
    
    await this.delay(1500);
    this.updateField('browser', collector.clientData.browser);
    this.updateProgress(30);
    
    await this.delay(1500);
    this.updateField('os', collector.clientData.os);
    this.updateProgress(45);
    
    await this.delay(1500);
    this.updateField('resolution', collector.clientData.resolution);
    this.updateProgress(60);
    
    await this.delay(1500);
    this.updateField('language', collector.clientData.language);
    this.updateProgress(75);
    
    await this.delay(1500);
    this.updateField('timezone', collector.clientData.timezone);
    this.updateProgress(90);
    
    await this.delay(1000);
    this.updateProgress(100);
    this.updateStatus(4);
    
    await this.delay(2000);
    this.showModal();
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

export default UI;
