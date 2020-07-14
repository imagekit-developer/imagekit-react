export function parseURL(url) {
	let parser;
	if(typeof document === 'undefined'){
		parser = parseUrlInNode(url);
	}else{
		parser = parseUrlInBrowser(url);
	}

	return {
		protocol: parser.protocol,
		host: parser.host,
		hostname: parser.hostname,
		port: parser.port,
		pathname: parser.pathname,
		search: parser.search,
		searchObject: parser.searchObject,
		hash: parser.hash
	};
}

function parseUrlInBrowser(urlToParse){
	var parser = document.createElement('a'),searchObject = {}, queries, split, i;
	// Let the browser do the work
	parser.href = urlToParse;
	// Convert query string to object
	queries = parser.search.replace(/^\?/, '').split('&');
	for( i = 0; i < queries.length; i++ ) {
		split = queries[i].split('=');
		searchObject[split[0]] = split[1];
	}
	parser.searchObject = searchObject;
	return parser;
}

function parseUrlInNode(urlToParse){
	var url = require('url');

	var parser = new URL(urlToParse);
	var searchObject = {}, queries, split, i;
	
	// Convert query string to object
	queries = parser.search.replace(/^\?/, '').split('&');
	for( i = 0; i < queries.length; i++ ) {
		split = queries[i].split('=');
		searchObject[split[0]] = split[1];
	}
	parser.searchObject = searchObject;
	return parser;
}