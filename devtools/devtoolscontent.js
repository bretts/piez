var PiezController = {}

window.onload = function() {
	PiezController.current_page         = new Page();
	PiezController.current_display_mode = "piezModeSimple";

	chrome.devtools.network.onNavigated.addListener(function(http_transaction) {
		hideImageCompare();
		PiezController.current_page = new Page();

		chrome.extension.sendMessage({
			type: "update-piez-analytics"
		});

		chrome.storage.local.get("piezCurrentState", function(state) {
			PiezController.current_display_mode = state["piezCurrentState"];
		 });
	});

	chrome.devtools.network.onRequestFinished.addListener(function(http_transaction) {
		ParseHeaders(http_transaction, PiezController.current_page);
		Report(PiezController.current_page, PiezController.current_display_mode);
	});
};