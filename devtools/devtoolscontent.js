window.onload = function() {
	window.pageref = 'pageref_0';
	
	chrome.devtools.network.onRequestFinished.addListener(function(request) {
		if(request.pageref != window.pageref) {
			ga('send', 'pageview', '/devtoolscontent.html');
			window.pageref = request.pageref;
			page = new Page();
		}
		parseResult(request, page);
		displayResult(page);
	});
}

var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}