# FHIR-test-server-queries
For testing API calls to FHIR test servers. Currently, `main.js` can fetch snomed code info, or can get a snomed code value set.

# Usage
1. Clone the repo
2. Run `npm install` in this folder directory
3. Configure what snomed codes you want to retrieve data for by setting the `codeToLookup` and `anotherCodeToLookup` variables in `main.js`.
4. `node main.js` to run the program
