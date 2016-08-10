ParseImHeaders = function(http_transaction, page, display_mode) {
    if(display_mode === 'piezModeBrowserFormatCompare') {
        parseImHeadersBrowserFormatCompare(http_transaction, page, display_mode);
    }
    else {
        parseImHeadersNormal(http_transaction, page, display_mode);
    }
};

var parseImHeadersBrowserFormatCompare = function(http_transaction, page, display_mode) {
    var res = {};
    res.url = http_transaction.request.url;

    if(/imFormat=safari|imFormat=generic|imFormat=chrome|imFormat=ie/i.test(res.url)) {
        browserFormat = {};
        browserFormat.url = res.url;
        http_transaction.response.headers.forEach(function(header) {
            if(/content-length/i.test(header.name)) {
                browserFormat.contlen = header.value;
            }
            else if(/content-type/i.test(header.name)) {
                browserFormat.contype = header.value;
            }
        });

        page.imDownloadDetails.forEach(function(entry){
            var formats = ['imFormat=safari', 'imFormat=generic', 'imFormat=chrome', 'imFormat=ie'];

            formats.forEach(function(format) {
                if(browserFormat.url == (entry.url + '?' + format) || browserFormat.url == entry.url + '&' + format) {
                    if(entry.browserFormats == undefined) {
                        entry.browserFormats = {};
                    }
                    formatType = format.split('=')[1];
                    entry.browserFormats[formatType] = {};
                    entry.browserFormats[formatType] = browserFormat;

                    page[formatType + 'FormatTotal'] += parseInt(browserFormat.contlen);
                    console.log(page);
                }
            });
        });
    }
    else {
        extractImHeaders(http_transaction, page, res);
        page.imDownloadDetails.push(res);

        chrome.runtime.sendMessage({
            type: "request-alternate-browser-formats",
            url: res.url
        });
    }
};

var parseImHeadersNormal = function(http_transaction, page, display_mode) {
    var res = {};
    res.url = http_transaction.request.url;

    extractImHeaders(http_transaction, page, res);
    page.imDownloadDetails.push(res);
};

var extractImHeaders = function(http_transaction, page, res) {
    http_transaction.response.headers.forEach(function(header) {
        if(/x-im-original-size/i.test(header.name)) {
            res.orgsize = header.value;
            page.totalOriginalSize += parseInt(header.value);
        }
        else if(/content-length/i.test(header.name)) {
            res.contlen = header.value;
            page.totalImTransformSize += parseInt(header.value);
        }
        else if(/content-type/i.test(header.name)) {
            res.contype = header.value;
        }
        else if(/x-im-file-name/i.test(header.name)) {
            res.filename = header.value;
        }
        else if(/x-im-pixel-density/i.test(header.name)) {
            res.pixelDensity = header.value;
        }
        else if(/x-im-original-width/i.test(header.name)) {
            res.originalWidth = header.value;
        }
        else if(/x-im-encoding-quality/i.test(header.name)) {
            res.encQuality = header.value;
        }

    });
};