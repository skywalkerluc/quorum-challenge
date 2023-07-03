# Quorum

## Coding Challenge

### Requirements

- Node (12.x or superior)
- NPM (similar version to Node)

### Setup

```bash
npm install
```

### Execution

```bash
npm run start
```

Input files should be under /data/input/ folder structure, named as "bills.csv", "legislators.csv", "vote_results.csv" and "votes.csv". Otherwise, you should see a console error. Output files should be generated under /data/output, named "legislators-support-oppose-count.csv" and "bills.csv". Feel free to update files from "input" folder and run again, or even updating output files. It should overwrite it with no problems.

### Challenge submission answers

1. Discuss your solution’s time complexity. What tradeoffs did you make?  
   **R: Time complexity for this solution is mainly linear, O(N). It's based on the number of rows in the CSV files, because each file is processed once and the operations (for each line) is constant. The usage of Map can increase some logarithmic complexity, but it's an acceptable tradeoff, considering the need for faster searches for specific IDs compared to array searching.**

2. How would you change your solution to account for future columns that might be requested, such as “Bill Voted On Date” or “Co-Sponsors”?  
   **R: Probably would need to change "attachBillDetails" function, adding new columns to the object "voteData". Also, I'd need to update "writeCsvFile" under "src/index.js" to include new headers for the new columns.**

- How would you change your solution if instead of receiving CSVs of data, you were given a list of legislators or bills that you should generate a CSV for?  
  **R: It would depend on the format of the input. Assuming a similar object schema to what I proposed after files processing, it would just require a function to process an object array, avoiding the "readCsv" step. I'd still use the "writeCsvFile" to process the output.**

- How long did you spend working on the assignment?  
  **R: Something close to 3h to get initial version (single file solution). Refactored for more 2h.**
