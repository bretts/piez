(function(global) {
	'use strict';

	global.displayBytes = function(bytes){
		var prefixes = ["","Ki","Mi","Gi","Ti","Pi","Ei"];
		var value    = parseInt(bytes);

		for (var prefix = 0; value >= 1023.995 && prefix < prefixes.length - 1; ++prefix) value /= 1024;

		if (0 !== prefix) value = value.toFixed(2);
		return value + " " + prefixes[prefix] + "B";
	};

	global.displayPercentChange = function(originalSize, transformedSize) {
		var originalSizeInt    = parseInt(originalSize);
		var transformedSizeInt = parseInt(transformedSize);

		var pctChange = (((transformedSizeInt/originalSizeInt) - 1) * 100).toFixed(2);

		if(transformedSizeInt == originalSizeInt) {
			return '<span class="warning">  ' + '0%' + '</td>';
		}
		else if(pctChange > 0) {
			return '<span class="error"> +' + Math.abs(pctChange).toString() + "%" + '</td>';
		}
		else if(pctChange < 0) {
			return '<span class="success"> -' + Math.abs(pctChange).toString() + "%" + '</td>';
		}
	};

	global.showSummaryTable = function(display_mode) {
		if(display_mode == 'piezModeBrowserFormatCompare') {
			document.getElementById('conversionSummary').style.display = 'none';
			document.getElementById('browserFormatCompareSummary').style.display = 'block';
		}
		else {
			document.getElementById('browserFormatCompareSummary').style.display = 'none';
			document.getElementById('conversionSummary').style.display = 'block';
		}
	};

	global.showDetailsTable = function() {
		document.getElementById('conversionDetails').style.display = 'block';
	};

	global.hidePiezNotEnabledTable = function() {
		document.getElementById('notEnabled').style.display = 'none';
	};

	global.showPiezNotEnabledTable = function(message_html) {
		document.getElementById('conversionSummary').style.display = 'none';
		document.getElementById('conversionDetails').style.display = 'none';
		document.getElementById('notEnabled').style.display        = 'block';
		document.getElementById('notEnabled').innerHTML            = "<div class='piezConfigMessage'>" + message_html + '</div>';
	};

	global.fileSizeDiff = function(originalSize, transformedSize) {
		if(parseInt(originalSize) > parseInt(transformedSize)) {
			return '<td class="success">' + displayBytes(transformedSize) + '</td>';
		}
		else if (parseInt(originalSize) < parseInt(transformedSize)){
			return '<td class="error">' + displayBytes(transformedSize) + '</td>';
		}
		else {
			return '<td class="warning">' + displayBytes(transformedSize) + '</td>';
		}
	};

	global.bindRowHighlightingListener = function() {
		var rows = document.querySelectorAll('.urlInfo');
		for (var i = 0, len = rows.length; i < len; i++) {
			rows[i].addEventListener('mouseover', function() { this.className = 'urlInfoHover'; });
			rows[i].addEventListener('mouseout',  function() { this.className = 'urlInfo'; });
		}
	};
})(this);