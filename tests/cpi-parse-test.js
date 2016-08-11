QUnit.module('Expanding URL tests');

QUnit.test('Url relative to given base', function(assert) {
    assert.expect(1);
    var expandedUrl = expandUrl('abc', 'https://example.com/tests');
    assert.equal(expandedUrl, 'https://example.com/tests/abc', 'should be https://example.com/tests/abc');
});

QUnit.test('Url relative to domain', function(assert) {
    assert.expect(1);
    var expandedUrl = expandUrl('/abc', 'https://example.com/tests');
    assert.equal(expandedUrl, 'https://example.com/abc', 'should be https://example.com/abc');
});

QUnit.test('Absolute Url', function(assert) {
    assert.expect(1);
    var expandedUrl = expandUrl('http://foo.com/abc', 'https://example.com/tests');
    assert.equal(expandedUrl, 'http://foo.com/abc', 'should be http://foo.com/abc');
});

QUnit.test('Query Strings', function(assert) {
    assert.expect(1);
    var expandedUrl = expandUrl('/abc?a=1&b=2&c=3', 'http://example.com/tests');
    assert.equal(expandedUrl, 'http://example.com/abc?a=1&b=2&c=3', 'should be http://example.com/abc?a=1&b=2&c=3');
});


QUnit.module('Detecting base page', {
    beforeEach: function() {
        this.page = new Page();
        this.har = {
            pages: [{
                title: 'https://example.com/'
            }],
            entries: [
                {
                    request: {
                        url: "https://example.com/"
                    },
                    response: {
                        status: 200,
                        headers: [{name: "location", value: "https://example.com/2"}]
                    }
                },
                {
                    request: {
                        url: "https://example.com/2"
                    },
                    response: {
                        status: 200,
                        headers: [{name: "location", value: "https://example.com/3"}]
                    }
                },
                {
                    request: {
                        url: "https://example.com/3"
                    },
                    response: {
                        status: 200,
                        headers: [{name: "location", value: ""}]
                    }
                }
            ]
        };
    }
});

QUnit.test('Basic base page detection', function(assert) {
    assert.expect(1);
    ParsePageCpi(this.har, this.page);
    assert.equal(this.page.baseUrl, 'https://example.com/');
});
QUnit.test('Following redirects', function(assert) {
    assert.expect(1);
    this.har.entries[0].response.status = 300;
    this.har.entries[1].response.status = 309;
    ParsePageCpi(this.har, this.page);
    assert.equal(this.page.baseUrl, 'https://example.com/3');
});

QUnit.test('H1 redirect to H2', function(assert) {
    assert.expect(1);
    this.har.pages[0].title = 'http://example.com/';
    this.har.entries[0].request.url = 'http://example.com/';
    this.har.entries[0].response.headers[0].value = 'https://example.com/';
    this.har.entries[0].response.status = 301;
    this.har.entries[1].request.url = 'https://example.com/';
    this.har.entries[1].response.status = 302;
    ParsePageCpi(this.har, this.page);
    assert.equal(this.page.baseUrl, 'https://example.com/3');
});


QUnit.module('Verifying Preconnects', {
    beforeEach: function() {
        this.page = new Page();
        this.page.preconnects.common.push('https://www.example.com/', 'http://api.example2.net/');
        this.page.preconnects.unique.push('https://ww1.unique1.com');
    }
});

QUnit.test('No links verified', function(assert) {
    assert.expect(1);
    verifyCpiPreconnects(this.page);
    assert.equal(this.page.preconnects.notUsed.length, 3);
});

QUnit.test('All links verified', function(assert) {
    assert.expect(1);
    this.page.preconnects.linkHeader.push('https://www.example.com/', 'http://api.example2.net/', 'https://ww1.unique1.com');
    verifyCpiPreconnects(this.page);
    assert.equal(this.page.preconnects.notUsed.length, 0);
});


QUnit.module('Verifying Pushes', {
    beforeEach: function() {
        this.page = new Page();
        this.page.baseUrl = 'https://example.com/abc';
        this.page.resourcesPushed.common.push({url: '/resource1.css'}, {url: 'https://example2.com/resource2.js'});
        this.page.resourcesPushed.unique.push({url: 'resource3.woff'});
    }
});

