function PiezToggle() {
  persistentState = localStorage["piezSettings"];

  if(persistentState == undefined) {
    this.turnPiezOnSimple();
  }
  else {
    switch(JSON.parse(persistentState).currentState) {
      case "piezModeOff":
        this.turnPiezOff();
        break;
      case "piezModeSimple":
        this.turnPiezOnSimple();
        break;
      case "piezModeAdvanced":
        this.turnPiezOnAdvanced();
        break;
    }
  }
}

PiezToggle.prototype.turnPiezOff = function() {
  chrome.browserAction.setBadgeText({"text": "OFF"});
  chrome.browserAction.setBadgeBackgroundColor({"color": [255, 0, 0, 255]})
  localStorage['piezSettings'] = JSON.stringify({ "currentState": "piezModeOff" })
  chrome.webRequest.onBeforeSendHeaders.removeListener(beforeSendCallback);
}

PiezToggle.prototype.turnPiezOnSimple = function() {
  chrome.browserAction.setBadgeText({"text": "ON"});
  chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]})
  localStorage['piezSettings'] = JSON.stringify({ "currentState": "piezModeSimple" })
  chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
}

PiezToggle.prototype.turnPiezOnAdvanced = function() {
  chrome.browserAction.setBadgeText({"text": "ON +"});
  chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]})
  localStorage['piezSettings'] = JSON.stringify({ "currentState": "piezModeAdvanced" })
  chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
}