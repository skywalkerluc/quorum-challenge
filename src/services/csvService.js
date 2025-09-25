/**
 * Serviço para operações com arquivos CSV
 */
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const logger = require('../utils/logger');

class CsvService {
  /**
   * Lê um arquivo CSV e retorna os dados como array de objetos
   */
  static async readCsvFile(filePath) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        const error = new Error(`File not found: ${filePath}`);
        logger.error('CSV file not found', { filePath });
        return reject(error);
      }

      const data = [];
      const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          logger.info(`Successfully read CSV file`, { 
            filePath, 
            recordCount: data.length 
          });
          resolve(data);
        })
        .on('error', (error) => {
          logger.error('Error reading CSV file', { filePath, error: error.message });
          reject(new Error(`Error reading file ${filePath}: ${error.message}`));
        });
    });
  }

  /**
   * Escreve dados em um arquivo CSV
   */
  static async writeCsvFile(filePath, headers, records) {
    try {
      // Garante que o diretório existe
      this.ensureDirectoryExists(filePath);

      const csvWriter = createCsvWriter({ 
        path: filePath, 
        header: headers 
      });

      await csvWriter.writeRecords(records);
      
      logger.info(`Successfully wrote CSV file`, { 
        filePath, 
        recordCount: records.length 
      });
    } catch (error) {
      logger.error('Error writing CSV file', { filePath, error: error.message });
      throw new Error(`Error writing file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Garante que o diretório do arquivo existe
   */
  static ensureDirectoryExists(filePath) {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
      logger.debug(`Created directory: ${directory}`);
    }
  }

  /**
   * Lê múltiplos arquivos CSV em paralelo
   */
  static async readMultipleCsvFiles(filePaths) {
    const promises = filePaths.map(filePath => this.readCsvFile(filePath));
    
    try {
      const results = await Promise.all(promises);
      logger.info(`Successfully read ${filePaths.length} CSV files`);
      return results;
    } catch (error) {
      logger.error('Error reading multiple CSV files', { error: error.message });
      throw error;
    }
  }
}

module.exports = CsvService;
