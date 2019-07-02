(function(global) {
	'use strict';

	global.displayBytes = function(bytes, decimals = 1){
		if (bytes === 0) return '0 B';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return (bytes / Math.pow(k, i)).toFixed(dm) + ' ' + sizes[i];
	};

	global.displayPercentChange = function(originalSize, transformedSize) {
		var originalSizeInt    = parseInt(originalSize);
		var transformedSizeInt = parseInt(transformedSize);

		var pctChange = ((transformedSizeInt/originalSizeInt) - 1) * 100;

		if (transformedSizeInt == originalSizeInt) {
			return '<span class="warning">' + '( ' + '0%' + ' )' + '</td>';
		} else if (pctChange > 0) {
			return '<span class="error">' + '( &#9652; ' + Math.abs(pctChange).toFixed(1) + '% )' +'</td>';
		} else if (pctChange < 0) {
			return '<span class="success">' + '( &#9662; ' + Math.abs(pctChange).toFixed(1) + '% )' + '</td>';
		}
	};

	global.classColour = function(value) {
		if(value > 0) {
			return "success";
		} else if(value < 0) {
			return "error";
		} else {
			return "warning";
		}
	};

	global.showSummaryTable = function(display_mode) {
		var summaryTable = document.getElementById('conversionSummary');
		summaryTable.style.display = 'block';

		if (display_mode == 'piez-a2') {
			summaryTable.innerHTML =
				'<div class="col-1-5-box"><h1 id="col-1-title">Policy Version</h1><h3 id="col-1-info">&nbsp</h3></div>' +
				'<div class="col-1-5-box"><h1 id="col-2-title">Preconnects</h1><h3 id="col-2-info">&nbsp</h3></div>' +
				'<div class="col-1-5-box"><h1 id="col-3-title">Pushed Resources</h1><h3 id="col-3-info">&nbsp</h3></div>' +
				'<div class="col-1-5-box"><h1 id="col-4-title">Preloaded Fonts</h1><h3 id="col-4-info">&nbsp</h3></div>' +
				'<div class="col-1-5-box"><h1 id="col-5-title">Page Load Time (ms)</h1><h3 id="col-5-info">&nbsp</h3></div>';
		} else if (display_mode == 'piez-ro-simple' || display_mode == 'piez-ro-advanced') {
			summaryTable.innerHTML =    
				'<div class="col-1-4-box"><h1 id="col-1-title">Not RO Optimized</h1><h3 id="col-1-info">&nbsp</h3></div>' +
				'<div class="col-1-4-box"><h1 id="col-2-title">Optimized</h1><h3 id="col-2-info">&nbsp;</h3></div>' +
				'<div class="col-1-4-box"><h1 id="col-3-title">Total Saved Bytes</h1><h3 id="col-3-info">&nbsp;</h3></div>' +
				'<div class="col-1-4-box"><h1 id="col-4-title">% Bytes Change</h1><h3 id="col-4-info">&nbsp;</h3></div>';
		} else if (display_mode == 'piez-3pm') {
			summaryTable.innerHTML =    
				'<div class="col-1-4-box"><h1 id="col-1-title">Deferred</h1><h3 id="col-1-info">&nbsp</h3></div>' +
				'<div class="col-1-4-box"><h1 id="col-2-title">SPOF-Protected</h1><h3 id="col-2-info">&nbsp;</h3></div>' +
				'<div class="col-1-4-box"><h1 id="col-3-title">Blocked</h1><h3 id="col-3-info">&nbsp;</h3></div>' +
				'<div class="col-1-4-box"><h1 id="col-4-title">Total</h1><h3 id="col-4-info">&nbsp;</h3></div>';
		} else {
			summaryTable.innerHTML =
				'<div class="col-1-2-box im-box"><h4 id="col-1-title">Total Saved Bytes</h4><h4 id="col-1-info">&nbsp;</h4><h4 id="col-1-2-info">&nbsp;</h4></div>' +
				'<div class="col-1-4-box im-box"><div class="img-align"><img src="../icons/VideoLight@2x.png"><span id="col-2-title">0 Videos</span></div><h4 id="col-2-info">&nbsp;</h4><h4 id="col-2-2-info">&nbsp</h4></div>' +
				'<div class="col-1-4-box im-box"><div class="img-align"><img src="../icons/ImageLight@2x.png"><span id="col-3-title">0 Images</span></div><h4 id="col-3-info">&nbsp;</h4><h4 id="col-3-2-info">&nbsp</h4></div>';
				//'<div class="col-1-4-box"><h4 id="col-4-title">% Bytes Change</h4><h4 id="col-4-info">&nbsp;</h4></div>';
		}
	};

	global.updateSummaryTable = function(page, display_mode) {
		if (display_mode === 'piez-a2')  {
			document.getElementById('col-1-info').textContent = (page.A2Policy) ? ('Version: ' + page.A2Policy) : 'None';
			var total = page.preconnects.common.length + page.preconnects.unique.length;
			document.getElementById('col-2-info').textContent = (total - page.preconnects.notUsed.length) +  '/' + total;
			total = page.resourcesPushed.common.length + page.resourcesPushed.unique.length;
			document.getElementById('col-3-info').textContent = (total - page.resourcesPushed.notUsed.length) +  '/' + total;
			total = page.fontPreloads.common.length + page.fontPreloads.unique.length;
			document.getElementById('col-4-info').textContent = (total - page.fontPreloads.notUsed.length) + "/" + total;
			if (page.pageLoaded) {
				document.getElementById('col-5-info').textContent = page.pageLoadTime;
			} else {
				document.getElementById('col-5-info').textContent = '\u00A0';
			}
		} else if(display_mode === 'piez-ro-simple'|| display_mode == 'piez-ro-advanced') {
			document.getElementById('col-1-info').textContent = page.totalNonRoResources.toString() 
			document.getElementById('col-2-info').textContent = page.totalRoOfflineTransforms.toString();
			document.getElementById('col-3-info').textContent = displayBytes(page.totalRoOriginalSize - (page.totalRoOfflineTransformSize));
			document.getElementById('col-4-info').innerHTML   = displayPercentChange(page.totalRoOriginalSize, (page.totalRoOfflineTransformSize));
		} else if (display_mode == 'piez-3pm') {
			document.getElementById('col-1-info').textContent = page.total3PmDeferred.toString();
			document.getElementById('col-2-info').textContent = page.total3PmSpofProtected.toString();
			document.getElementById('col-3-info').textContent = page.total3PmSpofBlocked.toString();
			document.getElementById('col-4-info').textContent = page.total3PmResources.toString();
		} else {
			//  Video
			let totalVideoOriginalSize  = page.totalVidOriginalSize;
			let totalVideoTransformSize = page.totalVidTransformSize;
			document.getElementById('col-2-title').textContent = page.totalVidTransformed.toString() + " Video" + ((page.totalVidTransformed !== 1) ? "s" : "");
			document.getElementById('col-2-info').innerHTML = displayBytes(totalVideoOriginalSize - totalVideoTransformSize);
			document.getElementById('col-2-2-info').innerHTML = displayPercentChange(totalVideoOriginalSize, totalVideoTransformSize);
			// Images
			let totalImageOriginalSize  = page.totalImOriginalSize + page.totalIcOriginalSize;
			let totalImageTransformSize = page.totalImTransformSize + page.totalIcTransformSize;
			document.getElementById('col-3-title').textContent = (page.totalImTransformed + page.totalICImagesTransformed).toString() + " Image" + (((page.totalImTransformed + page.totalICImagesTransformed) !== 1) ? "s" : "");
			document.getElementById('col-3-info').innerHTML = displayBytes(totalImageOriginalSize - totalImageTransformSize);
			document.getElementById('col-3-2-info').innerHTML = displayPercentChange(totalImageOriginalSize, totalImageTransformSize);

			let totalOriginalSize  = totalImageOriginalSize + totalVideoOriginalSize;
			let totalTransformSize = totalImageTransformSize + totalVideoTransformSize;
			document.getElementById('col-1-info').textContent = displayBytes(totalOriginalSize - totalTransformSize);
			//document.getElementById('col-1-info').className   = classColour(totalOriginalSize - totalTransformSize);
			document.getElementById('col-1-2-info').innerHTML = displayPercentChange(totalOriginalSize, totalTransformSize);
		}
	};

	global.showDetailsTable = function(display_mode) {
		document.getElementById('conversionDetails').style.display = 'block';
		if (display_mode === 'piez-a2') {
			document.getElementById('detailsBox1Title').textContent = 'Preconnected Resources';
			document.getElementById('detailsBox2Title').textContent = 'Pushed Resources';
			document.getElementById('detailsBox3Title').textContent = 'Preloaded Fonts';
		} else if (display_mode === 'piez-ro-simple' || display_mode == 'piez-ro-advanced') {
			document.getElementById('detailsBox1Title').textContent = 'Optimized Details';
			document.getElementById('detailsBox2Title').textContent = 'In Progress Details';
			document.getElementById('detailsBox3Title').textContent = 'Not Optimized';
		} else if (display_mode == 'piez-3pm') {
			document.getElementById('detailsBox1Title').textContent = 'Script Managment Details';
		} else {
			document.getElementById('detailsBox1Title').innerHTML   = '<img src="../icons/VideoLight.png">' + 'Video Optimization Details';
			document.getElementById('detailsBox2Title').innerHTML   = '<img src="../icons/ImageLight.png">' + 'Image Optimization Details';
			document.getElementById('detailsBox3Title').textContent = 'Optimized Realtime Details';
			document.getElementById('detailsBox4Title').textContent = 'Non Image Manager';
		}
	};

	global.hidePiezNotEnabledTable = function() {
		document.getElementById('notEnabled').style.display = 'none';
	};

	global.showPiezNotEnabledTable = function(message_header, message_steps) {
		document.getElementById('conversionSummary').style.display = 'none';
		document.getElementById('conversionDetails').style.display = 'none';
		document.getElementById('notEnabled').style.display        = 'block';
		document.getElementById('notEnabled').innerHTML            = "<div class='piezConfigMessageHeader'>" + message_header + '</div>' + "<div class='piezConfigMessageSteps'>" + message_steps + '</div>';
	};

	global.AllfileSizeDiff = function(originalSize, transformedSize) {
		if (parseInt(originalSize) > parseInt(transformedSize)) {
			return '<span class="success">' + displayBytes(originalSize-transformedSize) + '</td>';
		} else if (parseInt(originalSize) < parseInt(transformedSize)){
			return '<span class="error">' + displayBytes(originalSize-transformedSize) + '</td>';
		} else {
			return '<span class="warning">' + displayBytes(originalSize-transformedSize) + '</td>';
		}
	};
	
	global.fileSizeDiff = function(originalSize, transformedSize) {
		if (parseInt(originalSize) > parseInt(transformedSize)) {
			return '<td class="success">' + displayBytes(transformedSize) + '</td>';
		} else if (parseInt(originalSize) < parseInt(transformedSize)){
			return '<td class="error">' + displayBytes(transformedSize) + '</td>';
		} else {
			return '<td class="warning">' + displayBytes(transformedSize) + '</td>';
		}
	};

	global.hideDetails = function(display_mode) {
		//insert blank space to keep box height
		document.getElementById('col-1-info').textContent    = '\u00A0';
		document.getElementById('col-2-info').textContent    = '\u00A0';
		document.getElementById('col-3-info').textContent    = '\u00A0';
		//document.getElementById('col-4-info').textContent    = '\u00A0';
		document.getElementById('imageBox').style.display    = 'none';
		document.getElementById('detailsBox1').style.display = 'none';
		document.getElementById('detailsBox2').style.display = 'none';
		document.getElementById('detailsBox3').style.display = 'none';
		document.getElementById('detailsBox4').style.display = 'none';
	};
})(this);