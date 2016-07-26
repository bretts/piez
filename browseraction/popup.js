window.onload = function() {

	document.getElementById("piezModeOff").onclick = function() {
		chrome.runtime.sendMessage({
	        type: "piez-off"
	    });
	};

	document.getElementById("piezModeSimple").onclick = function() {
		chrome.runtime.sendMessage({
	        type: "piez-simple"
	    });
	};

	document.getElementById("piezModeAdvanced").onclick = function() {
		chrome.runtime.sendMessage({
	        type: "piez-advanced"
	    });
	};

	/*document.getElementById("piezModeBrowserFormatCompare").onclick = function() {
		chrome.runtime.sendMessage({
	        type: "piez-browser-format-compare"
	    });
	};*/

    document.getElementById("piezModeCPI").onclick = function() {
        chrome.runtime.sendMessage({
            type: "piez-cpi"
        });
    };

	var setFormField = function(piezSettings) {
		result = localStorage.getItem("piezCurrentState");
		document.getElementById(result).checked = true;
	};

	setFormField();
};