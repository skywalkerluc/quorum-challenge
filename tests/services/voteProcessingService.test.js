/**
 * Testes para o serviço de processamento de votos
 */
const VoteProcessingService = require('../../src/services/voteProcessingService');
const { VOTE_TYPES } = require('../../src/config/constants');

// Mock do logger
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

describe('VoteProcessingService', () => {
  let service;

  beforeEach(() => {
    service = new VoteProcessingService();
  });

  describe('processVotingData', () => {
    test('deve processar dados de votação completos', async () => {
      const votesData = [
        { id: 'vote1', bill_id: 'bill1' },
        { id: 'vote2', bill_id: 'bill2' }
      ];

      const voteResultsData = [
        { id: '1', legislator_id: 'leg1', vote_id: 'vote1', vote_type: '1' },
        { id: '2', legislator_id: 'leg2', vote_id: 'vote1', vote_type: '2' },
        { id: '3', legislator_id: 'leg1', vote_id: 'vote2', vote_type: '1' }
      ];

      const billsData = [
        { id: 'bill1', title: 'Bill 1', sponsor_id: 'leg1' },
        { id: 'bill2', title: 'Bill 2', sponsor_id: 'leg2' }
      ];

      const legislatorsData = [
        { id: 'leg1', name: 'John Doe' },
        { id: 'leg2', name: 'Jane Smith' }
      ];

      const result = await service.processVotingData(
        votesData,
        voteResultsData,
        billsData,
        legislatorsData
      );

      expect(result.legislatorSupport).toHaveLength(2);
      expect(result.billSupport).toHaveLength(2);

      // Verifica dados dos legisladores
      const johnData = result.legislatorSupport.find(l => l.id === 'leg1');
      expect(johnData.num_supported_bills).toBe(2); // 2 votos de apoio
      expect(johnData.num_opposed_bills).toBe(0);

      const janeData = result.legislatorSupport.find(l => l.id === 'leg2');
      expect(janeData.num_supported_bills).toBe(0);
      expect(janeData.num_opposed_bills).toBe(1); // 1 voto de oposição

      // Verifica dados dos projetos
      const bill1Data = result.billSupport.find(b => b.bill_id === 'bill1');
      expect(bill1Data.supporter_count).toBe(1);
      expect(bill1Data.opposer_count).toBe(1);
      expect(bill1Data.sponsor).toBe('John Doe');

      const bill2Data = result.billSupport.find(b => b.bill_id === 'bill2');
      expect(bill2Data.supporter_count).toBe(1);
      expect(bill2Data.opposer_count).toBe(0);
      expect(bill2Data.sponsor).toBe('Jane Smith');
    });

    test('deve lidar com dados vazios', async () => {
      const result = await service.processVotingData([], [], [], []);

      expect(result.legislatorSupport).toEqual([]);
      expect(result.billSupport).toEqual([]);
    });

    test('deve lidar com votos sem resultados', async () => {
      const votesData = [{ id: 'vote1', bill_id: 'bill1' }];
      const billsData = [{ id: 'bill1', title: 'Bill 1', sponsor_id: 'leg1' }];
      const legislatorsData = [{ id: 'leg1', name: 'John Doe' }];

      const result = await service.processVotingData(
        votesData,
        [],
        billsData,
        legislatorsData
      );

      expect(result.billSupport[0].supporter_count).toBe(0);
      expect(result.billSupport[0].opposer_count).toBe(0);
    });
  });

  describe('initializeVotes', () => {
    test('deve inicializar votos corretamente', () => {
      const votesData = [
        { id: 'vote1', bill_id: 'bill1' },
        { id: 'vote2', bill_id: 'bill2' }
      ];

      service.initializeVotes(votesData);

      expect(service.votes.size).toBe(2);
      expect(service.billToVoteMap.size).toBe(2);
      expect(service.billToVoteMap.get('bill1')).toBe('vote1');
      expect(service.billToVoteMap.get('bill2')).toBe('vote2');
    });
  });

  describe('processVoteResults', () => {
    beforeEach(() => {
      service.votes.set('vote1', {
        addSupportVote: jest.fn(),
        addOpposeVote: jest.fn()
      });
    });

    test('deve processar votos de apoio', () => {
      const voteResultsData = [
        { id: '1', legislator_id: 'leg1', vote_id: 'vote1', vote_type: VOTE_TYPES.SUPPORT }
      ];

      service.processVoteResults(voteResultsData);

      expect(service.votes.get('vote1').addSupportVote).toHaveBeenCalled();
      expect(service.legislators.get('leg1')).toBeDefined();
    });

    test('deve processar votos de oposição', () => {
      const voteResultsData = [
        { id: '1', legislator_id: 'leg1', vote_id: 'vote1', vote_type: VOTE_TYPES.OPPOSE }
      ];

      service.processVoteResults(voteResultsData);

      expect(service.votes.get('vote1').addOpposeVote).toHaveBeenCalled();
    });

    test('deve ignorar votos inexistentes', () => {
      const voteResultsData = [
        { id: '1', legislator_id: 'leg1', vote_id: 'nonexistent', vote_type: '1' }
      ];

      expect(() => service.processVoteResults(voteResultsData)).not.toThrow();
    });
  });

  describe('attachBillDetails', () => {
    beforeEach(() => {
      service.votes.set('vote1', {
        setBillDetails: jest.fn()
      });
      service.billToVoteMap.set('bill1', 'vote1');
    });

    test('deve anexar detalhes dos projetos', () => {
      const billsData = [
        { id: 'bill1', title: 'Bill 1', sponsor_id: 'leg1' }
      ];

      service.attachBillDetails(billsData);

      expect(service.votes.get('vote1').setBillDetails).toHaveBeenCalledWith('Bill 1', 'leg1');
      expect(service.sponsorToVoteMap.get('leg1')).toBe('vote1');
    });

    test('deve ignorar projetos sem votos', () => {
      const billsData = [
        { id: 'nonexistent', title: 'Bill 1', sponsor_id: 'leg1' }
      ];

      expect(() => service.attachBillDetails(billsData)).not.toThrow();
    });
  });

  describe('compileLegislatorSupport', () => {
    beforeEach(() => {
      service.legislators.set('leg1', {
        name: '',
        toLegislatorOutput: jest.fn().mockReturnValue({
          id: 'leg1',
          name: 'John Doe',
          num_supported_bills: 1,
          num_opposed_bills: 0
        })
      });
      service.votes.set('vote1', {
        setSponsorName: jest.fn()
      });
      service.sponsorToVoteMap.set('leg1', 'vote1');
    });

    test('deve compilar dados dos legisladores', () => {
      const legislatorsData = [
        { id: 'leg1', name: 'John Doe' }
      ];

      const result = service.compileLegislatorSupport(legislatorsData);

      expect(result).toHaveLength(1);
      expect(service.legislators.get('leg1').toLegislatorOutput).toHaveBeenCalled();
    });

    test('deve criar legisladores que não existem', () => {
      const legislatorsData = [
        { id: 'leg2', name: 'Jane Smith' }
      ];

      const result = service.compileLegislatorSupport(legislatorsData);

      expect(result).toHaveLength(1);
      expect(service.legislators.get('leg2')).toBeDefined();
    });
  });

  describe('compileBillSupport', () => {
    test('deve compilar dados dos projetos', () => {
      const mockVoteData = {
        toBillOutput: jest.fn().mockReturnValue({
          bill_id: 'bill1',
          title: 'Bill 1',
          supporter_count: 1,
          opposer_count: 0,
          sponsor: 'John Doe'
        })
      };

      service.votes.set('vote1', mockVoteData);

      const result = service.compileBillSupport();

      expect(result).toHaveLength(1);
      expect(mockVoteData.toBillOutput).toHaveBeenCalled();
    });
  });
});
