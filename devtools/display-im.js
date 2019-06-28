function updateImDetailsTable(page, display_mode) {
	switch (display_mode) {
		case "piez-im-simple":
			updateImSimpleTable(page);
			updateVideoDetailsTable(page);
			break;
		case "piez-im-advanced":
			updateImAdvancedTable(page);
			updateVideoAdvancedTable(page);
			break;
		default:
			updateImSimpleTable(page);
			updateVideoDetailsTable(page);
			break;
	}
}
//Image
function updateImSimpleTable(page) {
	var imDetailsTable = '<table id="imageSimple" class="detailed-results"><tr><th>Image URL</th><th>Transformed Type</th><th>Original Size</th><th>Transformed Size</th><th>% Bytes Change</th></tr>';
	page.imDownloadDetails.forEach(function (detail) {
		if (/image/i.test(detail.contype)) {
			imDetailsTable += '<tr id="row123"  class="urlInfo">';
			imDetailsTable += '<td class="urlData imageCompareUrl" data-width="' + detail.originalWidth + '" ' + 'data-url="' + detail.url + '">' + '<a href="' + "#" + '">' + detail.url + '</a>' + '</td>';
			imDetailsTable += '<td>' + detail.contype.substring(6) + '</td>';
			imDetailsTable += '<td>' + displayBytes(detail.orgsize) + '</td>';
			imDetailsTable += '<td class="transformed">' + displayBytes(detail.contlen) + '</td>';
			imDetailsTable += '<td>' + displayPercentChange(detail.orgsize, detail.contlen) + '</td>';
			imDetailsTable += '</tr>';
			document.getElementById('detailsBox2').style.display = 'block';
			page.totalImageMb = (((detail.orgsize / detail.contlen) - 1)).toFixed(2);
		}
	});
	imDetailsTable += '</table>';
	document.getElementById('detailsBox2Table').innerHTML = imDetailsTable;
	var rows = document.getElementById('imageSimple').getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;

	if (rows < 2) {
		document.getElementById('detailsBox2Table').style.visibility = "collapse";
	} else {
		document.getElementById('detailsBox2Table').style.visibility = "visible";
	}

}
//Video
function updateVideoDetailsTable(page) {
	var imDetailsTable = '<table id="VideoSimple" class="detailed-results"><tr><th>Video URL</th><th>Transformed Type</th><th>Original Size</th><th>Transformed Size</th><th>% Bytes Change</th></tr>';
	page.imDownloadDetails.forEach(function (detail) {
		if (/video/i.test(detail.contype)) {
			imDetailsTable += '<tr class="urlInfo">';
			imDetailsTable += '<td class="urlData videoCompareUrl" data-width="' + detail.originalWidth + '" ' + 'data-url="' + detail.url + '">' + '<a href="' + "#" + '">' + detail.url + '</a>' + '</td>';
			imDetailsTable += '<td>' + detail.contype.substring(6) + '</td>';
			imDetailsTable += '<td>' + displayBytes(detail.orgsize) + '</td>';
			imDetailsTable += '<td class="transformed">' + displayBytes(detail.contlen) + '</td>';
			imDetailsTable += '<td>' + displayPercentChange(detail.orgsize, detail.contlen) + '</td>';
			imDetailsTable += '</tr>';
			document.getElementById('detailsBox1').style.display = 'block';
		}
	});
	imDetailsTable += '</table>';
	document.getElementById('detailsBox1Table').innerHTML = imDetailsTable;


	var rows = document.getElementById('VideoSimple').getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;

	if (rows <= 1) {
		document.getElementById('detailsBox1Table').style.visibility = "collapse";
	} else {
		document.getElementById('detailsBox1Table').style.visibility = "visible";
	}
}

