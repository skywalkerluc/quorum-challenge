/**
 * Serviço principal para processamento de dados de votação
 */
const VoteData = require('../models/VoteData');
const LegislatorData = require('../models/LegislatorData');
const { VOTE_TYPES } = require('../config/constants');
const logger = require('../utils/logger');

class VoteProcessingService {
  constructor() {
    this.votes = new Map();
    this.legislators = new Map();
    this.billToVoteMap = new Map();
    this.sponsorToVoteMap = new Map();
  }

  /**
   * Processa todos os dados de votação
   */
  async processVotingData(votesData, voteResultsData, billsData, legislatorsData) {
    logger.info('Starting vote processing', {
      votesCount: votesData.length,
      voteResultsCount: voteResultsData.length,
      billsCount: billsData.length,
      legislatorsCount: legislatorsData.length
    });

    // Inicializa dados de votos
    this.initializeVotes(votesData);
    
    // Processa resultados de votação
    this.processVoteResults(voteResultsData);
    
    // Anexa detalhes dos projetos de lei
    this.attachBillDetails(billsData);
    
    // Compila dados dos legisladores
    const legislatorSupport = this.compileLegislatorSupport(legislatorsData);
    
    // Compila dados dos projetos de lei
    const billSupport = this.compileBillSupport();

    logger.info('Vote processing completed successfully', {
      legislatorSupportCount: legislatorSupport.length,
      billSupportCount: billSupport.length
    });

    return {
      legislatorSupport,
      billSupport
    };
  }

  /**
   * Inicializa dados de votos
   */
  initializeVotes(votesData) {
    logger.debug('Initializing votes data');
    
    for (const vote of votesData) {
      const voteData = new VoteData(vote.id, vote.bill_id);
      this.votes.set(vote.id, voteData);
      this.billToVoteMap.set(vote.bill_id, vote.id);
    }

    logger.debug(`Initialized ${this.votes.size} votes`);
  }

  /**
   * Processa resultados de votação
   */
  processVoteResults(voteResultsData) {
    logger.debug('Processing vote results');
    
    for (const result of voteResultsData) {
      const voteData = this.votes.get(result.vote_id);
      
      if (!voteData) {
        logger.warn('Vote not found for result', { voteId: result.vote_id });
        continue;
      }

      // Processa voto do projeto de lei
      if (result.vote_type === VOTE_TYPES.SUPPORT) {
        voteData.addSupportVote();
      } else {
        voteData.addOpposeVote();
      }

      // Processa voto do legislador
      let legislatorData = this.legislators.get(result.legislator_id);
      if (!legislatorData) {
        // Será preenchido com nome posteriormente
        legislatorData = new LegislatorData(result.legislator_id, '');
        this.legislators.set(result.legislator_id, legislatorData);
      }

      if (result.vote_type === VOTE_TYPES.SUPPORT) {
        legislatorData.addSupportVote();
      } else {
        legislatorData.addOpposeVote();
      }
    }

    logger.debug(`Processed ${voteResultsData.length} vote results`);
  }

  /**
   * Anexa detalhes dos projetos de lei
   */
  attachBillDetails(billsData) {
    logger.debug('Attaching bill details');
    
    for (const bill of billsData) {
      const voteId = this.billToVoteMap.get(bill.id);
      
      if (!voteId) {
        logger.warn('Vote not found for bill', { billId: bill.id });
        continue;
      }

      const voteData = this.votes.get(voteId);
      voteData.setBillDetails(bill.title, bill.sponsor_id);
      
      this.sponsorToVoteMap.set(bill.sponsor_id, voteId);
    }

    logger.debug(`Attached details for ${billsData.length} bills`);
  }

  /**
   * Compila dados de suporte dos legisladores
   */
  compileLegislatorSupport(legislatorsData) {
    logger.debug('Compiling legislator support data');
    
    const legislatorSupport = [];

    for (const legislator of legislatorsData) {
      // Atualiza nome do legislador se já existe
      let legislatorData = this.legislators.get(legislator.id);
      if (legislatorData) {
        legislatorData.name = legislator.name;
      } else {
        legislatorData = new LegislatorData(legislator.id, legislator.name);
        this.legislators.set(legislator.id, legislatorData);
      }

      // Atualiza nome do patrocinador se este legislador patrocinou algum projeto
      const sponsoredVoteId = this.sponsorToVoteMap.get(legislator.id);
      if (sponsoredVoteId) {
        const voteData = this.votes.get(sponsoredVoteId);
        if (voteData) {
          voteData.setSponsorName(legislator.name);
        }
      }

      legislatorSupport.push(legislatorData.toLegislatorOutput());
    }

    logger.debug(`Compiled support data for ${legislatorSupport.length} legislators`);
    return legislatorSupport;
  }

  /**
   * Compila dados de suporte dos projetos de lei
   */
  compileBillSupport() {
    logger.debug('Compiling bill support data');
    
    const billSupport = Array.from(this.votes.values())
      .map(voteData => voteData.toBillOutput());

    logger.debug(`Compiled support data for ${billSupport.length} bills`);
    return billSupport;
  }
}

module.exports = VoteProcessingService;
