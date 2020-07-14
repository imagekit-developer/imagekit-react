var Url = require('url-parse'); //supports both browser and node
Url('hostname', {});

export function parseURL(url) {
	let parsedUrl = Url(url);
	let searchObject = {}, queries, split, i;
	
	// Convert query string to object
	queries = parsedUrl.query.replace(/^\?/, '').split('&');
	for( i = 0; i < queries.length; i++ ) {
		split = queries[i].split('=');
		searchObject[split[0]] = split[1];
	}
	return {
		protocol: parsedUrl.protocol,
		host: parsedUrl.host,
		hostname: parsedUrl.hostname,
		port: parsedUrl.port,
		pathname: parsedUrl.pathname,
		search: parsedUrl.query,
		searchObject: searchObject,
		hash: parsedUrl.hash
	};
}