function updateImBrowserFormatCompareTable(page) {
	var imDetailsTable = '<table class="detailed-results"><tr><th>Image URL</th><th>Original Size</th><th>Generic</th><th>Chrome</th><th>Safari</th><th>IE</th>';
	page.imDownloadDetails.forEach(function (detail) {
		imDetailsTable += '<tr class="urlInfo">';
		imDetailsTable += '<td class="urlData" data-width="' + detail.originalWidth + '" ' + 'data-url="' + detail.url + '">' + '<a href="' + "#" + '">' + detail.url + '</a>' + '</td>';
		imDetailsTable += '<td>' + displayBytes(detail.orgsize) + '</td>';

		try {
			imDetailsTable += '<td>' + displayBytes(detail.browserFormats.generic.contlen) + '</td>';
		} catch (err) {
			imDetailsTable += '<td></td>';
		}

		try {
			imDetailsTable += '<td>' + displayBytes(detail.browserFormats.chrome.contlen) + '</td>';
		} catch (err) {
			imDetailsTable += '<td></td>';
		}

		try {
			imDetailsTable += '<td>' + displayBytes(detail.browserFormats.safari.contlen) + '</td>';
		} catch (err) {
			imDetailsTable += '<td></td>';
		}

		try {
			imDetailsTable += '<td>' + displayBytes(detail.browserFormats.ie.contlen);
		} catch (err) {
			imDetailsTable += '<td></td>';
		}

		imDetailsTable += '</tr>';
		document.getElementById('detailsBox1').style.display = 'block';
	});
	imDetailsTable += '</table>';
	document.getElementById('detailsBox1Table').innerHTML = imDetailsTable;
}
//Image
function updateImAdvancedTable(page) {
	var imDetailsTable = '<table id="imageAdvanced" class="detailed-results"><tr><th>Image URL</th><th>Transformed Type</th><th>Original Width</th><th>Encoding Quality</th><th>File Chosen</th><th>Original Size</th><th>Transformed Size</th><th>% Bytes Change</th></tr>';
	page.imDownloadDetails.forEach(function (detail) {
		if (/image/i.test(detail.contype)) {
			imDetailsTable += '<tr class="urlInfo">';
			imDetailsTable += '<td class="urlData imageCompareUrl" data-width="' + detail.originalWidth + '" ' + 'data-url="' + detail.url + '">' + '<a href="' + "#" + '">' + detail.url + '</a>' + '</td>';
			imDetailsTable += '<td>' + detail.contype.substring(6) + '</td>';
			imDetailsTable += '<td>' + detail.originalWidth + 'px</td>';
			//imDetailsTable += '<td>' + detail.pixelDensity + '</td>';
			imDetailsTable += '<td>' + getEncodingQuality(detail.contype, detail.encQuality) + '</td>';
			imDetailsTable += '<td>' + detail.filename + '</td>';
			imDetailsTable += '<td>' + displayBytes(detail.orgsize) + '</td>';
			imDetailsTable += '<td class="transformed">' + displayBytes(detail.contlen) + '';
			imDetailsTable += '<td>' + displayPercentChange(detail.orgsize, detail.contlen) + '</td>';
			imDetailsTable += '</tr>';
			document.getElementById('detailsBox2').style.display = 'block';
		}
	});
	imDetailsTable += '</table>';
	document.getElementById('detailsBox2Table').innerHTML = imDetailsTable;

	var rows = document.getElementById("imageAdvanced").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;
	if (rows < 2) {
		document.getElementById('detailsBox2Table').style.visibility = "collapse";
	} else {
		document.getElementById('detailsBox2Table').style.visibility = "visible";
	}

}
//Video
function updateVideoAdvancedTable(page) {
	var imDetailsTable = '<table id="videoAdvanced" class="detailed-results"><tr><th>Video URL</th><th>Transformed Type</th><th>Original Width</th><th>Encoding Quality</th><th>File Chosen</th><th>Original Size</th><th>Transformed Size</th><th>% Bytes Change</th></tr>';
	page.imDownloadDetails.forEach(function (detail) {
		page.totalVideoMb += (((parseFloat(detail.orgsize) / parseFloat(detail.contlen))));
		if (/video/i.test(detail.contype)) {
			imDetailsTable += '<tr class="urlInfo">';
			imDetailsTable += '<td class="urlData videoCompareUrl" data-width="' + detail.originalWidth + '" ' + 'data-url="' + detail.url + '">' + '<a href="' + "#" + '">' + detail.url + '</a>' + '</td>';
			imDetailsTable += '<td>' + detail.contype.substring(6) + '</td>';
			imDetailsTable += '<td>' + detail.originalWidth + 'px</td>';
			//imDetailsTable += '<td>' + detail.pixelDensity + '</td>';
			imDetailsTable += '<td>' + getEncodingQuality(detail.contype, detail.encQuality) + '</td>';
			imDetailsTable += '<td>' + detail.filename + '</td>';
			imDetailsTable += '<td>' + displayBytes(detail.orgsize) + '</td>';
			imDetailsTable += '<td class="transformed">' + displayBytes(detail.contlen) + '</td>';
			imDetailsTable += '<td>' + displayPercentChange(detail.orgsize, detail.contlen) + '</td>';
			imDetailsTable += '</tr>';
			document.getElementById('detailsBox1').style.display = 'block';
		}

	});
	imDetailsTable += '</table>';
	document.getElementById('detailsBox1Table').innerHTML = imDetailsTable;
	var rows = document.getElementById("videoAdvanced").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;
	page.totalVidTransformed = rows - 1;

	if (rows < 2) {
		document.getElementById('detailsBox1Table').style.visibility = "collapse";
	} else {
		document.getElementById('detailsBox1Table').style.visibility = "visible";
	}
}

