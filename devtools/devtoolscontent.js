var PiezController = {}

window.onload = function() {
	PiezController.pageref              = 'pageref_0';
	PiezController.current_page         = new Page();
	PiezController.current_display_mode = "piezModeSimple";

	chrome.devtools.network.onRequestFinished.addListener(function(request) {
		if(request.pageref != PiezController.pageref) {

			chrome.extension.sendMessage({
				type: "use-piez-on-page"
			});

			chrome.storage.local.get("piezCurrentState", function(result) {
				PiezController.current_page = new Page();
				PiezController.pageref = request.pageref;
				PiezController.current_display_mode = result["piezCurrentState"];
			 });
		}
		parseResult(request, PiezController.current_page);
		displayResult(PiezController.current_page, PiezController.current_display_mode);
	});
}

var bglog = function(obj) {
	if(chrome && chrome.runtime) {
		chrome.runtime.sendMessage({type: "bglog", obj: obj});
	}
}