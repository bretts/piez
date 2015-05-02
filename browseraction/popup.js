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
		document.getElementById(JSON.parse(window.localStorage['piezSettings']).currentState).checked = true;
	}

	setFormField();
}