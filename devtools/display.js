function displayResult(page, display_mode) {
	if(page.localCacheEnabled == true) {
		displayPiezNotEnabledProperly("<p>In order for Piez to work properly, you must disable cache while devtools is open. The following steps are required:</p><ol><li>Click on the dev tools settings (3 vertical dots in the top right corner of this pane) to open up the General Settings pane, then, select the 'Disable cache (while DevTools is open)' checkbox</li>.<li>Then, click and hold the Chrome browser re-load button and select 'Empty Cache and Hard Reload'</li></ol>");
	}
	else if(display_mode == 'piezModeOff') {
		displayPiezNotEnabledProperly("<p>Piez Is Not Currently Enabled. The following steps are required:</p><ol><li>Enable Piez by clicking the Piez button in the top right of the browser and selecting enable.</li><li>Click the Chrome browser refresh button</li></ol>");
	}
	else {
		displayConversionDetails()
		displaySummary(page);
		displayImDetailsTable(page, display_mode);
		displayIcDetailsTable(page);
	}
	bindRowHighlightingListener();
	bindImageCompareListener();
}

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

function displaySummary(page) {
	document.getElementById('totalIMImagesTransformed').textContent = page.totalIMImagesTransformed.toString();
	document.getElementById('totalICImagesTransformed').textContent = page.totalICImagesTransformed.toString();
	document.getElementById('totalByteReduction').textContent       = displayBytes(page.totalOriginalSize - (page.totalImTransformSize + page.totalIcTransformSize));
	document.getElementById('pctByteReduction').innerHTML           = displayPercentChange(page.totalOriginalSize, (page.totalImTransformSize + page.totalIcTransformSize));
}

function displayImDetailsTable(page, display_mode) {
	switch(display_mode) {
		case "piezModeSimple":
			displayImSimpleTable(page);
			break;
		case "piezModeAdvanced":
			displayImAdvandedTable(page);
			break;
	}
}

function displayImSimpleTable(page) {
	var imDetailsTable	= '<table id="imDetailsTable" class="transformedResults"><tr><th>URL</th><th>Transformed Image Type</th><th>Original Size</th><th>Transformed Size</th><th>% Bytes Change</th></tr>';
	page.imDownloadDetails.forEach(function(detail) {
		imDetailsTable += '<tr class="urlInfo">'; 
		imDetailsTable += '<td class="urlData imageCompareUrl" data-width="' + detail.originalWidth + '" ' + 'data-url="' + detail.url + '">' + '<a href="' + "#" + '">' + detail.url + '</a>' + '</td>';
		imDetailsTable += '<td>' + detail.contype + '</td>';
		imDetailsTable += '<td>' + displayBytes(detail.orgsize) + '</td>';
		imDetailsTable += fileSizeDiff(detail.orgsize, detail.contlen);
		imDetailsTable += '<td>' + displayPercentChange(detail.orgsize, detail.contlen) + '</td>';
		imDetailsTable += '</tr>';
		document.getElementById('imConversionBox').style.display = 'block';
	});
	imDetailsTable += '</table>';
	document.getElementById('imDetailsTable').innerHTML = imDetailsTable;
}

function displayImAdvandedTable(page) {
	var imDetailsTable	= '<table id="imDetailsTable" class="transformedResults"><tr><th>URL</th><th>Transformed Image Type</th><th>Original Width</th><th>Pixel Density</th><th>File Chosen</th><th>Encoding Quality</th><th>Original Size</th><th>Transformed Size</th><th>% Bytes Change</th></tr>';
	page.imDownloadDetails.forEach(function(detail) {
		imDetailsTable += '<tr class="urlInfo">'; 
		imDetailsTable += '<td class="urlData imageCompareUrl" data-width="' + detail.originalWidth + '" ' + 'data-url="' + detail.url + '">' + '<a href="' + "#" + '">' + detail.url + '</a>' + '</td>';
		
		imDetailsTable += '<td>' + detail.contype + '</td>';
		imDetailsTable += '<td>' + detail.originalWidth + 'px</td>';
		imDetailsTable += '<td>' + detail.pixelDensity + '</td>';
		imDetailsTable += '<td>' + detail.filename + '</td>';
		imDetailsTable += '<td>' + getEncodingQuality(detail.contype, detail.encQuality) + '</td>';
		imDetailsTable += '<td>' + displayBytes(detail.orgsize) + '</td>';
		imDetailsTable += fileSizeDiff(detail.orgsize, detail.contlen);
		imDetailsTable += '<td>' + displayPercentChange(detail.orgsize, detail.contlen) + '</td>';
		imDetailsTable += '</tr>';
		document.getElementById('imConversionBox').style.display = 'block';
	});
	imDetailsTable += '</table>';
	document.getElementById('imDetailsTable').innerHTML = imDetailsTable;
}

