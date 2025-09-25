/**
 * Configuração global para testes
 */

// Mock do console para evitar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

// Timeout padrão para testes assíncronos
jest.setTimeout(10000);
