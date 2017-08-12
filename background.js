var inspectedTab = {};
var devtools_port;

beforeSendCallback = function(details) {
	var urlMatch = new RegExp('(' + inspectedTab.url + '|' + inspectedTab.url + '/)', 'i');
	if (details.tabId !== inspectedTab.id) { //make sure we're only affecting the inspected tab
		return;
	}
	if (details.url.indexOf('http') != -1) {
		details.requestHeaders.push({name: 'x-im-piez', value: 'on'});
		details.requestHeaders.push({name: 'x-akamai-ro-piez', value: 'on'});
		details.requestHeaders.push({name: 'x-akamai-rua-debug', value: 'on'});
		details.requestHeaders.push({name: 'pragma', value: 'akamai-x-ro-trace x-akamai-a2-trace'});
	}
	if (details.url.indexOf('https') != -1 && details.frameId === 0 && urlMatch.test(details.url)) {
		details.requestHeaders.push({name: 'x-akamai-rua-debug', value: ''}, {name:'pragma', value: 'akamai-x-ro-trace x-akamai-a2-trace'});
	}
	return {requestHeaders: details.requestHeaders};
};

//get the URL that the tab is navigating to
chrome.webNavigation.onBeforeNavigate.addListener(function beforeNavigate(details) {
	if (details.tabId === inspectedTab.id && details.frameId === 0) {
		inspectedTab.url = details.url;
	}
});

//get the actual url to use if there's a redirect for the base page
chrome.webRequest.onBeforeRedirect.addListener(function getNewUrl(redirect) {
	var urlMatch = new RegExp('(' + inspectedTab.url + '|' + inspectedTab.url + '/)', 'i');
	if (redirect.tabId === inspectedTab.id && redirect.frameId === 0 && urlMatch.test(redirect.url)) {
		var newLocation = redirect.responseHeaders.find(function(header) {
			return /location/i.test(header.name);
		});
		if (newLocation !== undefined) {
			inspectedTab.url = newLocation.value;
		}
	}
}, {urls: ["<all_urls>"]}, ['responseHeaders']);

chrome.runtime.onConnect.addListener(function(port) {
	devtools_port = port;
	port.onMessage.addListener(function onMessageListener (message) {
		switch (message.type) {
			case "inspectedTab":
				inspectedTab.id = message.tab;
				break;
			case "a2PageLoad":
				chrome.webNavigation.onCompleted.addListener(function pageComplete(details) {
					if (details.tabId === inspectedTab.id && details.frameId === 0) {
						try {
							port.postMessage({type:'a2PageLoaded'});
						}
						finally {
							chrome.webNavigation.onCompleted.removeListener(pageComplete);
						}
					}
				});
				break;
			case "update-piez-analytics":
				chrome.tabs.getSelected(null, function(tab) {
						logUrlAnalytics(tab);
				});
				break;
			default:
				console.log('Unexpected message from devtools. ', message);
		}
	});
	port.onDisconnect.addListener(function() { //stop keeping track since our devtools closed
		devtools_port = undefined;
		inspectedTab = {};
	});
});


var piezToggle = new PiezToggle();
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.type) {
			case "piez-off":
				piezToggle.turnPiezOff();
				break;
			case "piez-im-simple":
				piezToggle.turnPiezOnImSimple();
				break;
			case "piez-im-advanced":
				piezToggle.turnPiezOnImAdvanced();
				break;
			case "piez-a2":
				piezToggle.turnPiezOnA2();
				break;
			case "piez-ro-simple":
				piezToggle.turnPiezOnRoSimple();
				break;
			case "piez-ro-advanced":
				piezToggle.turnPiezOnRoAdvanced();
				break;
			case "piez-browser-format-compare":
				piezToggle.turnPiezOnModeBrowserFormatCompare();
				break;
			case "request-alternate-browser-formats":
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					request["tabUrl"] = tabs[0].url;
					chrome.tabs.sendMessage(tabs[0].id, request);
				});
				break;
			default:
				console.log('Unexpected extension request. ', request);
	}
	return false;
});

var getCookiesUrl = function(href) {
	var link = document.createElement("a");
	link.href = href;
	return(link.protocol + "//" + link.hostname);
};

var logUrlAnalytics = function(tab) {
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-62551710-2', 'auto');
	ga('set', 'checkProtocolTask', function(){});
	ga('require', 'displayfeatures');
	ga('send', 'pageview', tab.url);
};
