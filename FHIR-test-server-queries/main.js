const axios = require("axios");
const util = require("util");

const baseUrl = "https://r4.ontoserver.csiro.au/fhir";
const codeToLookup = 44465007; // Code for sprained ankle
const anotherCodeToLookup = 240019006; // Code for ankle ligament injury
const system = "http://snomed.info/sct";
const format = "json";
const snomedCodeLookupURL = `${baseUrl}/CodeSystem/$lookup?system=${system}&code=${codeToLookup}&_format=${format}`;
const snomedValueSetExpandURL = `${baseUrl}/ValueSet/$expand?url=${system}?fhir_vs=isa/${anotherCodeToLookup}`;

const getSnomedCodeLookup = async (url, snomedCode) => {
	const response = await axios.get(url);
	// We can retrieve server info from the response headers of any request
	console.log(
		"~~~~~ Server/data version: " + response.headers["x-powered-by"] + " ~~~~~"
	);
	console.log();
	console.log(
		`~~~~~ Snomed code ${snomedCode} name: ${util.inspect(
			response.data.parameter[0].valueString,
			false,
			null,
			true
		)} ~~~~~`
	);
	console.log();
};

const getSnomedValueSet = async (url, valueSetName) => {
	const response = await axios.get(url);
	const children = response.data.expansion.contains;
	console.log(`~~~~~ types of ${valueSetName} ~~~~~`);
	children.forEach((child) => console.log(child.display));
	console.log();
};

getSnomedCodeLookup(snomedCodeLookupURL, codeToLookup);
getSnomedValueSet(
	snomedValueSetExpandURL,
	"lesion of ligaments of the ankle region"
);
