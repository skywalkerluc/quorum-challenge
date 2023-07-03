const SUPPORT_VOTE_TYPE = "1";

const initializeVotes = (votesData) => {
  const votes = new Map();
  const storeBillVotes = {};

  for (const data of votesData) {
    votes.set(data.id, {
      bill_id: data.bill_id,
      supporter_count: 0,
      opposer_count: 0,
    });
    storeBillVotes[data.bill_id] = data.id;
  }

  return { votes, storeBillVotes };
};

const countVotes = (votes, voteResultsData) => {
  const legislatorVotes = new Map();

  for (const data of voteResultsData) {
    const voteData = votes.get(data.vote_id);

    if (data.vote_type === SUPPORT_VOTE_TYPE) {
      voteData.supporter_count++;
    } else {
      voteData.opposer_count++;
    }

    let legislatorData = legislatorVotes.get(data.legislator_id) || {
      num_supported_bills: 0,
      num_opposed_bills: 0,
    };
    if (data.vote_type === SUPPORT_VOTE_TYPE) {
      legislatorData.num_supported_bills++;
    } else {
      legislatorData.num_opposed_bills++;
    }
    legislatorVotes.set(data.legislator_id, legislatorData);
  }

  return legislatorVotes;
};

const attachBillDetails = (votes, storeBillVotes, billsData) => {
  const storeSponsorVote = {};

  for (const data of billsData) {
    const voteId = storeBillVotes[data.id];
    const voteData = votes.get(voteId);
    voteData.title = data.title;
    voteData.sponsor_id = data.sponsor_id;
    voteData.sponsor = "Unknown";
    storeSponsorVote[data.sponsor_id] = voteId;
  }

  return storeSponsorVote;
};

const compileLegislatorSupport = (
  legislatorsData,
  legislatorVotes,
  storeSponsorVote,
  votes
) => {
  const legislatorSupport = [];

  for (const data of legislatorsData) {
    const voteId = storeSponsorVote[data.id];
    if (voteId) {
      const voteData = votes.get(voteId);
      voteData.sponsor = data.name;
    }

    const legislatorData = legislatorVotes.get(data.id);
    const legislatorInfo = {
      id: data.id,
      name: data.name,
      num_supported_bills: 0,
      num_opposed_bills: 0,
    };
    if (legislatorData) {
      legislatorInfo.num_supported_bills = legislatorData.num_supported_bills;
      legislatorInfo.num_opposed_bills = legislatorData.num_opposed_bills;
    }
    legislatorSupport.push(legislatorInfo);
  }

  return legislatorSupport;
};

const processVotes = (
  votesData,
  voteResultsData,
  billsData,
  legislatorsData
) => {
  const { votes, storeBillVotes } = initializeVotes(votesData);
  const legislatorVotes = countVotes(votes, voteResultsData);
  const storeSponsorVote = attachBillDetails(votes, storeBillVotes, billsData);
  const legislatorSupport = compileLegislatorSupport(
    legislatorsData,
    legislatorVotes,
    storeSponsorVote,
    votes
  );
  const billSupport = [...votes.values()];

  return {
    legislatorSupport,
    billSupport,
  };
};

module.exports = { processVotes };
