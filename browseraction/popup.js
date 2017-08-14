window.onload = function() {

	document.getElementById("piezModeOff").onclick = function() {
		chrome.runtime.sendMessage({
			type: "piez-off"
		});
	};

	document.getElementById("piezModeImSimple").onclick = function() {
		chrome.runtime.sendMessage({
			type: "piez-im-simple"
		});
	};

	document.getElementById("piezModeImAdvanced").onclick = function() {
		chrome.runtime.sendMessage({
			type: "piez-im-advanced"
		});
	};

	document.getElementById("piezModeA2").onclick = function() {
		chrome.runtime.sendMessage({
			type: "piez-a2"
		});
	};

	document.getElementById("piezModeRoSimple").onclick = function() {
		chrome.runtime.sendMessage({
			type: "piez-ro-simple"
		});
	};

	document.getElementById("piezModeRoAdvanced").onclick = function() {
		chrome.runtime.sendMessage({
			type: "piez-ro-advanced"
		});
	};

	var setFormField = function(piezSettings) {
		chrome.storage.local.get("piezCurrentState", function(result) {
			document.getElementById(result["piezCurrentState"]).checked = true;
		});
	};

	setFormField();
};