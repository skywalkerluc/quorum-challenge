/**
 * Constantes do sistema de processamento de votos
 */
module.exports = {
  VOTE_TYPES: {
    SUPPORT: '1',
    OPPOSE: '2'
  },
  
  PATHS: {
    INPUT: {
      VOTES: 'data/input/votes.csv',
      VOTE_RESULTS: 'data/input/vote_results.csv',
      BILLS: 'data/input/bills.csv',
      LEGISLATORS: 'data/input/legislators.csv'
    },
    OUTPUT: {
      LEGISLATORS: 'data/output/legislators-support-oppose-count.csv',
      BILLS: 'data/output/bills.csv'
    }
  },
  
  CSV_HEADERS: {
    LEGISLATORS: [
      { id: 'id', title: 'id' },
      { id: 'name', title: 'name' },
      { id: 'num_supported_bills', title: 'num_supported_bills' },
      { id: 'num_opposed_bills', title: 'num_opposed_bills' }
    ],
    BILLS: [
      { id: 'bill_id', title: 'id' },
      { id: 'title', title: 'title' },
      { id: 'supporter_count', title: 'supporter_count' },
      { id: 'opposer_count', title: 'opposer_count' },
      { id: 'sponsor', title: 'primary_sponsor' }
    ]
  }
};
