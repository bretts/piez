(function(global) {
	'use strict';

	global.parseIcHeaders = function(http_transaction, page) {
		var res = {};
		res.url = http_transaction.request.url;

		http_transaction.response.headers.forEach(function(header) {
			if (/^x-image-server-original-size$/i.test(header.name)) {
				res.orgsize = header.value;
				page.totalIcOriginalSize += parseInt(header.value);
			} else if (/^content-length$/i.test(header.name)) {
				res.contlen = header.value;
				page.totalIcTransformSize += parseInt(header.value);
			} else if (/^content-type$/i.test(header.name)) {
				res.contype = (header.value).split(';')[0];
			}
		});
		page.icDownloadDetails.push(res);
	};

	global.parseImHeaders = function(http_transaction, page, display_mode) {
		var res = {};
		res.url = http_transaction.request.url;
		res.contlen = http_transaction.response.content;
		// Sum of video contentl
		
		var details = JSON.stringify(page.imDownloadDetails);
		if(details.indexOf(res.url) < 0){
			page.totalIMImagesTransformed += 1;
			extractImHeaders(http_transaction, page, res);
			page.imDownloadDetails.push(res);
		}	
	};

	global.extractImHeaders = function(http_transaction, page, res) {
		var headers = http_transaction.response.headers;
		// Separate finds to process headers that are depended on first
		let contypeObj    = headers.find(header => /^content-type$/i.test(header.name));
		let filenameObj   = headers.find(header => /^x-im-file-name$/i.test(header.name));
		let pixelDensObj  = headers.find(header => /^x-im-pixel-density$/i.test(header.name));
		let origWidthObj  = headers.find(header => /^x-im-original-width$/i.test(header.name));
		let encQualityObj = headers.find(header => /^x-im-encoding-quality$/i.test(header.name));
		let orgsizeObj    = headers.find(header => /^x-im-original-size$/i.test(header.name));
		let contlenObj    = headers.find(header => /^content-length$/i.test(header.name))
		// Unfound objects set to empty string to avoid errors
		res.contype 	  = (contypeObj !== undefined) ? contypeObj.value : "";
		res.filename 	  = (filenameObj !== undefined) ? filenameObj.value : "";
		res.pixelDensity  = (pixelDensObj !== undefined) ? pixelDensObj.value : "";
		res.originalWidth = (origWidthObj !== undefined) ? origWidthObj.value : "";
		let encQuality    = (encQualityObj !== undefined) ? encQualityObj.value : "";
		if (parseInt(encQuality) < 0 || parseInt(encQuality) > 100) {
			res.encQuality = 'IMG-2834';
		} else {
			res.encQuality = encQuality;
		}
		res.orgsize = (orgsizeObj !== undefined) ? orgsizeObj.value : undefined;
		if(res.orgsize !== undefined) {
			if (/image/i.test(res.contlen.mimeType) || /image/i.test(res.contype)){
				page.totalImOriginalSize += parseFloat(res.orgsize);
				page.totalImTransformed++;
			} else if (/video/i.test(res.contlen.mimeType) || /video/i.test(res.contype)){
				page.totalVidOriginalSize += parseFloat(res.orgsize);
				page.totalVidTransformed++;
			}
		}
		res.contlen = (contlenObj !== undefined) ? contlenObj.value : undefined;
		if(res.contlen !== undefined) {
			if (/image/i.test(res.contlen.mimeType) || /image/i.test(res.contype)){
				page.totalImTransformSize += parseFloat(res.contlen);
			} else if (/video/i.test(res.contlen.mimeType) || /video/i.test(res.contype)){
				let contRangeObj = headers.find(header => /^content-range$/i.test(header.name));
				// Use content range for range requests, content length for full video requests
				if(contRangeObj !== undefined) {
					let contRange = contRangeObj.value;
					res.contlen = contRange.split('/')[1];
				}
				page.totalVidTransformSize += parseFloat(res.contlen);
			}
		}
	};

	global.parseNonImOrIcImageHeaders = function(http_transaction, page) {
		var res = {};
		res.url = http_transaction.request.url;

		http_transaction.response.headers.forEach(function(header) {
			if (/^content-length$/i.test(header.name)) {
				res.contlen = header.value;
				if (res.contlen) {
					page.totalNonImOrIcSize += parseInt(res.contlen);
				}
			} else if (/^content-type$/i.test(header.name)) {
				res.contype = (header.value).split(';')[0];
			}
		});
		page.nonImOrIcImageDetails.push(res);
	};
})(this);