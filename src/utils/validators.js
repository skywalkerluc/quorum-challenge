/**
 * Validadores para dados de entrada
 */
const logger = require('./logger');

class DataValidator {
  /**
   * Valida estrutura de dados de votos
   */
  static validateVotesData(votesData) {
    if (!Array.isArray(votesData)) {
      throw new Error('Votes data must be an array');
    }

    for (const vote of votesData) {
      if (!vote.id || !vote.bill_id) {
        throw new Error('Invalid vote data: missing id or bill_id');
      }
    }

    logger.debug(`Validated ${votesData.length} votes`);
    return true;
  }

  /**
   * Valida estrutura de dados de resultados de votação
   */
  static validateVoteResultsData(voteResultsData) {
    if (!Array.isArray(voteResultsData)) {
      throw new Error('Vote results data must be an array');
    }

    for (const result of voteResultsData) {
      if (!result.id || !result.legislator_id || !result.vote_id || !result.vote_type) {
        throw new Error('Invalid vote result data: missing required fields');
      }
      
      if (!['1', '2'].includes(result.vote_type)) {
        throw new Error(`Invalid vote type: ${result.vote_type}. Must be '1' or '2'`);
      }
    }

    logger.debug(`Validated ${voteResultsData.length} vote results`);
    return true;
  }

  /**
   * Valida estrutura de dados de projetos de lei
   */
  static validateBillsData(billsData) {
    if (!Array.isArray(billsData)) {
      throw new Error('Bills data must be an array');
    }

    for (const bill of billsData) {
      if (!bill.id || !bill.title || !bill.sponsor_id) {
        throw new Error('Invalid bill data: missing id, title, or sponsor_id');
      }
    }

    logger.debug(`Validated ${billsData.length} bills`);
    return true;
  }

  /**
   * Valida estrutura de dados de legisladores
   */
  static validateLegislatorsData(legislatorsData) {
    if (!Array.isArray(legislatorsData)) {
      throw new Error('Legislators data must be an array');
    }

    for (const legislator of legislatorsData) {
      if (!legislator.id || !legislator.name) {
        throw new Error('Invalid legislator data: missing id or name');
      }
    }

    logger.debug(`Validated ${legislatorsData.length} legislators`);
    return true;
  }

  /**
   * Valida todos os dados de entrada
   */
  static validateAllInputData(votesData, voteResultsData, billsData, legislatorsData) {
    this.validateVotesData(votesData);
    this.validateVoteResultsData(voteResultsData);
    this.validateBillsData(billsData);
    this.validateLegislatorsData(legislatorsData);
    
    logger.info('All input data validated successfully');
    return true;
  }
}

module.exports = DataValidator;
