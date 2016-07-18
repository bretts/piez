function parseResult(http_transaction, page) {
    if(http_transaction.response.status == 304 && (http_transaction.request.url).indexOf('.js') == -1)
    {
        page.localCacheEnabled = true;
    }

    else if(/x-im-original-size/i.test(JSON.stringify(http_transaction.response.headers)))
    {
        page.totalIMImagesTransformed += 1;
        parseIMHeaders(http_transaction, page);
    }
    else if(/akamai image server/i.test(JSON.stringify(http_transaction.response.headers)))
    {
        page.totalICImagesTransformed += 1;
        parseICHeaders(http_transaction, page);
    }
}

function parseIMHeaders(http_transaction, page) {
    var res = {};
    res['url'] = http_transaction.request.url;

    http_transaction.response.headers.forEach(function(header) {
        if(/x-im-original-size/i.test(header.name))
        {
            res['orgsize'] = header.value;
            page.totalOriginalSize += parseInt(header.value);
        }
        else if(/content-length/i.test(header.name))
        {
            res['contlen'] = header.value;
            page.totalImTransformSize += parseInt(header.value);
        }
        else if(/content-type/i.test(header.name))
        {
            res['contype'] = header.value;
        }
        else if(/x-im-file-name/i.test(header.name))
        {
            res['filename'] = header.value;
        }
        else if(/x-im-pixel-density/i.test(header.name))
        {
            res['pixelDensity'] = header.value;
        }
        else if(/x-im-original-width/i.test(header.name))
        {
            res['originalWidth'] = header.value;
        }
        else if(/x-im-encoding-quality/i.test(header.name))
        {
            res['encQuality'] = header.value;
        }

    });
    page.imDownloadDetails.push(res);
}

function parseICHeaders(http_transaction, page) {
    var res = {}
    res['url'] = http_transaction.request.url;

    http_transaction.response.headers.forEach(function(header) {
        if(/x-image-server-original-size/i.test(header.name))
        {
            res['orgsize'] = header.value;
            page.totalOriginalSize += parseInt(header.value);
        }
        else if(/content-length/i.test(header.name))
        {
            res['contlen'] = header.value;
            page.totalIcTransformSize += parseInt(header.value);
        }
        else if(/content-type/i.test(header.name)) {
            res['contype'] = (header.value).split(';')[0];
        }
    });
    page.icDownloadDetails.push(res);
}