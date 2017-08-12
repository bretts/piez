(function(global) {
	'use strict';

	global.parseNonImOrIcImageHeaders = function(http_transaction, page) {
			var res = {};
			res.url = http_transaction.request.url;

			http_transaction.response.headers.forEach(function(header) {
				if (/content-length/i.test(header.name)) {
					res.contlen = header.value;
					if (res.contlen) {
						page.totalNonImOrIcSize += parseInt(res.contlen);
					}
				}
				else if (/content-type/i.test(header.name)) {
					res.contype = (header.value).split(';')[0];
				}
			});
			page.nonImOrIcImageDetails.push(res);
		};
})(this);