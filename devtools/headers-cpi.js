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
                        return header.name === 'location';
                    });
                    if (newLocation && newLocation.value) {
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

    function parseBasePage(request, page) {
        var actualPreconnects = [];
        request.response.headers.forEach(function(header) {

            page.baseUrl = request.request.url;
            if (/x-akamai-cpi-enabled/i.test(header.name)) {
                page.CPIEnabled = (header.value === 'true') ? true : false;
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
        });
    }

    function verifyCpiPreconnects (page) {
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
    }

    function verifyCpiPushed (page) {
        function matchUrl(el) {
            return el.url === this.valueOf();
        }
        page.resourcesPushed.common.forEach(function(element, index) {
            var urlStr = expandUrl(element.url, page.baseUrl);
            if(element.url.indexOf('?') !== -1) { console.log(element.url, ' : ', urlStr); }
            var found = page.resourcesPushed.edgePushed.findIndex(matchUrl, urlStr);
            if(found === -1) {
                page.resourcesPushed.notUsed.push(element);
            }
            else {
                element.transferSize = page.resourcesPushed.edgePushed[found].transferSize;
            }
        });
        page.resourcesPushed.unique.forEach(function(element, index) {
            var urlStr = expandUrl(element.url, page.baseUrl);
            if(element.url.indexOf('?') !== -1) { console.log(element.url, ' : ', urlStr); }
            var found = page.resourcesPushed.edgePushed.findIndex(matchUrl, urlStr);
            if(found === -1) {
                console.log("cpi, ghost ",  urlStr, page.resourcesPushed.edgePushed);
                page.resourcesPushed.notUsed.push(element);
            }
            else {
                element.transferSize = page.resourcesPushed.edgePushed[found].transferSize;
            }
        });
    }

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
    global.expandUrl = function(element, baseUrl) {
        var parsedUrl = parseUrl(baseUrl);
        var urlStr = parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.path;
        var isAbsUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
        if (isAbsUrl.test(element)) {
            urlStr = url.toString();
        }
        else { //deal with the various types of relative urls
            if (urlStr.slice(-1) !== '/') {
                urlStr = urlStr + '/';
            }
            if (element.slice(0,1) === '/') { //relative to base
                urlStr = parsedUrl.protocol + '//' + parsedUrl.host; //the relative url element already has a slash
            }
            var newUrl = parseUrl(urlStr + element);
            urlStr = newUrl.protocol + '//' + newUrl.host + newUrl.path + (newUrl.query || '');
        }
        return urlStr;
    };

})(this);