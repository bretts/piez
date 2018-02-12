var inspectedTab = {};
var devtools_port;
var piezCurrentStateOptions = { 'piez-im-simple':
                                                {
                                                  'browserActionText': 'IM',
                                                  'localStorageState': 'piez-im-simple'
                                                },
                                'piez-im-advanced':
                                                {
                                                   'browserActionText': 'IM+',
                                                   'localStorageState': 'piez-im-advanced'
                                                },
                                'piez-a2':
                                                {
                                                   'browserActionText': 'PP',
                                                   'localStorageState': 'piez-a2'
                                                },
                                'piez-ro-simple':
                                                {
                                                   'browserActionText': 'RO',
                                                   'localStorageState': 'piez-ro-simple'
                                                },
                                'piez-ro-advanced':
                                                {
                                                   'browserActionText': 'RO+',
                                                   'localStorageState': 'piez-ro-advanced'
                                                },
                                 'piez-3pm':
                                                {
                                                   'browserActionText': 'SM',
                                                   'localStorageState': 'piez-3pm'
                                                },
                                 'piez-off':    {
                                                   'browserActionText': 'Off',
                                                   'localStorageState': 'piez-off'
                                                }
                              };
var piezCurrentStateCached = '';

beforeSendCallback = function(details) {
	if (details.url.indexOf('http') != -1) {
		if (piezCurrentStateCached == 'piez-a2') {
			details.requestHeaders.push({name: 'pragma', value: 'x-akamai-a2-trace'});
			details.requestHeaders.push({name: 'x-akamai-rua-debug', value: 'on'});
		}
		else {
			details.requestHeaders.push({name: 'x-im-piez', value: 'on'});
			details.requestHeaders.push({name: 'pragma', value: 'akamai-x-ro-trace'});
			details.requestHeaders.push({name: 'x-akamai-ro-piez', value: 'on'});
			details.requestHeaders.push({name: 'x-akamai-a2-disable', value: 'on'})
		}

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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('here we go');
	switch (request.type) {
			case "piez-off":
				setPiezCurrentState('piez-off');
				break;
			case "piez-im-simple":
				setPiezCurrentState('piez-im-simple');
				break;
			case "piez-im-advanced":
				setPiezCurrentState('piez-im-advanced');
				break;
			case "piez-a2":
				setPiezCurrentState('piez-a2');
				break;
			case "piez-ro-simple":
				setPiezCurrentState('piez-ro-simple');
				break;
			case "piez-ro-advanced":
				setPiezCurrentState('piez-ro-advanced');
				break;
			case "piez-3pm":
				setPiezCurrentState('piez-3pm');
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

var setPiezCurrentState = function(state) {
	if(state == 'piez-off') {
		chrome.storage.local.set({"piezCurrentState": state}, function() {
			piezCurrentStateCached = state;
			chrome.browserAction.setBadgeText({"text": piezCurrentStateOptions[state]["browserActionText"]});
			chrome.browserAction.setBadgeBackgroundColor({"color": [255, 0, 0, 255]});
			chrome.webRequest.onBeforeSendHeaders.removeListener(beforeSendCallback);
		});
	}
	else {
		chrome.storage.local.set({"piezCurrentState": state}, function() {
			piezCurrentStateCached = state;
			chrome.browserAction.setBadgeText({"text": piezCurrentStateOptions[state]["browserActionText"]});
			chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
			if (!chrome.webRequest.onBeforeSendHeaders.hasListener(beforeSendCallback)) {
					chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
			}
		});
	}
}

chrome.runtime.onInstalled.addListener(function() {
	initPiezStorageState();
});

chrome.runtime.onStartup.addListener(function() {
	initPiezStorageState();
});

var initPiezStorageState = function() {
	chrome.storage.local.get("piezCurrentState", function(result) {
		if (result["piezCurrentState"] == undefined) {
			setPiezCurrentState('piez-im-simple');
		}
		else {
			key = result["piezCurrentState"];
			if (piezCurrentStateOptions[key] == undefined) {
				setPiezCurrentState('piez-im-simple');
			}
			else {
				console.log("Setting state to: " + key)
				setPiezCurrentState(key);
			}
		}
	});
}