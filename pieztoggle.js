function PiezToggle() {
	var instance = this;

	chrome.storage.local.get('piezCurrentState', function(result) {
			switch(result['piezCurrentState']) {
				case "piezModeOff":
					instance.turnPiezOff();
					break;
				case "piezModeImSimple":
					instance.turnPiezOnImSimple();
					break;
				case "piezModeImAdvanced":
					instance.turnPiezOnImAdvanced();
					break;
				case "piezModeBrowserFormatCompare":
					instance.turnPiezOnModeBrowserFormatCompare();
					break;
				case "piezModeA2":
					instance.turnPiezOnA2();
					break;
				case "piezModeRoSimple":
					instance.turnPiezOnRoSimple();
				default:
					instance.turnPiezOnImSimple();
					break;
			}
	});
}

PiezToggle.prototype.turnPiezOff = function() {
		chrome.storage.local.set({"piezCurrentState": "piezModeOff"}, function() {
				chrome.browserAction.setBadgeText({"text": "OFF"});
				chrome.browserAction.setBadgeBackgroundColor({"color": [255, 0, 0, 255]});
				chrome.webRequest.onBeforeSendHeaders.removeListener(beforeSendCallback);
		});
};

PiezToggle.prototype.turnPiezOnImSimple = function() {
		chrome.storage.local.set({"piezCurrentState": "piezModeImSimple"}, function() {
				chrome.browserAction.setBadgeText({"text": "IM"});
				chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
				if (!chrome.webRequest.onBeforeSendHeaders.hasListener(beforeSendCallback)) {
						chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
				}
		});
};

PiezToggle.prototype.turnPiezOnImAdvanced = function() {
		chrome.storage.local.set({"piezCurrentState": "piezModeImAdvanced"}, function() {
				chrome.browserAction.setBadgeText({"text": "IM+"});
				chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
				if (!chrome.webRequest.onBeforeSendHeaders.hasListener(beforeSendCallback)) {
					chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
				}
		});
};

PiezToggle.prototype.turnPiezOnModeBrowserFormatCompare = function() {
		chrome.storage.local.set({"piezCurrentState": "piezModeBrowserFormatCompare"}, function() {
				chrome.browserAction.setBadgeText({"text": "IM+"});
				chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
				if (!chrome.webRequest.onBeforeSendHeaders.hasListener(beforeSendCallback)) {
					chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
				}
		});
};

PiezToggle.prototype.turnPiezOnA2 = function() {
		chrome.storage.local.set({"piezCurrentState": "piezModeA2"}, function() {
				chrome.browserAction.setBadgeText({"text": "A2"});
				chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
				if (!chrome.webRequest.onBeforeSendHeaders.hasListener(beforeSendCallback)) {
					chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
				}
		});
};

PiezToggle.prototype.turnPiezOnRoSimple = function() {
		chrome.storage.local.set({"piezCurrentState": "piezModeRoSimple"}, function() {
				chrome.browserAction.setBadgeText({"text": "RO"});
				chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
				if (!chrome.webRequest.onBeforeSendHeaders.hasListener(beforeSendCallback)) {
						chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
				}
		});
};

PiezToggle.prototype.turnPiezOnRoAdvanced = function() {
		chrome.storage.local.set({"piezCurrentState": "piezModeRoAdvanced"}, function() {
				chrome.browserAction.setBadgeText({"text": "RO+"});
				chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
				if (!chrome.webRequest.onBeforeSendHeaders.hasListener(beforeSendCallback)) {
						chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
				}
		});
};
