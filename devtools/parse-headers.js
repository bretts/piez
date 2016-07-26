(function(global) {
    'use strict';

    global.ParseHeaders = function(http_transaction, page, display_mode) {
        if(http_transaction.response.status == 304 && (http_transaction.request.url).indexOf('.js') == -1) {
            page.localCacheEnabled = true;
        }
        else if(/x-im-original-size/i.test(JSON.stringify(http_transaction.response.headers))) {
            page.totalIMImagesTransformed += 1;
            ParseImHeaders(http_transaction, page, display_mode);
        }
        else if(/akamai image server/i.test(JSON.stringify(http_transaction.response.headers))) {
            page.totalICImagesTransformed += 1;
            ParseIcHeaders(http_transaction, page);
        }
    };
})(this);