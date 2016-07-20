function updateImDetailsTable(page, display_mode) {
	switch(display_mode) {
		case "piezModeSimple":
			updateImSimpleTable(page);
			break;
		case "piezModeAdvanced":
			updateImAdvandedTable(page);
			break;
	}
}

function updateImSimpleTable(page) {
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

function updateImAdvandedTable(page) {
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

function updateIcDetailsTable(page) {
	var icDetailsTable	= '<table id="icDetailsTable" class="transformedResults"><tr><th>URL</th><th>Transformed Image Type</th><th>Original Size</th><th>Transformed Size</th><th>% Bytes Change</th></tr>';
	page.icDownloadDetails.forEach(function(detail) {
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

function getEncodingQuality(contentType, encodingQuality) {
	if(contentType == 'image/gif' || contentType == 'image/png') {
		return "N/A";
	}
	else {
		return encodingQuality;
	}
}

function bindImageCompareListener() {
	var urls = document.querySelectorAll('.imageCompareUrl');
	for (var i = 0, len = urls.length; i < len; i++) {
			urls[i].addEventListener('click', showImageCompare);
	}
}

function hideImageCompare() {
	document.getElementById('imageBox').style.display = 'none';
}

function showImageCompare() {
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