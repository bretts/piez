(function(global) {
    'use strict';

    global.parseIcHeaders = function(http_transaction, page) {
            var res = {};
            res.url = http_transaction.request.url;

            http_transaction.response.headers.forEach(function(header) {
                if(/x-image-server-original-size/i.test(header.name)) {
                    res.orgsize = header.value;
                    page.totalOriginalSize += parseInt(header.value);
                }
                else if(/content-length/i.test(header.name)) {
                    res.contlen = header.value;
                    page.totalIcTransformSize += parseInt(header.value);
                }
                else if(/content-type/i.test(header.name)) {
                    res.contype = (header.value).split(';')[0];
                }
            });
            page.icDownloadDetails.push(res);
        };
})(this);