PiezController                      = {}
PiezController.current_page         = new Page();
PiezController.current_display_mode = 'piezModeSimple';

window.onload = function() {
	chrome.devtools.network.onNavigated.addListener(function(http_transaction) {
		hideImageCompare();
		PiezController.current_page = new Page();

		chrome.extension.sendMessage({
			type: "update-piez-analytics"
		});

		PiezController.current_display_mode = localStorage.getItem("piezCurrentState");
	});

	chrome.devtools.network.onRequestFinished.addListener(function(http_transaction) {
		ParseHeaders(http_transaction, PiezController.current_page, PiezController.current_display_mode);
		Report(PiezController.current_page, PiezController.current_display_mode)
	});
};