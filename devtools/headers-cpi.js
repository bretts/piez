(function(global) {
    'use strict';
    Array.prototype.pushIfUnique = function(item) {
        if (this.indexOf(item) === -1) {
            this.push(item);
        }
        return this.length; //same signature as Array.push
    };

    global.ParsePageCpi = function(har, page) {
        var basePageUrl = har.pages[0].title; //current Chrome har implementation only keeps track of latest page navigated to
        har.entries.forEach(function(entry) {
            if(entry.response.status === 304) {
                page.localCacheEnabled = true;
            }
            //get CPI info from base page
            if (entry.request.url === basePageUrl) {
                //base page redirected, get the new one from location header
                if (entry.response.status >= 300 && entry.response.status < 400) {
                    var newLocation = entry.response.headers.find(function(header) {
                        return /location/i.test(header.name);
                    });
                    if (newLocation !== undefined) {
                        basePageUrl = newLocation.value;
                    }
                }
                else {
                    parseBasePage(entry, page);
                }
            }
            //header from Akamai edge verifies push
            else{
                var pushHeader = entry.response.headers.find(function(header) {
                    return /x-akamai-http2-push/i.test(header.name);
                });
                if (pushHeader !== undefined) {
                    page.resourcesPushed.edgePushed.push({url: entry.request.url, transferSize: entry.response._transferSize});
                }
            }
        });

        verifyCpiPreconnects(page);
        verifyCpiPushed(page);
    };

    function parseBasePage(http_transaction, page) {
        http_transaction.response.headers.forEach(function(header) {

            page.baseUrl = http_transaction.request.url;
            if (/x-akamai-cpi-enabled/i.test(header.name)) {
                page.CPIEnabled = (header.value === 'true');
            }
            if (/x-akamai-cpi-policy-version/i.test(header.name)) {
                page.CPIPolicy = header.value;
            }

            //get all preconnects
            var preArr;
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
                            page.resourcesPushed.common.pushIfUnique({url: res});
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
        });
    }

    //make sure every resource the debug headers list is actually there
    global.verifyCpiPreconnects = function(page) {

        page.preconnects.common.forEach(function(url) {
            if(page.preconnects.linkHeader.indexOf(url) === -1) {
                page.preconnects.notUsed.push(url);
            }
        });
        page.preconnects.unique.forEach(function(url) {
            if(page.preconnects.linkHeader.indexOf(url) === -1) {
                page.preconnects.notUsed.push(url);
            }
        });
    };

    //check against edge servers to make sure pushes are actually there
    global.verifyCpiPushed = function(page) {
        function matchUrl(el) {
            return el.url === this.valueOf();
        }
        page.resourcesPushed.common.forEach(function(element) {
            var urlStr = expandUrl(element.url, page.baseUrl);
            var found = page.resourcesPushed.edgePushed.findIndex(matchUrl, urlStr);
            if(found === -1) {
                page.resourcesPushed.notUsed.push(element);
            }
            else {
                element.transferSize = page.resourcesPushed.edgePushed[found].transferSize;
            }
        });
        page.resourcesPushed.unique.forEach(function(element) {
            var urlStr = expandUrl(element.url, page.baseUrl);
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

    //expands out relative urls reported by CPI debug to compare to absolute urls given by Akamai edge servers
    global.expandUrl = function(url, baseUrl) {
        var parsedUrl = parseUrl(baseUrl);
        var isAbsUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
        if (isAbsUrl.test(url)) {
            return url;
        }
        else { //deal with the various types of relative urls
            var urlStr = parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.path;
            if (url.slice(0,1) === '/') { //relative to base
                urlStr = parsedUrl.protocol + '//' + parsedUrl.host; //the relative url already begins with a slash
            }
            else if (urlStr.slice(-1) !== '/') {
                urlStr = urlStr + '/';
            }
            var newUrl = parseUrl(urlStr + url); //parse our new base url with the relative
            return newUrl.protocol + '//' + newUrl.host + newUrl.path + (newUrl.query || '');
        }
    };

})(this);