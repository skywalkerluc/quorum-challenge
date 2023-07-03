const fs = require("fs");
const { readCsvFile, writeCsvFile } = require("./csvHandler");
const { processVotes } = require("./voteProcessor");

const ensureDirectoryExists = (filePath) => {
  const directory = filePath.substring(0, filePath.lastIndexOf("/"));
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

(async () => {
  try {
    const votesData = await readCsvFile("data/input/votes.csv");
    const voteResultsData = await readCsvFile("data/input/vote_results.csv");
    const billsData = await readCsvFile("data/input/bills.csv");
    const legislatorsData = await readCsvFile("data/input/legislators.csv");

    const processedVotes = processVotes(
      votesData,
      voteResultsData,
      billsData,
      legislatorsData
    );

    const legislatorsOutputPath =
      "data/output/legislators-support-oppose-count.csv";
    const billsOutputPath = "data/output/bills.csv";

    ensureDirectoryExists(legislatorsOutputPath);
    ensureDirectoryExists(billsOutputPath);

    await writeCsvFile(
      legislatorsOutputPath,
      [
        { id: "id", title: "id" },
        { id: "name", title: "name" },
        { id: "num_supported_bills", title: "num_supported_bills" },
        { id: "num_opposed_bills", title: "num_opposed_bills" },
      ],
      processedVotes.legislatorSupport
    );

    await writeCsvFile(
      billsOutputPath,
      [
        { id: "bill_id", title: "id" },
        { id: "title", title: "title" },
        { id: "supporter_count", title: "supporter_count" },
        { id: "opposer_count", title: "opposer_count" },
        { id: "sponsor", title: "primary_sponsor" },
      ],
      processedVotes.billSupport
    );

    console.log("CSV files successfully written.");
  } catch (error) {
    console.error("Error processing votes:", error);
  }
})();
