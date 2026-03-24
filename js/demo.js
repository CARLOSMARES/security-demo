class SecurityDemo {
  constructor() {
    this.modal = document.getElementById('demo-modal');
    this.demoInfo = document.getElementById('demo-info');
    this.demoProgress = document.getElementById('demo-progress');
    this.dataPanel = document.getElementById('data-panel');
    this.dataList = document.getElementById('data-list');
    this.progressFill = document.getElementById('progress-fill');
    this.progressText = document.getElementById('progress-text');
    this.runDemoBtn = document.getElementById('run-demo');
    this.startDemoBtn = document.getElementById('start-demo');
    this.closeModalBtn = document.getElementById('close-modal');
    
    this.data = {};
    this.isRunning = false;
    
    this.init();
  }

  init() {
    this.startDemoBtn.addEventListener('click', () => this.openModal());
    this.closeModalBtn.addEventListener('click', () => this.closeModal());
    this.runDemoBtn.addEventListener('click', () => this.runSimulation());
    
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    this.collectData();
  }

  collectData() {
    const parser = new UAParser();
    const result = parser.getResult();

    this.data = {
      dispositivo: result.device.type ? result.device.type.toUpperCase() : 'DESKTOP',
      navegador: `${result.browser.name || 'Unknown'} ${result.browser.major || ''}`.trim(),
      sistema: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
      resolucion: `${window.screen.width}x${window.screen.height}`,
      idioma: navigator.language || 'Unknown',
      zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'
    };

    this.fetchIP();
  }

  async fetchIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      this.data.ip = data.ip;
    } catch (error) {
      this.data.ip = 'No disponible';
    }
  }

  openModal() {
    this.resetUI();
    this.runDemoBtn.classList.remove('hidden');
    this.modal.classList.add('active');
  }

  closeModal() {
    this.isRunning = false;
    this.modal.classList.remove('active');
    setTimeout(() => this.resetUI(), 300);
  }

  resetUI() {
    this.demoInfo.classList.remove('hidden');
    this.demoInfo.innerHTML = '<p>Presiona el botón de abajo para ver la demo</p>';
    this.demoProgress.classList.add('hidden');
    this.dataPanel.classList.add('hidden');
    this.runDemoBtn.classList.add('hidden');
    this.progressFill.style.width = '0%';
    this.dataList.innerHTML = '';
  }

  async runSimulation() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.runDemoBtn.classList.add('hidden');
    this.demoInfo.classList.add('hidden');
    this.demoProgress.classList.remove('hidden');

    const phases = [
      { duration: 2000, text: 'Escaneando dispositivo...', progress: 15 },
      { duration: 2500, text: 'Obteniendo información del navegador...', progress: 35 },
      { duration: 2000, text: 'Detectando sistema operativo...', progress: 50 },
      { duration: 2500, text: 'Analizando configuración...', progress: 70 },
      { duration: 2000, text: 'Recopilando datos de red...', progress: 90 },
      { duration: 1500, text: 'Completado', progress: 100 }
    ];

    for (const phase of phases) {
      if (!this.isRunning) return;
      
      this.progressFill.style.width = phase.progress + '%';
      this.progressText.textContent = phase.text;
      
      await this.delay(phase.duration);
    }

    this.showData();
  }

  showData() {
    this.demoProgress.classList.add('hidden');
    this.dataPanel.classList.remove('hidden');

    const dataEntries = [
      { label: 'Dirección IP', value: this.data.ip },
      { label: 'Dispositivo', value: this.data.dispositivo },
      { label: 'Navegador', value: this.data.navegador },
      { label: 'Sistema Operativo', value: this.data.sistema },
      { label: 'Resolución', value: this.data.resolucion },
      { label: 'Idioma', value: this.data.idioma },
      { label: 'Zona Horaria', value: this.data.zonaHoraria }
    ];

    dataEntries.forEach((entry, index) => {
      setTimeout(() => {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
          <span class="data-label">${entry.label}</span>
          <span class="data-value">${entry.value}</span>
        `;
        this.dataList.appendChild(item);
      }, index * 200);
    });

    this.runDemoBtn.textContent = 'Reiniciar';
    this.runDemoBtn.classList.remove('hidden');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SecurityDemo();
});
