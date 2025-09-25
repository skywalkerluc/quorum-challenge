/**
 * Testes de integração para a aplicação principal
 */
const VoteProcessorApp = require('../../src/index');
const CsvService = require('../../src/services/csvService');
const DataValidator = require('../../src/utils/validators');

// Mock dos serviços
jest.mock('../../src/services/csvService');
jest.mock('../../src/utils/validators');
jest.mock('../../src/services/voteProcessingService');

describe('VoteProcessorApp - Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = new VoteProcessorApp();
    jest.clearAllMocks();
  });

  describe('run', () => {
    test('deve executar processamento completo com sucesso', async () => {
      // Mock dos dados de entrada
      const mockInputData = {
        votes: [{ id: 'vote1', bill_id: 'bill1' }],
        voteResults: [{ id: '1', legislator_id: 'leg1', vote_id: 'vote1', vote_type: '1' }],
        bills: [{ id: 'bill1', title: 'Bill 1', sponsor_id: 'leg1' }],
        legislators: [{ id: 'leg1', name: 'John Doe' }]
      };

      const mockProcessedData = {
        legislatorSupport: [{ id: 'leg1', name: 'John Doe', num_supported_bills: 1, num_opposed_bills: 0 }],
        billSupport: [{ bill_id: 'bill1', title: 'Bill 1', supporter_count: 1, opposer_count: 0, sponsor: 'John Doe' }]
      };

      // Mock dos métodos
      CsvService.readMultipleCsvFiles.mockResolvedValue([
        mockInputData.votes,
        mockInputData.voteResults,
        mockInputData.bills,
        mockInputData.legislators
      ]);

      DataValidator.validateAllInputData.mockReturnValue(true);

      const mockVoteProcessingService = require('../../src/services/voteProcessingService');
      mockVoteProcessingService.prototype.processVotingData.mockResolvedValue(mockProcessedData);

      CsvService.writeCsvFile.mockResolvedValue();

      // Executa o teste
      await app.run();

      // Verifica se todos os métodos foram chamados
      expect(CsvService.readMultipleCsvFiles).toHaveBeenCalled();
      expect(DataValidator.validateAllInputData).toHaveBeenCalledWith(
        mockInputData.votes,
        mockInputData.voteResults,
        mockInputData.bills,
        mockInputData.legislators
      );
      expect(mockVoteProcessingService.prototype.processVotingData).toHaveBeenCalledWith(
        mockInputData.votes,
        mockInputData.voteResults,
        mockInputData.bills,
        mockInputData.legislators
      );
      expect(CsvService.writeCsvFile).toHaveBeenCalledTimes(2);
    });

    test('deve falhar se validação falhar', async () => {
      const mockInputData = {
        votes: [],
        voteResults: [],
        bills: [],
        legislators: []
      };

      CsvService.readMultipleCsvFiles.mockResolvedValue([
        mockInputData.votes,
        mockInputData.voteResults,
        mockInputData.bills,
        mockInputData.legislators
      ]);

      DataValidator.validateAllInputData.mockImplementation(() => {
        throw new Error('Validation failed');
      });

      // Mock do process.exit para evitar que o teste termine
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await app.run();

      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });

    test('deve falhar se leitura de arquivos falhar', async () => {
      CsvService.readMultipleCsvFiles.mockRejectedValue(new Error('File read error'));

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await app.run();

      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });

    test('deve falhar se processamento de votos falhar', async () => {
      const mockInputData = {
        votes: [],
        voteResults: [],
        bills: [],
        legislators: []
      };

      CsvService.readMultipleCsvFiles.mockResolvedValue([
        mockInputData.votes,
        mockInputData.voteResults,
        mockInputData.bills,
        mockInputData.legislators
      ]);

      DataValidator.validateAllInputData.mockReturnValue(true);

      const mockVoteProcessingService = require('../../src/services/voteProcessingService');
      mockVoteProcessingService.prototype.processVotingData.mockRejectedValue(new Error('Processing failed'));

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await app.run();

      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });

    test('deve falhar se escrita de arquivos falhar', async () => {
      const mockInputData = {
        votes: [],
        voteResults: [],
        bills: [],
        legislators: []
      };

      const mockProcessedData = {
        legislatorSupport: [],
        billSupport: []
      };

      CsvService.readMultipleCsvFiles.mockResolvedValue([
        mockInputData.votes,
        mockInputData.voteResults,
        mockInputData.bills,
        mockInputData.legislators
      ]);

      DataValidator.validateAllInputData.mockReturnValue(true);

      const mockVoteProcessingService = require('../../src/services/voteProcessingService');
      mockVoteProcessingService.prototype.processVotingData.mockResolvedValue(mockProcessedData);

      CsvService.writeCsvFile.mockRejectedValue(new Error('Write failed'));

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await app.run();

      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });
  });

  describe('loadInputData', () => {
    test('deve carregar todos os dados de entrada', async () => {
      const mockData = [
        [{ id: 'vote1' }],
        [{ id: 'result1' }],
        [{ id: 'bill1' }],
        [{ id: 'leg1' }]
      ];

      CsvService.readMultipleCsvFiles.mockResolvedValue(mockData);

      const result = await app.loadInputData();

      expect(result).toEqual({
        votes: mockData[0],
        voteResults: mockData[1],
        bills: mockData[2],
        legislators: mockData[3]
      });

      expect(CsvService.readMultipleCsvFiles).toHaveBeenCalledWith([
        'data/input/votes.csv',
        'data/input/vote_results.csv',
        'data/input/bills.csv',
        'data/input/legislators.csv'
      ]);
    });
  });

  describe('saveOutputData', () => {
    test('deve salvar dados processados', async () => {
      const mockProcessedData = {
        legislatorSupport: [{ id: 'leg1', name: 'John Doe', num_supported_bills: 1, num_opposed_bills: 0 }],
        billSupport: [{ bill_id: 'bill1', title: 'Bill 1', supporter_count: 1, opposer_count: 0, sponsor: 'John Doe' }]
      };

      CsvService.writeCsvFile.mockResolvedValue();

      await app.saveOutputData(mockProcessedData);

      expect(CsvService.writeCsvFile).toHaveBeenCalledTimes(2);
      expect(CsvService.writeCsvFile).toHaveBeenCalledWith(
        'data/output/legislators-support-oppose-count.csv',
        expect.any(Array),
        mockProcessedData.legislatorSupport
      );
      expect(CsvService.writeCsvFile).toHaveBeenCalledWith(
        'data/output/bills.csv',
        expect.any(Array),
        mockProcessedData.billSupport
      );
    });
  });
});
