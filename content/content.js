chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	if (request.type == "request-alternate-browser-formats") {
		var allBrowserFormats = ['generic', 'chrome', 'safari', 'ie'];
		allBrowserFormats.forEach(function(entry) {
	       var http = new XMLHttpRequest();
	       	var outgoing_url;
	       	if(request.url.indexOf('?') == -1) {
	       		outgoing_url = request.url + '?imFormat=' + entry;
	       	}
	       	else {
	       		outgoing_url = request.url + '&imFormat=' + entry;	
	       	}

	        http.open('HEAD', outgoing_url);
	        http.onreadystatechange = function() {
	            if (this.readyState == this.DONE) {
	                 if(this.status == 200) {
	                  	console.log("success: " + outgoing_url)
	                 }
	                 else {
	                 	console.log("failure: " + outgoing_url)
	                 }
	            }
	        };
	        http.send();
	    });
	    sendResponse({recievedXhrRequest: request.url});
	}
});

