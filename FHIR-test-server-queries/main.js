const axios = require('axios');
const util = require('util');

const baseUrl = 'https://r4.ontoserver.csiro.au/fhir';
const sprainedAnkleCode = 44465007;
const ankleLigamentInjuryCode = 240019006;
const system = 'http://snomed.info/sct';
const format = 'json';
const snomedCodeLookupURL = `${baseUrl}/CodeSystem/$lookup?system=${system}&code=${sprainedAnkleCode}&_format=${format}`;
const snomedValueSetExpandURL = `${baseUrl}/ValueSet/$expand?url=${system}?fhir_vs=isa/${ankleLigamentInjuryCode}`;

const getSnomedCodeLookup = async (url, snomedCode) => {
    const response = await axios.get(url);
    // We can retrieve server info from the response headers of any request
    console.log('~~~~~ Server/data version: ' + response.headers['x-powered-by'] + ' ~~~~~');
    console.log();
    console.log(`~~~~~ Snomed code ${snomedCode} name: ${util.inspect(response.data.parameter[0].valueString, false, null, true)} ~~~~~`);
    console.log();
}

const getSnomedValueSet = async (url, valueSetName) => {
    const response = await axios.get(url);
    const children = response.data.expansion.contains;
    console.log(`~~~~~ types of ${valueSetName} ~~~~~`);
    children.forEach(child => console.log(child.display));
    console.log();
}

getSnomedCodeLookup(snomedCodeLookupURL, sprainedAnkleCode);
getSnomedValueSet(snomedValueSetExpandURL, 'lesion of ligaments of the ankle region');
