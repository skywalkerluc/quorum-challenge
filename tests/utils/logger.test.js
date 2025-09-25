/**
 * Testes para o sistema de logging
 */
const Logger = require('../../src/utils/logger');

describe('Logger', () => {
  let originalConsole;

  beforeEach(() => {
    originalConsole = global.console;
    global.console = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn()
    };
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  describe('Constructor e Configuração', () => {
    test('deve ter níveis de log corretos', () => {
      expect(Logger.levels.ERROR).toBe(0);
      expect(Logger.levels.WARN).toBe(1);
      expect(Logger.levels.INFO).toBe(2);
      expect(Logger.levels.DEBUG).toBe(3);
    });
  });

  describe('Logging Methods', () => {
    test('deve logar mensagens com formato correto', () => {
      Logger.setLevel('DEBUG');
      
      Logger.error('Test error message');
      Logger.warn('Test warning message');
      Logger.info('Test info message');
      Logger.debug('Test debug message');

      expect(console.log).toHaveBeenCalledTimes(4);
      
      // Verifica se todas as mensagens foram logadas
      const calls = console.log.mock.calls;
      expect(calls[0][0]).toContain('"level":"ERROR"');
      expect(calls[1][0]).toContain('"level":"WARN"');
      expect(calls[2][0]).toContain('"level":"INFO"');
      expect(calls[3][0]).toContain('"level":"DEBUG"');
    });
  });

  describe('Dados Adicionais', () => {
    test('deve incluir dados adicionais no log', () => {
      Logger.setLevel('DEBUG');
      
      const testData = { userId: 123, action: 'test' };
      Logger.info('Test message', testData);

      const logCall = console.log.mock.calls[0][0];
      const logObject = JSON.parse(logCall);

      expect(logObject.data).toEqual(testData);
    });

    test('deve incluir timestamp no log', () => {
      Logger.setLevel('DEBUG');
      
      Logger.info('Test message');

      const logCall = console.log.mock.calls[0][0];
      const logObject = JSON.parse(logCall);

      expect(logObject.timestamp).toBeDefined();
      expect(new Date(logObject.timestamp)).toBeInstanceOf(Date);
    });
  });
});