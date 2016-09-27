(function(global) {
    'use strict';

    global.ParseHeaders = function(http_transaction, page, display_mode) {
        if (display_mode === 'piezModeA2') { //A2 does parsing separate from this
            return;
        }
        if(http_transaction.response.status == 304 && (http_transaction.request.url).indexOf('.js') == -1) {
            page.localCacheEnabled = true;
        }

        if(/x-im-original-size/i.test(JSON.stringify(http_transaction.response.headers))) {
            page.totalIMImagesTransformed += 1;
            ParseImHeaders(http_transaction, page, display_mode);
        }
        else if(/akamai image server/i.test(JSON.stringify(http_transaction.response.headers))) {
            page.totalICImagesTransformed += 1;
            ParseIcHeaders(http_transaction, page);
        }
        else {
            for(var i=0; i<http_transaction.response.headers.length; i++) {
                if(/content-type/i.test(http_transaction.response.headers[i].name)) {
                    if(/image/i.test(http_transaction.response.headers[i].value)) {
                        page.totalNonImImages += 1;
                        ParseNonImOrIcImageHeaders(http_transaction, page);
                    }
                }
            }
        }
    };

})(this);