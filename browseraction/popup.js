window.onload = function() {

	document.getElementById("piezModeOff").onclick = function() {
		chrome.extension.sendMessage({
	        type: "piez-off"
	    });
	}

	document.getElementById("piezModeSimple").onclick = function() {
		chrome.extension.sendMessage({
	        type: "piez-simple"
	    });
	}

	document.getElementById("piezModeAdvanced").onclick = function() {
		chrome.extension.sendMessage({
	        type: "piez-advanced"
	    });
	}

	var setFormField = function(piezSettings) {
		chrome.storage.local.get("piezCurrentState", function(result) {
			document.getElementById(result["piezCurrentState"]).checked = true;
		});
	}

	setFormField();
}