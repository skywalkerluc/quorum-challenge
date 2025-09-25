/**
 * Testes para o modelo VoteData
 */
const VoteData = require('../../src/models/VoteData');

describe('VoteData', () => {
  let voteData;

  beforeEach(() => {
    voteData = new VoteData('vote123', 'bill456');
  });

  describe('Constructor', () => {
    test('deve inicializar com valores corretos', () => {
      expect(voteData.voteId).toBe('vote123');
      expect(voteData.billId).toBe('bill456');
      expect(voteData.supporterCount).toBe(0);
      expect(voteData.opposerCount).toBe(0);
      expect(voteData.title).toBeNull();
      expect(voteData.sponsorId).toBeNull();
      expect(voteData.sponsorName).toBe('Unknown');
    });
  });

  describe('addSupportVote', () => {
    test('deve incrementar contador de apoiadores', () => {
      voteData.addSupportVote();
      expect(voteData.supporterCount).toBe(1);

      voteData.addSupportVote();
      expect(voteData.supporterCount).toBe(2);
    });
  });

  describe('addOpposeVote', () => {
    test('deve incrementar contador de opositores', () => {
      voteData.addOpposeVote();
      expect(voteData.opposerCount).toBe(1);

      voteData.addOpposeVote();
      expect(voteData.opposerCount).toBe(2);
    });
  });

  describe('setBillDetails', () => {
    test('deve definir título e ID do patrocinador', () => {
      voteData.setBillDetails('Test Bill', 'sponsor789');
      
      expect(voteData.title).toBe('Test Bill');
      expect(voteData.sponsorId).toBe('sponsor789');
    });
  });

  describe('setSponsorName', () => {
    test('deve definir nome do patrocinador', () => {
      voteData.setSponsorName('John Doe');
      expect(voteData.sponsorName).toBe('John Doe');
    });
  });

  describe('toBillOutput', () => {
    test('deve converter para formato de saída correto', () => {
      voteData.setBillDetails('Test Bill', 'sponsor789');
      voteData.setSponsorName('John Doe');
      voteData.addSupportVote();
      voteData.addSupportVote();
      voteData.addOpposeVote();

      const output = voteData.toBillOutput();

      expect(output).toEqual({
        bill_id: 'bill456',
        title: 'Test Bill',
        supporter_count: 2,
        opposer_count: 1,
        sponsor: 'John Doe'
      });
    });

    test('deve usar valores padrão quando não definidos', () => {
      const output = voteData.toBillOutput();

      expect(output).toEqual({
        bill_id: 'bill456',
        title: null,
        supporter_count: 0,
        opposer_count: 0,
        sponsor: 'Unknown'
      });
    });
  });

  describe('Cenários complexos', () => {
    test('deve processar múltiplos votos corretamente', () => {
      voteData.setBillDetails('Complex Bill', 'sponsor123');
      voteData.setSponsorName('Jane Smith');

      // Simula 5 votos de apoio e 3 de oposição
      for (let i = 0; i < 5; i++) {
        voteData.addSupportVote();
      }
      for (let i = 0; i < 3; i++) {
        voteData.addOpposeVote();
      }

      const output = voteData.toBillOutput();

      expect(output.supporter_count).toBe(5);
      expect(output.opposer_count).toBe(3);
      expect(output.title).toBe('Complex Bill');
      expect(output.sponsor).toBe('Jane Smith');
    });
  });
});
