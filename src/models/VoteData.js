/**
 * Modelo para dados de votação
 */
class VoteData {
  constructor(voteId, billId) {
    this.voteId = voteId;
    this.billId = billId;
    this.supporterCount = 0;
    this.opposerCount = 0;
    this.title = null;
    this.sponsorId = null;
    this.sponsorName = 'Unknown';
  }

  /**
   * Adiciona um voto de apoio
   */
  addSupportVote() {
    this.supporterCount++;
  }

  /**
   * Adiciona um voto de oposição
   */
  addOpposeVote() {
    this.opposerCount++;
  }

  /**
   * Define detalhes do projeto de lei
   */
  setBillDetails(title, sponsorId) {
    this.title = title;
    this.sponsorId = sponsorId;
  }

  /**
   * Define o nome do patrocinador
   */
  setSponsorName(sponsorName) {
    this.sponsorName = sponsorName;
  }

  /**
   * Converte para formato de saída de projetos de lei
   */
  toBillOutput() {
    return {
      bill_id: this.billId,
      title: this.title,
      supporter_count: this.supporterCount,
      opposer_count: this.opposerCount,
      sponsor: this.sponsorName
    };
  }
}

module.exports = VoteData;
