var PiezController = {}

window.onload = function() {
	PiezController.current_page         = new Page();
	PiezController.current_display_mode = "piezModeSimple";

	chrome.devtools.network.onNavigated.addListener(function(http_transaction) {
		PiezController.current_page = new Page();

		chrome.extension.sendMessage({
			type: "use-piez-on-page"
		});

		chrome.storage.local.get("piezCurrentState", function(state) {
			PiezController.current_display_mode = state["piezCurrentState"];
		 });
	});

	chrome.devtools.network.onRequestFinished.addListener(function(http_transaction) {
		parseResult(http_transaction, PiezController.current_page);
		displayResult(PiezController.current_page, PiezController.current_display_mode);
	});
}

var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}