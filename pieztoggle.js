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
        case "piezModeCPI":
          instance.turnPiezOnCPI();
          break;
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
      chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
    });
};

PiezToggle.prototype.turnPiezOnImAdvanced = function() {
    chrome.storage.local.set({"piezCurrentState": "piezModeImAdvanced"}, function() {
      chrome.browserAction.setBadgeText({"text": "IM+"});
      chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
      chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
    });
};

PiezToggle.prototype.turnPiezOnModeBrowserFormatCompare = function() {
    chrome.storage.local.set({"piezCurrentState": "piezModeBrowserFormatCompare"}, function() {
      chrome.browserAction.setBadgeText({"text": "IM+"});
      chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
      chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
    });
};

PiezToggle.prototype.turnPiezOnCPI = function() {
    chrome.storage.local.set({"piezCurrentState": "piezModeCPI"}, function() {
      chrome.browserAction.setBadgeText({"text": "CPI"});
      chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
      chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
    });
};