QUnit.test('No pushes verified', function(assert) {
    assert.expect(1);
    verifyCpiPushed(this.page);
    assert.equal(this.page.resourcesPushed.notUsed.length, 3);
});

QUnit.test('All pushes verified', function(assert) {
    assert.expect(4);
    this.page.resourcesPushed.edgePushed.push(
        {url: 'https://example.com/resource1.css', transferSize: 100},
        {url: 'https://example2.com/resource2.js', transferSize: 200},
        {url: 'https://example.com/abc/resource3.woff', transferSize: 300}
    );
    verifyCpiPushed(this.page);
    assert.equal(this.page.resourcesPushed.notUsed.length, 0);
    var resource1, resource2, resource3;
    resource1 = this.page.resourcesPushed.common.find(function(el) {
        return /resource1/i.test(el.url);
    });
    resource2 = this.page.resourcesPushed.common.find(function(el) {
        return /resource2/i.test(el.url);
    });
    resource3 = this.page.resourcesPushed.unique.find(function(el) {
        return /resource3/i.test(el.url);
    });
    assert.equal(resource1.transferSize, 100);
    assert.equal(resource2.transferSize, 200);
    assert.equal(resource3.transferSize, 300);
});


QUnit.module('Parsing resources from HAR', {
    beforeEach: function() {
        this.page = new Page();
        this.har = {
            pages: [{
                title: 'https://example.com/'
            }],
            entries: [
                {
                    request: {
                        url: 'https://example.com/'
                    },
                    response: {
                        status: 200,
                        headers: [
                            {name: 'x-akamai-cpi-enabled', value: 'true'},
                            {name: 'x-akamai-rua-debug-policy-version', value: '1'}
                        ]
                    }
                }
            ]
        };
    }
});

QUnit.test('CPI status and policy version', function(assert) {
    assert.expect(6);
    ParsePageCpi(this.har, this.page);
    assert.ok(this.page.CPIEnabled, 'CPI enabled is true');
    assert.ok(this.page.CPIPolicy, 'Policy value given');

    this.har.entries[0].response.headers = [
        {name: 'x-akamai-cpi-enabled', value: 'false'},
        {name: 'x-akamai-rua-debug-policy-version', value: ''}
    ];
    this.page = new Page();
    ParsePageCpi(this.har, this.page);
    assert.notOk(this.page.CPIEnabled, 'CPI enabled is false');
    assert.notOk(this.page.CPIPolicy, 'No policy value');

    this.har.entries[0].response.headers = [];
    this.page = new Page();
    ParsePageCpi(this.har, this.page);
    assert.notOk(this.page.CPIEnabled, 'No headers');
    assert.notOk(this.page.CPIPolicy, 'No headers');
});

QUnit.test('Common preconnects only', function(assert) {
    assert.expect(3);
    this.har.entries[0].response.headers.push(
        {
            name: 'x-akamai-rua-debug-common-preconnect-link-value',
            value: '<https://example2.com>;rel="preconnect",<https://example3.com>;rel="preconnect"'
        }
    );
    ParsePageCpi(this.har, this.page);
    assert.equal(this.page.preconnects.common.length, 2, '# of preconnects found should be 2');
    assert.notEqual(this.page.preconnects.common.indexOf('https://example2.com'), -1, 'finding https://example2.com in common preconnects');
    assert.notEqual(this.page.preconnects.common.indexOf('https://example3.com'), -1, 'finding https://example3.com in common preconnects');

});

QUnit.test('Unique preconnects only', function(assert) {
    assert.expect(3);
    this.har.entries[0].response.headers.push(
        {
            name: 'x-akamai-rua-debug-unique-preconnect-link-value',
            value: '<https://example4.com>;rel="preconnect",<https://example5.com>;rel="preconnect"'
        }
    );
    ParsePageCpi(this.har, this.page);
    assert.equal(this.page.preconnects.unique.length, 2, '# of preconnects found should be 2');
    assert.notEqual(this.page.preconnects.unique.indexOf('https://example4.com'), -1, 'finding https://example4.com in unique preconnects');
    assert.notEqual(this.page.preconnects.unique.indexOf('https://example5.com'), -1, 'finding https://example5.com in unique preconnects');
});