function updateIcDetailsTable(page) {
	var icDetailsTable = '<table class="detailed-results"><tr><th>URL</th><th>Transformed Image Type</th><th>Original Size</th><th>Transformed Size</th><th>% Bytes Change</th></tr>';
	page.icDownloadDetails.forEach(function (detail) {
		icDetailsTable += '<tr class="urlInfo">';
		icDetailsTable += '<td class="urlData"' + 'data-url="' + detail.url + '">' + '<a href="' + detail.url + '"' + ' target="_blank"' + '>' + detail.url + '</a>' + '</td>';
		icDetailsTable += '<td>' + detail.contype + '</td>';
		icDetailsTable += '<td>' + displayBytes(detail.orgsize) + '</td>';
		icDetailsTable += '<td class="transformed">' + displayBytes(detail.contlen) + '</td>';
		icDetailsTable += '<td>' + displayPercentChange(detail.orgsize, detail.contlen) + '</td>';
		icDetailsTable += '</tr>';
		document.getElementById('detailsBox3').style.display = 'block';
	});
	icDetailsTable += '</table>';
	document.getElementById('detailsBox3Table').innerHTML = icDetailsTable;
}

function updateNonImIcDetailsTable(page) {
	var nonImIcDetailsTable = '<table class="detailed-results"><tr><th>URL</th><th>Image Type</th><th>Size</th>';
	page.nonImOrIcImageDetails.forEach(function (detail) {
		nonImIcDetailsTable += '<tr class="urlInfo">';
		nonImIcDetailsTable += '<td class="urlData"' + 'data-url="' + detail.url + '">' + '<a href="' + detail.url + '"' + ' target="_blank"' + '>' + detail.url + '</a>' + '</td>';
		nonImIcDetailsTable += '<td>' + detail.contype.substring(6) + '</td>';
		nonImIcDetailsTable += '<td>' + displayBytes(detail.contlen) + '</td>';
		nonImIcDetailsTable += '</tr>';
		document.getElementById('detailsBox4').style.display = 'block';
		document.getElementById('nonImIcBytes').textContent = displayBytes(page.totalNonImOrIcSize);
	});
	nonImIcDetailsTable += '</table>';
	document.getElementById('detailsBox4Table').innerHTML = nonImIcDetailsTable;
}
//Removed for now
function getEncodingQuality(contentType, encodingQuality) {
	if (contentType == 'image/gif' || contentType == 'image/png') {
		return "N/A";
	}
	else if (encodingQuality == 'IMG-2834') {
		return '-';
	}
	else {
		return encodingQuality;
	}
}

function bindCompareListener() {
	var imageUrls = document.querySelectorAll('.imageCompareUrl');
	var videoUrls = document.querySelectorAll('.videoCompareUrl');

	for (var i = 0, len = imageUrls.length; i < len; i++) {
		imageUrls[i].addEventListener('click', showImageCompare);
	}
	
	for (var i = 0, len = videoUrls.length; i < len; i++) {
		videoUrls[i].addEventListener('click', showVideoCompare);
	}	
	var buttonClose = document.getElementById('close');
	//Close image toggle
	buttonClose.onclick = function(){
		document.getElementById('imageBox').style.display="none";
	}
}

function hideImageCompare() {
	document.getElementById('imageBox').style.display = 'none';
	document.getElementById('imageCompare').style.display = 'none';
}

function hideVideoCompare() {
	document.getElementById('imageBox').style.display = 'none';
	document.getElementById('videoCompare').style.display = 'none';
}

