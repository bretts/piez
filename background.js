beforeSendCallback = function(details) {
  chrome.tabs.query({'active': true},
   function(tabs){
      var url = tabs[0].url;

      if(url.indexOf('http') != -1) {
        chrome.cookies.set({ url: getCookiesUrl(url), name: "im-debug", value: "basic" });  
      }
    }
  );

  return {requestHeaders: details.requestHeaders};
};


var onMessageListener = function(message, sender, sendResponse) {
    switch(message.type) {
        case "bglog":
            console.log(message.obj);
        break;
    }
    return true;
}

var piezToggle = new PiezToggle();
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "piez-off":
          piezToggle.turnPiezOff();
          break;
        case "piez-simple":
          piezToggle.turnPiezOnSimple();
          break;
        case "piez-advanced":
          piezToggle.turnPiezOnAdvanced();
          break;
    }
    return true;
});

var getCookiesUrl = function(href) {
  var link = document.createElement("a");
  link.href = href;
  return('http://' + link.hostname);
}