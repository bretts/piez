function displayBytes(bytes) {
	var prefixes = ["","Ki","Mi","Gi","Ti","Pi","Ei"];
	var value    = parseInt(bytes);

	for (var prefix = 0; value >= 1023.995 && prefix < prefixes.length - 1; ++prefix) value /= 1024;

	if (0 != prefix) value = value.toFixed(2);
	return value + " " + prefixes[prefix] + "B";
}

function displayPercentChange(originalSize, transformedSize) {
	var originalSizeInt = parseInt(originalSize);
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
}

function showSummaryTable(page) {
	document.getElementById('conversionSummary').style.display = 'block';
}

function showDetailsTable() {
	document.getElementById('conversionSummary').style.display = 'block';
	document.getElementById('conversionDetails').style.display = 'block';
}

function hidePiezNotEnabledTable() {
	document.getElementById('notEnabled').style.display = 'none';
}

function showPiezNotEnabledTable(message_html) {
	document.getElementById('conversionSummary').style.display = 'none';
	document.getElementById('conversionDetails').style.display = 'none';
	document.getElementById('notEnabled').style.display        = 'block';
	document.getElementById('notEnabled').innerHTML            = "<div class='piezConfigMessage'>" + message_html + '</div>'
}

function updateSummaryTable(page) {
	document.getElementById('totalIMImagesTransformed').textContent = page.totalIMImagesTransformed.toString();
	document.getElementById('totalICImagesTransformed').textContent = page.totalICImagesTransformed.toString();
	document.getElementById('totalByteReduction').textContent       = displayBytes(page.totalOriginalSize - (page.totalImTransformSize + page.totalIcTransformSize));
	document.getElementById('pctByteReduction').innerHTML           = displayPercentChange(page.totalOriginalSize, (page.totalImTransformSize + page.totalIcTransformSize));
}

function fileSizeDiff(originalSize, transformedSize) {
	if(parseInt(originalSize) > parseInt(transformedSize)) {
		return '<td class="success">' + displayBytes(transformedSize) + '</td>';	
	}
	else if (parseInt(originalSize) < parseInt(transformedSize)){
		return '<td class="error">' + displayBytes(transformedSize) + '</td>';	
	}
	else {
		return '<td class="warning">' + displayBytes(transformedSize) + '</td>';		
	}
}

function bindRowHighlightingListener() {
	var rows = document.querySelectorAll('.urlInfo');
	for (var i = 0, len = rows.length; i < len; i++) {
		rows[i].addEventListener('mouseover', highlightRow);
		rows[i].addEventListener('mouseout', unHighlightRow);
	}
}

function highlightRow() {
	this.className  = 'urlInfoHover';
}

function unHighlightRow() {
	this.className  = 'urlInfo';
}