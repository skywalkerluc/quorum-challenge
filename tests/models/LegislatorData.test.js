/**
 * Testes para o modelo LegislatorData
 */
const LegislatorData = require('../../src/models/LegislatorData');

describe('LegislatorData', () => {
  let legislatorData;

  beforeEach(() => {
    legislatorData = new LegislatorData('leg123', 'John Doe');
  });

  describe('Constructor', () => {
    test('deve inicializar com valores corretos', () => {
      expect(legislatorData.legislatorId).toBe('leg123');
      expect(legislatorData.name).toBe('John Doe');
      expect(legislatorData.supportedBillsCount).toBe(0);
      expect(legislatorData.opposedBillsCount).toBe(0);
    });
  });

  describe('addSupportVote', () => {
    test('deve incrementar contador de projetos apoiados', () => {
      legislatorData.addSupportVote();
      expect(legislatorData.supportedBillsCount).toBe(1);

      legislatorData.addSupportVote();
      expect(legislatorData.supportedBillsCount).toBe(2);
    });
  });

  describe('addOpposeVote', () => {
    test('deve incrementar contador de projetos opostos', () => {
      legislatorData.addOpposeVote();
      expect(legislatorData.opposedBillsCount).toBe(1);

      legislatorData.addOpposeVote();
      expect(legislatorData.opposedBillsCount).toBe(2);
    });
  });

  describe('toLegislatorOutput', () => {
    test('deve converter para formato de saída correto', () => {
      legislatorData.addSupportVote();
      legislatorData.addSupportVote();
      legislatorData.addOpposeVote();

      const output = legislatorData.toLegislatorOutput();

      expect(output).toEqual({
        id: 'leg123',
        name: 'John Doe',
        num_supported_bills: 2,
        num_opposed_bills: 1
      });
    });

    test('deve retornar zeros quando não há votos', () => {
      const output = legislatorData.toLegislatorOutput();

      expect(output).toEqual({
        id: 'leg123',
        name: 'John Doe',
        num_supported_bills: 0,
        num_opposed_bills: 0
      });
    });
  });

  describe('Cenários complexos', () => {
    test('deve processar múltiplos votos corretamente', () => {
      // Simula 10 votos de apoio e 5 de oposição
      for (let i = 0; i < 10; i++) {
        legislatorData.addSupportVote();
      }
      for (let i = 0; i < 5; i++) {
        legislatorData.addOpposeVote();
      }

      const output = legislatorData.toLegislatorOutput();

      expect(output.num_supported_bills).toBe(10);
      expect(output.num_opposed_bills).toBe(5);
    });

    test('deve manter contadores independentes', () => {
      legislatorData.addSupportVote();
      legislatorData.addOpposeVote();
      legislatorData.addSupportVote();

      expect(legislatorData.supportedBillsCount).toBe(2);
      expect(legislatorData.opposedBillsCount).toBe(1);
    });
  });
});
