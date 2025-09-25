/**
 * Modelo para dados de legisladores
 */
class LegislatorData {
  constructor(legislatorId, name) {
    this.legislatorId = legislatorId;
    this.name = name;
    this.supportedBillsCount = 0;
    this.opposedBillsCount = 0;
  }

  /**
   * Adiciona um voto de apoio
   */
  addSupportVote() {
    this.supportedBillsCount++;
  }

  /**
   * Adiciona um voto de oposição
   */
  addOpposeVote() {
    this.opposedBillsCount++;
  }

  /**
   * Converte para formato de saída de legisladores
   */
  toLegislatorOutput() {
    return {
      id: this.legislatorId,
      name: this.name,
      num_supported_bills: this.supportedBillsCount,
      num_opposed_bills: this.opposedBillsCount
    };
  }
}

module.exports = LegislatorData;
