function PiezToggle() {
  var instance = this

  result = localStorage.getItem("piezCurrentState");

  switch(result) {
    case "piezModeOff":
      instance.turnPiezOff();
      break;
    case "piezModeSimple":
      instance.turnPiezOnSimple();
      break;
    case "piezModeAdvanced":
      instance.turnPiezOnAdvanced();
      break;
    case "piezModeBrowserFormatCompare":
      instance.turnPiezOnModeBrowserFormatCompare();
      break;
    default:
      instance.turnPiezOnSimple();
      break;
  }
};

PiezToggle.prototype.turnPiezOff = function() {
  localStorage.setItem("piezCurrentState", "piezModeOff");
  chrome.browserAction.setBadgeText({"text": "OFF"});
  chrome.browserAction.setBadgeBackgroundColor({"color": [255, 0, 0, 255]});
  chrome.webRequest.onBeforeSendHeaders.removeListener(beforeSendCallback);
};

PiezToggle.prototype.turnPiezOnSimple = function() {
  localStorage.setItem("piezCurrentState", "piezModeSimple");
  chrome.browserAction.setBadgeText({"text": "ON"});
  chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
  chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
};

PiezToggle.prototype.turnPiezOnAdvanced = function() {
  localStorage.setItem("piezCurrentState", "piezModeAdvanced");
  chrome.browserAction.setBadgeText({"text": "ON +"});
  chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
  chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
};

PiezToggle.prototype.turnPiezOnModeBrowserFormatCompare = function() {
  localStorage.setItem("piezCurrentState", "piezModeBrowserFormatCompare");
  chrome.browserAction.setBadgeText({"text": "ON +"});
  chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
  chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
};