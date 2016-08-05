function PiezToggle() {
  var instance = this;

  result = localStorage.getItem("piezCurrentState");

  switch(result) {
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
}

PiezToggle.prototype.turnPiezOff = function() {
  localStorage.setItem("piezCurrentState", "piezModeOff");
  chrome.browserAction.setBadgeText({"text": "OFF"});
  chrome.browserAction.setBadgeBackgroundColor({"color": [255, 0, 0, 255]});
  chrome.webRequest.onBeforeSendHeaders.removeListener(beforeSendCallback);
};

PiezToggle.prototype.turnPiezOnImSimple = function() {
  localStorage.setItem("piezCurrentState", "piezModeImSimple");
  chrome.browserAction.setBadgeText({"text": "ON"});
  chrome.browserAction.setBadgeBackgroundColor({"color": [0, 255, 0, 255]});
  chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
};

PiezToggle.prototype.turnPiezOnImAdvanced = function() {
  localStorage.setItem("piezCurrentState", "piezModeImAdvanced");
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

PiezToggle.prototype.turnPiezOnCPI = function() {
    localStorage.setItem("piezCurrentState", "piezModeCPI");
    chrome.browserAction.setBadgeText({"text": "CPI"});
    chrome.browserAction.setBadgeBackgroundColor({"color": [0, 0, 255, 255]});
    chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendCallback, {urls: [ "<all_urls>" ]}, ['requestHeaders','blocking']);
};
