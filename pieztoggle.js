function PiezToggle() {
  var instance = this

  chrome.storage.local.get("piezCurrentState", function(result) {
    if(result["piezCurrentState"] === undefined) {
      instance.turnPiezOnSimple();
    }
    else {
      switch(result["piezCurrentState"]) {
        case "piezModeOff":
          instance.turnPiezOff();
          break;
        case "piezModeSimple":
          instance.turnPiezOnSimple();
          break;
        case "piezModeAdvanced":
          instance.turnPiezOnAdvanced();
          break;
      }
    }
  });
};

PiezToggle.prototype.turnPiezOff = function() {
  chrome.storage.local.set({"piezCurrentState": "piezModeOff"}, function() {
    chrome.browserAction.setBadgeText({"text": "OFF"});
    chrome.browserAction.setBadgeBackgroundColor({"color": [255, 0, 0, 255]});
    chrome.webRequest.onBeforeSendHeaders.removeListener(beforeSendCallback);  
  });
};

PiezToggle.prototype.turnPiezOnSimple = function() {
  chrome.storage.local.set({"piezCurrentState": "piezModeSimple"}, function() {
    chrome.browserAction.setBadgeText({"text": "ON"});
    chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
    chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
  });
  
};

PiezToggle.prototype.turnPiezOnAdvanced = function() {
  chrome.storage.local.set({"piezCurrentState": "piezModeAdvanced"}, function() {
    chrome.browserAction.setBadgeText({"text": "ON +"});
    chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
    chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
  });
};