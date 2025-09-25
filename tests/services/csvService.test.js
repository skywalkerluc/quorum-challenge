/**
 * Testes para o serviço CSV
 */
const fs = require('fs');
const path = require('path');
const CsvService = require('../../src/services/csvService');

// Mock do fs
jest.mock('fs');
jest.mock('csv-parser');
jest.mock('csv-writer');

describe('CsvService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readCsvFile', () => {
    test('deve ler arquivo CSV com sucesso', async () => {
      const mockData = [
        { id: '1', name: 'John' },
        { id: '2', name: 'Jane' }
      ];

      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            mockData.forEach(callback);
          } else if (event === 'end') {
            callback();
          }
          return mockStream;
        })
      };

      fs.createReadStream.mockReturnValue(mockStream);
      fs.existsSync.mockReturnValue(true);

      const result = await CsvService.readCsvFile('test.csv');

      expect(result).toEqual(mockData);
      expect(fs.createReadStream).toHaveBeenCalledWith('test.csv');
    });

    test('deve rejeitar se arquivo não existir', async () => {
      fs.existsSync.mockReturnValue(false);

      await expect(CsvService.readCsvFile('nonexistent.csv')).rejects.toThrow('File not found: nonexistent.csv');
    });

    test('deve rejeitar em caso de erro de leitura', async () => {
      const mockStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn((event, callback) => {
          if (event === 'error') {
            callback(new Error('Read error'));
          }
          return mockStream;
        })
      };

      fs.createReadStream.mockReturnValue(mockStream);
      fs.existsSync.mockReturnValue(true);

      await expect(CsvService.readCsvFile('test.csv')).rejects.toThrow('Error reading file test.csv: Read error');
    });
  });

  describe('writeCsvFile', () => {
    test('deve escrever arquivo CSV com sucesso', async () => {
      const mockCsvWriter = {
        writeRecords: jest.fn().mockResolvedValue()
      };

      const createCsvWriter = require('csv-writer').createObjectCsvWriter;
      createCsvWriter.mockReturnValue(mockCsvWriter);

      const headers = [{ id: 'id', title: 'ID' }];
      const records = [{ id: '1' }, { id: '2' }];

      await CsvService.writeCsvFile('output.csv', headers, records);

      expect(createCsvWriter).toHaveBeenCalledWith({
        path: 'output.csv',
        header: headers
      });
      expect(mockCsvWriter.writeRecords).toHaveBeenCalledWith(records);
    });

    test('deve rejeitar em caso de erro de escrita', async () => {
      const mockCsvWriter = {
        writeRecords: jest.fn().mockRejectedValue(new Error('Write error'))
      };

      const createCsvWriter = require('csv-writer').createObjectCsvWriter;
      createCsvWriter.mockReturnValue(mockCsvWriter);

      const headers = [{ id: 'id', title: 'ID' }];
      const records = [{ id: '1' }];

      await expect(CsvService.writeCsvFile('output.csv', headers, records)).rejects.toThrow('Error writing file output.csv: Write error');
    });
  });

  describe('ensureDirectoryExists', () => {
    test('deve criar diretório se não existir', () => {
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation(() => {});

      CsvService.ensureDirectoryExists('/path/to/file.csv');

      expect(fs.mkdirSync).toHaveBeenCalledWith('/path/to', { recursive: true });
    });

    test('deve não criar diretório se já existir', () => {
      fs.existsSync.mockReturnValue(true);

      CsvService.ensureDirectoryExists('/path/to/file.csv');

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('readMultipleCsvFiles', () => {
    test('deve ler múltiplos arquivos em paralelo', async () => {
      const mockData1 = [{ id: '1' }];
      const mockData2 = [{ id: '2' }];

      const mockStream1 = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn((event, callback) => {
          if (event === 'data') mockData1.forEach(callback);
          if (event === 'end') callback();
          return mockStream1;
        })
      };

      const mockStream2 = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn((event, callback) => {
          if (event === 'data') mockData2.forEach(callback);
          if (event === 'end') callback();
          return mockStream2;
        })
      };

      fs.createReadStream
        .mockReturnValueOnce(mockStream1)
        .mockReturnValueOnce(mockStream2);
      fs.existsSync.mockReturnValue(true);

      const results = await CsvService.readMultipleCsvFiles(['file1.csv', 'file2.csv']);

      expect(results).toEqual([mockData1, mockData2]);
    });

    test('deve rejeitar se qualquer arquivo falhar', async () => {
      const mockStream1 = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn((event, callback) => {
          if (event === 'data') [{ id: '1' }].forEach(callback);
          if (event === 'end') callback();
          return mockStream1;
        })
      };

      const mockStream2 = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn((event, callback) => {
          if (event === 'error') callback(new Error('File 2 error'));
          return mockStream2;
        })
      };

      fs.createReadStream
        .mockReturnValueOnce(mockStream1)
        .mockReturnValueOnce(mockStream2);
      fs.existsSync.mockReturnValue(true);

      await expect(CsvService.readMultipleCsvFiles(['file1.csv', 'file2.csv'])).rejects.toThrow();
    });
  });
});
