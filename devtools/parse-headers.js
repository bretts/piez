(function(global) {
    'use strict';

    global.parseHeaders = function(http_transaction, page, display_mode) {
        if (display_mode === 'piezModeA2') { //A2 does parsing separate from this
            return;
        }

        if(/x-im-original-size/i.test(JSON.stringify(http_transaction.response.headers))) {
            page.totalIMImagesTransformed += 1;
            parseImHeaders(http_transaction, page, display_mode);
        }
        else if(/akamai image server/i.test(JSON.stringify(http_transaction.response.headers))) {
            page.totalICImagesTransformed += 1;
            parseIcHeaders(http_transaction, page);
        }
        else if(/RO_ENABLED\; value=true/i.test(JSON.stringify(http_transaction.response.headers))) {
            if(/akamai resource optimizer/i.test(JSON.stringify(http_transaction.response.headers))) {
                page.totalRoOfflineTransforms += 1;
                // parseRoOfflineHeaders(http_transaction, page, display_mode);
                parseRoHeaders(http_transaction, page, display_mode);
            }
            else {
                page.totalRoInProcessTransforms += 1;
                // parseRoInProcessHeaders(http_transaction, page, display_mode);
                parseRoHeaders(http_transaction, page, display_mode);
            }
        }
        else {
            for(var i=0; i<http_transaction.response.headers.length; i++) {
                if(/content-type/i.test(http_transaction.response.headers[i].name)) {
                    if(/image/i.test(http_transaction.response.headers[i].value)) {
                        if(http_transaction.response.status == 304) {
                            page.localCacheEnabled = true;
                        }
                        else {
                            page.totalNonImImages += 1;
                            parseNonImOrIcImageHeaders(http_transaction, page);
                        }
                    }
                    else if(/css/i.test(http_transaction.response.headers[i].value)) {
                        page.totalNonRoResources += 1;
                        parseNonRoHeaders(http_transaction, page);
                    }
                    else if(/javascript/i.test(http_transaction.response.headers[i].value)) {
                        page.totalNonRoResources += 1;
                        parseNonRoHeaders(http_transaction, page);
                    }
                }
            }
        }
    };

})(this);