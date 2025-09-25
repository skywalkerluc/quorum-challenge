/**
 * Testes para os validadores de dados
 */
const DataValidator = require('../../src/utils/validators');

describe('DataValidator', () => {
  describe('validateVotesData', () => {
    test('deve validar dados de votos corretos', () => {
      const votesData = [
        { id: '1', bill_id: 'bill1' },
        { id: '2', bill_id: 'bill2' }
      ];

      expect(() => DataValidator.validateVotesData(votesData)).not.toThrow();
    });

    test('deve rejeitar dados que não são array', () => {
      expect(() => DataValidator.validateVotesData(null)).toThrow('Votes data must be an array');
      expect(() => DataValidator.validateVotesData({})).toThrow('Votes data must be an array');
      expect(() => DataValidator.validateVotesData('string')).toThrow('Votes data must be an array');
    });

    test('deve rejeitar votos sem id', () => {
      const votesData = [{ bill_id: 'bill1' }];
      expect(() => DataValidator.validateVotesData(votesData)).toThrow('Invalid vote data: missing id or bill_id');
    });

    test('deve rejeitar votos sem bill_id', () => {
      const votesData = [{ id: '1' }];
      expect(() => DataValidator.validateVotesData(votesData)).toThrow('Invalid vote data: missing id or bill_id');
    });
  });

  describe('validateVoteResultsData', () => {
    test('deve validar dados de resultados corretos', () => {
      const voteResultsData = [
        { id: '1', legislator_id: 'leg1', vote_id: 'vote1', vote_type: '1' },
        { id: '2', legislator_id: 'leg2', vote_id: 'vote2', vote_type: '2' }
      ];

      expect(() => DataValidator.validateVoteResultsData(voteResultsData)).not.toThrow();
    });

    test('deve rejeitar dados que não são array', () => {
      expect(() => DataValidator.validateVoteResultsData(null)).toThrow('Vote results data must be an array');
    });

    test('deve rejeitar resultados sem campos obrigatórios', () => {
      const voteResultsData = [{ id: '1' }];
      expect(() => DataValidator.validateVoteResultsData(voteResultsData)).toThrow('Invalid vote result data: missing required fields');
    });

    test('deve rejeitar tipos de voto inválidos', () => {
      const voteResultsData = [
        { id: '1', legislator_id: 'leg1', vote_id: 'vote1', vote_type: '3' }
      ];
      expect(() => DataValidator.validateVoteResultsData(voteResultsData)).toThrow('Invalid vote type: 3. Must be \'1\' or \'2\'');
    });
  });

  describe('validateBillsData', () => {
    test('deve validar dados de projetos corretos', () => {
      const billsData = [
        { id: '1', title: 'Bill 1', sponsor_id: 'sponsor1' },
        { id: '2', title: 'Bill 2', sponsor_id: 'sponsor2' }
      ];

      expect(() => DataValidator.validateBillsData(billsData)).not.toThrow();
    });

    test('deve rejeitar dados que não são array', () => {
      expect(() => DataValidator.validateBillsData(null)).toThrow('Bills data must be an array');
    });

    test('deve rejeitar projetos sem campos obrigatórios', () => {
      const billsData = [{ id: '1' }];
      expect(() => DataValidator.validateBillsData(billsData)).toThrow('Invalid bill data: missing id, title, or sponsor_id');
    });
  });

  describe('validateLegislatorsData', () => {
    test('deve validar dados de legisladores corretos', () => {
      const legislatorsData = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' }
      ];

      expect(() => DataValidator.validateLegislatorsData(legislatorsData)).not.toThrow();
    });

    test('deve rejeitar dados que não são array', () => {
      expect(() => DataValidator.validateLegislatorsData(null)).toThrow('Legislators data must be an array');
    });

    test('deve rejeitar legisladores sem campos obrigatórios', () => {
      const legislatorsData = [{ id: '1' }];
      expect(() => DataValidator.validateLegislatorsData(legislatorsData)).toThrow('Invalid legislator data: missing id or name');
    });
  });

  describe('validateAllInputData', () => {
    test('deve validar todos os dados corretos', () => {
      const votesData = [{ id: '1', bill_id: 'bill1' }];
      const voteResultsData = [{ id: '1', legislator_id: 'leg1', vote_id: 'vote1', vote_type: '1' }];
      const billsData = [{ id: '1', title: 'Bill 1', sponsor_id: 'sponsor1' }];
      const legislatorsData = [{ id: '1', name: 'John Doe' }];

      expect(() => DataValidator.validateAllInputData(votesData, voteResultsData, billsData, legislatorsData)).not.toThrow();
    });

    test('deve rejeitar se qualquer dado for inválido', () => {
      const votesData = [{ id: '1', bill_id: 'bill1' }];
      const voteResultsData = [{ id: '1', legislator_id: 'leg1', vote_id: 'vote1', vote_type: '1' }];
      const billsData = [{ id: '1', title: 'Bill 1', sponsor_id: 'sponsor1' }];
      const legislatorsData = null; // Dados inválidos

      expect(() => DataValidator.validateAllInputData(votesData, voteResultsData, billsData, legislatorsData)).toThrow();
    });
  });

  describe('Cenários de borda', () => {
    test('deve lidar com arrays vazios', () => {
      expect(() => DataValidator.validateVotesData([])).not.toThrow();
      expect(() => DataValidator.validateVoteResultsData([])).not.toThrow();
      expect(() => DataValidator.validateBillsData([])).not.toThrow();
      expect(() => DataValidator.validateLegislatorsData([])).not.toThrow();
    });

    test('deve validar dados com valores vazios mas campos presentes', () => {
      const votesData = [{ id: '1', bill_id: '2' }];
      expect(() => DataValidator.validateVotesData(votesData)).not.toThrow();
    });
  });
});
