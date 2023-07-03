const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const readCsvFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => data.push(row))
      .on("end", () => resolve(data))
      .on("error", (error) =>
        reject(new Error(`Error reading file ${filePath}: ${error.message}`))
      );
  });
};

const writeCsvFile = async (filePath, headers, records) => {
  const csvWriter = createCsvWriter({ path: filePath, header: headers });
  try {
    await csvWriter.writeRecords(records);
  } catch (error) {
    throw new Error(`Error writing file ${filePath}: ${error.message}`);
  }
};

module.exports = { readCsvFile, writeCsvFile };
