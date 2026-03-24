class DataCollector {
  constructor() {
    this.clientData = {
      ip: 'OBTENIENDO...',
      device: 'ESCANEANDO...',
      browser: 'ESCANEANDO...',
      os: 'ESCANEANDO...',
      resolution: 'ESCANEANDO...',
      language: 'ESCANEANDO...',
      timezone: 'ESCANEANDO...'
    };
  }

  async init() {
    this.collectStaticData();
    await this.fetchIP();
  }

  collectStaticData() {
    const parser = new UAParser();
    const result = parser.getResult();

    this.clientData.device = result.device.type 
      ? result.device.type.toUpperCase() 
      : 'DESKTOP';
    this.clientData.browser = `${result.browser.name || 'Unknown'} ${result.browser.major || ''}`.trim();
    this.clientData.os = `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim();
    this.clientData.resolution = `${window.screen.width}x${window.screen.height}`;
    this.clientData.language = navigator.language || 'Unknown';
    this.clientData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
  }

  async fetchIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      this.clientData.ip = data.ip;
      return data.ip;
    } catch (error) {
      this.clientData.ip = 'BLOQUEADO';
      return 'BLOQUEADO';
    }
  }

  getData() {
    return { ...this.clientData };
  }
}

export default DataCollector;