function displayIcDetailsTable(page) {
	var icDetailsTable	= '<table id="icDetailsTable" class="transformedResults"><tr><th>URL</th><th>Transformed Image Type</th><th>Original Size</th><th>Transformed Size</th><th>% Bytes Change</th></tr>';
	page.icDownloadDetails.forEach(function(detail) {
		console.log(detail);
		icDetailsTable += '<tr class="urlInfo">';
		icDetailsTable += '<td class="urlData"' + 'data-url="' + detail.url + '">' + '<a href="' + detail.url + '"' + ' target="_blank"' + '>' + detail.url + '</a>' + '</td>';
		icDetailsTable += '<td>' + detail.contype + '</td>';
		icDetailsTable += '<td>' + displayBytes(detail.orgsize) + '</td>';
		icDetailsTable += fileSizeDiff(detail.orgsize, detail.contlen);
		icDetailsTable += '<td>' + displayPercentChange(detail.orgsize, detail.contlen) + '</td>';
		icDetailsTable += '</tr>';
		document.getElementById('icConversionBox').style.display = 'block';
	});
	icDetailsTable += '</table>';
	document.getElementById('icDetailsTable').innerHTML = icDetailsTable;
}

function displayConversionDetails() {
	document.getElementById('conversionSummary').style.display = 'block';
	document.getElementById('conversionDetails').style.display = 'block';
	document.getElementById('notEnabled').style.display        = 'none';
}

function displayPiezNotEnabledProperly(message_html) {
	document.getElementById('conversionSummary').style.display = 'none';
	document.getElementById('conversionDetails').style.display = 'none';
	document.getElementById('notEnabled').style.display        = 'block';
	document.getElementById('notEnabled').innerHTML            = "<div class='piezConfigMessage'>" + message_html + '</div>'
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

function getEncodingQuality(contentType, encodingQuality) {
	if(contentType == 'image/gif' || contentType == 'image/png') {
		return "N/A";
	}
	else {
		return encodingQuality;
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
	this.className  = 'imageCompareTableHover';
}

function unHighlightRow() {
	this.className  = 'urlInfo';
}

function bindImageCompareListener() {
	var urls = document.querySelectorAll('.imageCompareUrl');
	for (var i = 0, len = urls.length; i < len; i++) {
			urls[i].addEventListener('click', dispayImageCompare);
	}
}

function dispayImageCompare() {
	ga('send', 'event', 'displayImage', this.getAttribute('data-url'));

	document.getElementById('imageBox').style.display = 'none';

	if(this.getAttribute('data-url').indexOf('?') == -1) {
		origImage = (this.getAttribute('data-url') + '?imbypass=true');
	}
	else {
		origImage = (this.getAttribute('data-url') + '&imbypass=true');	
	}
	tranImage = this.getAttribute('data-url')
	
	i = new ImageToggle();
	i.addImages(origImage, tranImage);

	document.getElementById('originalImage').onclick = function() {
		window.open(i.originalImage.src);
	}
	document.getElementById('transformedImage').onclick = function() {
		window.open(i.transformedImage.src);
	}
	document.getElementById('imageComareUrlTitle').href = this.getAttribute('data-url');
	document.getElementById('imageComareUrlTitle').innerHTML = this.getAttribute('data-url');
	document.getElementById('imageBox').style.display = 'block';
}
