(function(global) {
    'use strict';
    Array.prototype.pushIfUnique = function(item) {
        if (this.indexOf(item) === -1) {
            this.push(item);
        }
        return this.length; //same signature as Array.push
    };

    global.ParseCPIHeaders = function(request, page) {
        if(request.response.status === 304) {
            page.localCacheEnabled = true;
        }
        else if (request.response.status === 302) { //ignore all redirects
            return;
        }
        var actualPreconnects = [];
        request.response.headers.forEach(function(header) {
            var preArr;
            //if CPI enabled, set flag and get the page base URL
            if (/x-akamai-cpi-enabled/i.test(header.name)) {
                page.CPIEnabled = page.CPIEnabled || (header.value === 'true')? true : false;
                if (page.baseUrl === undefined) {
                    page.baseUrl = request.request.url;
                }
            }
            if (/x-akamai-cpi-policy-version/i.test(header.name)) {
                page.CPIPolicy = header.value;
            }
            //get all preconnects
            if(/x-akamai-rua-debug-common-preconnect-link-value/i.test(header.name)) {
                preArr = header.value.match(/<([^>]+)>/g);
                if (preArr) {
                    preArr.forEach(function(urlStr) {
                        page.preconnects.common.pushIfUnique(urlStr.slice(1,-1)); //get rid of the <> surrounding url
                    });
                }
            }
            if (/x-akamai-rua-debug-unique-preconnect-link-value/i.test(header.name)) {
                preArr = header.value.match(/<([^>]+)>/g);
                if (preArr) {
                    preArr.forEach(function(urlStr) {
                        page.preconnects.unique.pushIfUnique(urlStr.slice(1,-1));
                    });
                }

            }
            if (/^link$/i.test(header.name)) {
                var linkList = header.value.split(',');
                linkList.forEach(function(resource) {
                    resource = resource.split(';');
                    if (/preconnect/i.test(resource[1])) {
                        page.preconnects.linkHeader.pushIfUnique(resource[0].slice(1,-1));
                    }
                }, linkList);
            }

            //get all pushed resources
            var pushArr;
            if(/x-akamai-rua-debug-common-push-paths/i.test(header.name)) {
                pushArr = header.value.split(' ');
                if (pushArr) {
                    pushArr.forEach(function(res) {
                        if(res !== '') {
                            page.resourcesPushed.common.pushIfUnique(res);
                        }
                    });
                }
            }
            if(/x-akamai-rua-debug-unique-push-paths/i.test(header.name)) {
                pushArr = header.value.split(' ');
                if (pushArr) {
                    pushArr.forEach(function(res) {
                        if(res !== '') {
                            page.resourcesPushed.unique.pushIfUnique({url: res});
                        }
                    });
                }
            }
            if (/x-akamai-http2-push/i.test(header.name)) { //header from Akamai edge verifies push
                page.resourcesPushed.edgePushed.push({url: request.request.url, transferSize: request.response._transferSize});
            }
        });
    };

    global.verifyCpiPreconnects = function(page) {
        //make sure every resource the debug headers list is actually there
        page.preconnects.common.forEach(function(url, index) {
            if(page.preconnects.linkHeader.indexOf(url) === -1) {
                page.preconnects.notUsed.push(url);
            }
        });
        page.preconnects.unique.forEach(function(url, index) {
            if(page.preconnects.linkHeader.indexOf(url) === -1) {
                page.preconnects.notUsed.push(url);
            }
        });
    };

    global.verifyCpiPushed = function(page) {
        var baseUrl = parseUrl(page.baseUrl);
        var isAbsUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
        //expands out relative urls reported by CPI debug to compare to absolute urls given by Akamai edge servers
        function expandUrl(element) {
            var urlStr = baseUrl.protocol + '//' + baseUrl.host + baseUrl.path;
            if (isAbsUrl.test(element)) {
                urlStr = url.toString();
            }
            else { //deal with the various relative urls
                if (urlStr.slice(-1) !== '/') {
                    urlStr = urlStr + '/';
                }
                if (element.slice(0,1) === '/') { //relative to base
                    urlStr = baseUrl.protocol + '//' + baseUrl.host; //the relative url element already has a slash
                }
                var newUrl = parseUrl(urlStr + element);
                urlStr = newUrl.protocol + '//' + newUrl.host + newUrl.path;
            }
            return urlStr;
        }
        function matchUrl(el) {
            return el.url === this.valueOf();
        }
        page.resourcesPushed.common.forEach(function(element, index) {
            var urlStr = expandUrl(element.url);
            var found = page.resourcesPushed.edgePushed.findIndex(matchUrl, urlStr);
            if(found === -1) {
                page.resourcesPushed.notUsed.push(element);
            }
            else {
                element.transferSize = page.resourcesPushed.edgePushed[found].transferSize;
            }
        });
        page.resourcesPushed.unique.forEach(function(element, index) {
            var urlStr = expandUrl(element.url);
            var found = page.resourcesPushed.edgePushed.findIndex(matchUrl, urlStr);
            if(found === -1) {
                page.resourcesPushed.notUsed.push(element);
            }
            else {
                element.transferSize = page.resourcesPushed.edgePushed[found].transferSize;
            }
        });
    };

    function parseUrl(url) {
        var a =  document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol,
            host: a.hostname,
            port: a.port,
            query: a.search,
            hash: a.hash,
            path: a.pathname
        };
    }
})(this);