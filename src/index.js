/**
 * Aplicação principal para processamento de dados de votação legislativa
 * 
 * Este script processa dados de votação de projetos de lei e gera relatórios
 * de suporte e oposição para legisladores e projetos.
 */
const CsvService = require('./services/csvService');
const VoteProcessingService = require('./services/voteProcessingService');
const DataValidator = require('./utils/validators');
const logger = require('./utils/logger');
const { PATHS, CSV_HEADERS } = require('./config/constants');

class VoteProcessorApp {
  constructor() {
    this.csvService = CsvService;
    this.voteProcessingService = new VoteProcessingService();
  }

  /**
   * Executa o processamento completo dos dados
   */
  async run() {
    try {
      logger.info('Starting vote processing application');

      // Carrega dados de entrada
      const inputData = await this.loadInputData();
      
      // Valida dados de entrada
      DataValidator.validateAllInputData(
        inputData.votes,
        inputData.voteResults,
        inputData.bills,
        inputData.legislators
      );

      // Processa dados de votação
      const processedData = await this.voteProcessingService.processVotingData(
        inputData.votes,
        inputData.voteResults,
        inputData.bills,
        inputData.legislators
      );

      // Salva dados processados
      await this.saveOutputData(processedData);

      logger.info('Vote processing application completed successfully');
      console.log('✅ Arquivos CSV gerados com sucesso!');
      console.log(`📊 Processados ${processedData.legislatorSupport.length} legisladores`);
      console.log(`📋 Processados ${processedData.billSupport.length} projetos de lei`);

    } catch (error) {
      logger.error('Application failed', { error: error.message, stack: error.stack });
      console.error('❌ Erro ao processar dados:', error.message);
      process.exit(1);
    }
  }

  /**
   * Carrega todos os dados de entrada
   */
  async loadInputData() {
    logger.info('Loading input data files');
    
    const filePaths = [
      PATHS.INPUT.VOTES,
      PATHS.INPUT.VOTE_RESULTS,
      PATHS.INPUT.BILLS,
      PATHS.INPUT.LEGISLATORS
    ];

    const [votes, voteResults, bills, legislators] = await this.csvService.readMultipleCsvFiles(filePaths);

    return {
      votes,
      voteResults,
      bills,
      legislators
    };
  }

  /**
   * Salva dados processados em arquivos CSV
   */
  async saveOutputData(processedData) {
    logger.info('Saving output data files');

    const outputPromises = [
      this.csvService.writeCsvFile(
        PATHS.OUTPUT.LEGISLATORS,
        CSV_HEADERS.LEGISLATORS,
        processedData.legislatorSupport
      ),
      this.csvService.writeCsvFile(
        PATHS.OUTPUT.BILLS,
        CSV_HEADERS.BILLS,
        processedData.billSupport
      )
    ];

    await Promise.all(outputPromises);
    logger.info('Output data files saved successfully');
  }
}

// Executa a aplicação
if (require.main === module) {
  const app = new VoteProcessorApp();
  app.run();
}

module.exports = VoteProcessorApp;