function showImageCompare() {
	//ga('send', 'event', 'displayImage', this.getAttribute('data-url'));

	hideVideoCompare();

	let origImage = document.getElementById('originalImage');
	let tranImage = document.getElementById('transformedImage');
	origImage.style.display = 'none';
	tranImage.style.display = 'none';
	document.getElementById("originalImageText").style.display = 'none';
	document.getElementById("originalImageValues").style.display = 'none';
	document.getElementById("transformedImageText").style.display = 'none';
	document.getElementById("transformedImageValues").style.display = 'none';
	document.getElementById("imageCompareOrig").style.margin = '10% 20%';
	document.getElementById("imageCompareTran").style.margin = '10% 20%';
	document.getElementById("imageAjaxLoader1").style.display = 'block';
	document.getElementById("imageAjaxLoader2").style.display = 'block';

	let origImageLink, tranImageLink, tranImagePercent;
	if (this.getAttribute('data-url').indexOf('?') == -1) {
		origImageLink = (this.getAttribute('data-url') + '?imbypass=true');
	} else {
		origImageLink = (this.getAttribute('data-url') + '&imbypass=true');
	}
	tranImageLink = this.getAttribute('data-url');
	tranImagePercent = this.parentElement.lastChild.innerHTML;

	origImage.src = origImageLink;
	origImage.onload = () => {
		document.getElementById("imageAjaxLoader1").style.display = 'none';
		document.getElementById("imageCompareOrig").style.margin = '0';
		document.getElementById("originalImageText").style.display = 'block';
		document.getElementById("originalImageValues").style.display = 'block';
		origImage.style.display = 'block';
		origImage.onclick = function () {
			window.open(origImageLink);
		};
	};
	tranImage.src = tranImageLink;
	tranImage.onload = () => {
		document.getElementById("imageAjaxLoader2").style.display = 'none';
		document.getElementById("imageCompareTran").style.margin = '0';
		document.getElementById("transformedImageText").style.display = 'block';
		document.getElementById("transformedImageValues").style.display = 'block';
		tranImage.style.display = 'block';
		tranImage.onclick = function () {
			window.open(tranImageLink);
		};
	};

	document.getElementById('compareTitle').innerHTML = '<img src="../icons/ImageLight.png">' + '<span>Image Comparison</span>';
	document.getElementById('compareUrlTitle').innerHTML = "Image link";
	document.getElementById('compareUrlLink').href = tranImageLink;
	document.getElementById('compareUrlLink').innerHTML = tranImageLink;
	document.getElementById('originalImageValues').innerHTML = '<p>' + this.parentElement.children[5].innerHTML + '</p>';
	document.getElementById('transformedImageValues').innerHTML = tranImagePercent + '<p>' + this.parentElement.children[6].innerHTML + '</p>';
	document.getElementById('imageBox').style.display = 'block';
	document.getElementById('imageCompare').style.display = 'block';
}

function showVideoCompare() {
	ga('send', 'event', 'displayImage', this.getAttribute('data-url'));

	hideImageCompare();

	let origVideo = document.getElementById('originalVideo');
	let tranVideo = document.getElementById('transformedVideo');
	origVideo.style.display = 'none';
	tranVideo.style.display = 'none';
	document.getElementById("originalVideoText").style.display = 'none';
	document.getElementById("originalVideoValues").style.display = 'none';
	document.getElementById("transformedVideoText").style.display = 'none';
	document.getElementById("transformedVideoValues").style.display = 'none';
	document.getElementById("videoCompareOrig").style.margin = '10% 20%';
	document.getElementById("videoCompareTran").style.margin = '10% 20%';
	document.getElementById("videoAjaxLoader1").style.display = 'block';
	document.getElementById("videoAjaxLoader2").style.display = 'block';

	let origVideoLink, tranVideoLink, tranVideoPercent;
	if (this.getAttribute('data-url').indexOf('?') == -1) {
		origVideoLink = (this.getAttribute('data-url') + '?imbypass=true');
	} else {
		origVideoLink = (this.getAttribute('data-url') + '&imbypass=true');
	}
	tranVideoLink = this.getAttribute('data-url');
	tranVideoPercent = this.parentElement.lastChild.innerHTML;

	let promise = new Promise(resolve => {
		let loaded = 0;
		origVideo.addEventListener('loadedmetadata', () => {
			loaded++;
			if (loaded === 2) {
				resolve();
			}
		});
		tranVideo.addEventListener('loadedmetadata', () => {
			loaded++;
			if (loaded === 2) {
				resolve();
			}
		});
	});

	promise.then(() => {
		document.getElementById("videoAjaxLoader1").style.display = 'none';
		document.getElementById("videoCompareOrig").style.margin = '0';
		document.getElementById("originalVideoText").style.display = 'block';
		document.getElementById("originalVideoValues").style.display = 'block';
		origVideo.style.display = 'block';
		origVideo.onclick = function () {
			window.open(origVideoLink);
		};
		document.getElementById("videoAjaxLoader2").style.display = 'none';
		document.getElementById("videoCompareTran").style.margin = '0';
		document.getElementById("transformedVideoText").style.display = 'block';
		document.getElementById("transformedVideoValues").style.display = 'block';
		tranVideo.style.display = 'block';
		tranVideo.onclick = function () {
			window.open(tranVideoLink);
		};
	}).then(() => {
		origVideo.play();
		tranVideo.play();
	});

	origVideo.src = origVideoLink;
	tranVideo.src = tranVideoLink;

	document.getElementById('compareTitle').innerHTML = '<img src="../icons/VideoLight.png">' + '<span>Video Comparison</span>';
	document.getElementById('compareUrlTitle').innerHTML = "Video link";
	document.getElementById('compareUrlLink').href = tranVideoLink;
	document.getElementById('compareUrlLink').innerHTML = tranVideoLink;
	document.getElementById('originalVideoValues').innerHTML = '<p>' + this.parentElement.children[5].innerHTML + '</p>';
	document.getElementById('transformedVideoValues').innerHTML = tranVideoPercent + '<p>' + this.parentElement.children[6].innerHTML + '</p>';
	document.getElementById('videoCompare').style.display = 'block';
	document.getElementById('imageBox').style.display = 'block';
}
