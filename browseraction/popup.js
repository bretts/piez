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

	document.getElementById("piezModeBrowserFormatCompare").onclick = function() {
		chrome.extension.sendMessage({
	        type: "piez-browser-format-compare"
	    });
	}

	var setFormField = function(piezSettings) {
		result = localStorage.getItem("piezCurrentState");
		document.getElementById(result).checked = true;
	}

	setFormField();
}