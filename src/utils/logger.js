/**
 * Sistema de logging estruturado
 */
class Logger {
  constructor() {
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    this.currentLevel = this.levels.INFO;
  }

  setLevel(level) {
    this.currentLevel = this.levels[level] || this.levels.INFO;
  }

  _log(level, message, data = null) {
    if (this.levels[level] <= this.currentLevel) {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        message,
        ...(data && { data })
      };
      
      console.log(JSON.stringify(logEntry));
    }
  }

  error(message, data = null) {
    this._log('ERROR', message, data);
  }

  warn(message, data = null) {
    this._log('WARN', message, data);
  }

  info(message, data = null) {
    this._log('INFO', message, data);
  }

  debug(message, data = null) {
    this._log('DEBUG', message, data);
  }
}

module.exports = new Logger();
