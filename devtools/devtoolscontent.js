var PiezController = {}

window.onload = function() {
	PiezController.pageref              = 'pageref_0';
	PiezController.current_page         = new Page();
	PiezController.current_display_mode = "piezModeSimple";

	chrome.devtools.network.onRequestFinished.addListener(function(http_transaction) {
		if(http_transaction.pageref != PiezController.pageref) {

			chrome.extension.sendMessage({
				type: "use-piez-on-page"
			});

			chrome.storage.local.get("piezCurrentState", function(state) {
				PiezController.current_page         = new Page();
				PiezController.pageref              = http_transaction.pageref;
				PiezController.current_display_mode = state["piezCurrentState"];
			 });
		}
		parseResult(http_transaction, PiezController.current_page);
		displayResult(PiezController.current_page, PiezController.current_display_mode);
	});
}

var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}