QUnit.test('All preconnects + link header', function(assert) {
    assert.expect(6);
    this.har.entries[0].response.headers.push(
        {
            name: 'x-akamai-rua-debug-common-preconnect-link-value',
            value: '<https://example2.com>;rel="preconnect",<https://example3.com>;rel="preconnect"'
        },
        {
            name: 'x-akamai-rua-debug-unique-preconnect-link-value',
            value: '<https://example4.com>;rel="preconnect",<https://example5.com>;rel="preconnect"'
        },
        {
            name: 'link',
            value: '<https://example2.com>;rel="preconnect",<https://example3.com>;rel="preconnect",<https://example4.com>;rel="preconnect",<https://example5.com>;rel="preconnect"'
        }
    );
    ParsePageCpi(this.har, this.page);
    assert.equal(this.page.preconnects.unique.length + this.page.preconnects.common.length, 4, '# of preconnects found should be 4');
    assert.equal(this.page.preconnects.linkHeader.length, 4, '# of preconnects in link header should be 4');
    assert.notEqual(this.page.preconnects.common.indexOf('https://example2.com'), -1, 'finding https://example2.com in common preconnects');
    assert.notEqual(this.page.preconnects.common.indexOf('https://example3.com'), -1, 'finding https://example3.com in common preconnects');
    assert.notEqual(this.page.preconnects.unique.indexOf('https://example4.com'), -1, 'finding https://example4.com in unique preconnects');
    assert.notEqual(this.page.preconnects.unique.indexOf('https://example5.com'), -1, 'finding https://example5.com in unique preconnects');
});

QUnit.test('Common pushes only', function(assert) {
    assert.expect(3);
    this.har.entries[0].response.headers.push(
        {
            name: 'x-akamai-rua-debug-common-push-paths',
            value: '/test1 /test2'
        }
    );
    ParsePageCpi(this.har, this.page);
    assert.equal(this.page.resourcesPushed.common.length, 2, '# of pushes found should be 2');
    assert.ok(this.page.resourcesPushed.common.find(function(el) {
        return el.url === '/test1';
    }), 'finding "/test1" in common pushes');
    assert.ok(this.page.resourcesPushed.common.find(function(el) {
        return el.url === '/test2';
    }), 'finding "/test2" in common pushes');
});

QUnit.test('Unique pushes only', function(assert) {
    assert.expect(3);
    this.har.entries[0].response.headers.push(
        {
            name: 'x-akamai-rua-debug-unique-push-paths',
            value: '/test3 /test4'
        }
    );
    ParsePageCpi(this.har, this.page);
    assert.equal(this.page.resourcesPushed.unique.length, 2, '# of pushes found should be 2');
    assert.ok(this.page.resourcesPushed.unique.find(function(el) {
        return el.url === '/test3';
    }), 'finding "/test3" in unique pushes');
    assert.ok(this.page.resourcesPushed.unique.find(function(el) {
        return el.url === '/test4';
    }), 'finding "/test4" in unique pushes');
});

QUnit.test('Pushes in header and pushed resources', function(assert) {
    assert.expect(5);
    this.har.entries[0].response.headers.push(
        {
            name: 'x-akamai-rua-debug-common-push-paths',
            value: '/test1'
        },
        {
            name: 'x-akamai-rua-debug-unique-push-paths',
            value: '/test3'
        }
    );
    this.har.entries.push(
        {
            request: { url: 'https://example.com/test1' },
            response: {
                headers: [
                    { name: 'x-akamai-http2-pushed' }
                ],
                _transferSize: 100
            }
        },
        {
            request: { url: 'https://example.com/test2' },
            response: {
                headers: [],
                _transferSize: 200
            }
        },
        {
            request: { url: 'https://example.com/test3' },
            response: {
                headers: [
                    {name: 'x-akamai-http2-pushed'}
                ],
                _transferSize: 300
            }
        }
    );
    ParsePageCpi(this.har, this.page);
    assert.equal(this.page.resourcesPushed.unique.length + this.page.resourcesPushed.common.length, 2, '# of pushes found should be 2');
    assert.equal(this.page.resourcesPushed.edgePushed.length, 2, '# of resources verified to be pushed should be 2');
    assert.equal(this.page.resourcesPushed.notUsed, 0, 'all pushed resources verified');
    assert.equal(this.page.resourcesPushed.common[0].transferSize, 100, 'pushed /test1 resource should have 100B size');
    assert.equal(this.page.resourcesPushed.unique[0].transferSize, 300, 'pushed /test2 resource should have 300B size');
});