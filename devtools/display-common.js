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
            document.getElementById('conversionSummary').style.display = 'block';
        if (display_mode === 'piezModeBrowserFormatCompare') {
            document.getElementById('col-1-title').textContent = 'Generic';
            document.getElementById('col-2-title').textContent = 'Chrome';
            document.getElementById('col-3-title').textContent = 'Safari';
            document.getElementById('col-4-title').textContent = 'IE';
        }
        else if (display_mode == 'piezModeCPI') {
            document.getElementById('col-1-title').textContent = 'CPI Status';
            document.getElementById('col-2-title').textContent = 'Policy Version';
            document.getElementById('col-3-title').textContent = 'Preconnects';
            document.getElementById('col-4-title').textContent = 'Pushed Resources';
        }
        else {
            document.getElementById('col-1-title').textContent = 'Optimized Realtime';
            document.getElementById('col-2-title').textContent = 'Optimized Offline';
            document.getElementById('col-3-title').textContent = 'Total Saved Bytes';
            document.getElementById('col-4-title').textContent = '% Bytes Change';
        }
	};

    global.updateSummaryTable = function(page, display_mode) {
    	if  (display_mode === 'piezModeBrowserFormatCompare') {
    		document.getElementById('col-1-info').textContent = displayBytes(page.genericFormatTotal);
    		document.getElementById('col-2-info').textContent = displayBytes(page.chromeFormatTotal);
    		document.getElementById('col-3-info').textContent = displayBytes(page.safariFormatTotal);
    		document.getElementById('col-4-info').innerHTML   = displayBytes(page.ieFormatTotal);
    	}
        else if (display_mode === 'piezModeCPI')  {
            document.getElementById('col-1-info').textContent = (page.CPIEnabled) ? 'On' : 'Off';
            document.getElementById('col-2-info').textContent = (page.CPIPolicy) ? ('Version: ' + page.CPIPolicy) : 'None';
            var total = page.preconnects.common.length + page.preconnects.unique.length;
            document.getElementById('col-3-info').textContent = (total - page.preconnects.notUsed.length) +  '/' + total;
            total = page.resourcesPushed.common.length + page.resourcesPushed.unique.length;
            document.getElementById('col-4-info').textContent = (total - page.resourcesPushed.notUsed.length) +  '/' + total;
        }
    	else {
            document.getElementById('col-1-info').textContent = page.totalICImagesTransformed.toString();
            document.getElementById('col-2-info').textContent = page.totalIMImagesTransformed.toString();
            document.getElementById('col-3-info').textContent = displayBytes(page.totalOriginalSize - (page.totalImTransformSize + page.totalIcTransformSize));
            document.getElementById('col-4-info').innerHTML   = displayPercentChange(page.totalOriginalSize, (page.totalImTransformSize + page.totalIcTransformSize));
    	}
    };

	global.showDetailsTable = function(display_mode) {
		document.getElementById('conversionDetails').style.display = 'block';
        if (display_mode === 'piezModeCPI') {
            document.getElementById('detailsBox1Title').textContent = 'Preconnected Resources';
            document.getElementById('detailsBox2Title').textContent = 'Pushed Resources';
        }
        else {
            document.getElementById('detailsBox1Title').textContent = 'Optimized Offline Details';
            document.getElementById('detailsBox2Title').textContent = 'Optimized Realtime Details';
            document.getElementById('detailsBox3Title').textContent = 'Non Image Manager Images';
        }
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

    global.hideDetails = function() {
        //insert blank space to keep box height
        document.getElementById('col-1-info').textContent        = '\u00A0';
        document.getElementById('col-2-info').textContent        = '\u00A0';
        document.getElementById('col-3-info').textContent        = '\u00A0';
        document.getElementById('col-4-info').textContent        = '\u00A0';
        document.getElementById('imageBox').style.display        = 'none';
        document.getElementById('detailsBox1').style.display = 'none';
        document.getElementById('detailsBox2').style.display = 'none';
        document.getElementById('detailsBox3').style.display = 'none';
    };
})(this);