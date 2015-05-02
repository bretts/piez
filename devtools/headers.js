function parseResult(request, page) {
	if(request.response.status == 304 && (request.request.url).indexOf('.js') == -1) {
		page.localCacheEnabled = true;
	}
	else if((JSON.stringify(request.response.headers).indexOf('X-IM-Original-Size') != -1)){
		page.totalIMImagesTransformed += 1;
		parseIMHeaders(request, page);
		 	
	}	
	else if(JSON.stringify(request.response.headers).indexOf('Akamai Image Server') != -1)
	{
		page.totalICImagesTransformed += 1;
		parseICHeaders(request, page);
	}
}

function parseIMHeaders(request, page) {
	var res = {};	
	res['url'] = request.request.url;	
  		
	request.response.headers.forEach(function(header) {
		if(header.name == "X-IM-Original-Size"){
			res['orgsize'] = header.value;
			page.totalOriginalSize += parseInt(header.value);
		}
		else if(header.name == "Content-Length") {
			res['contlen'] = header.value;
			page.totalImTransformSize += parseInt(header.value);
		}
		else if(header.name == "Content-Type") {
			res['contype'] = header.value;
		}
		else if(header.name == "X-IM-File-Name") {
			res['filename'] = header.value;
		}
		else if(header.name == "X-IM-Pixel-Density") {
			res['pixelDensity'] = header.value;
		}
		else if(header.name == "X-IM-Original-Width") {
			res['originalWidth'] = header.value;
		}
		else if(header.name == "X-IM-Encoding-Quality") {
			res['encQuality'] = header.value;
		}
		
	});
  	page.imDownloadDetails.push(res);
}

function parseICHeaders(request, page) {
	var res = {}
	res['url'] = request.request.url;

	request.response.headers.forEach(function(header) {
		if(header.name == "Content-Type") {
			res['contype'] = (header.value).split(';')[0];
		}
	});
	page.icDownloadDetails.push(res);
}

