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
            document.querySelector('#conversionSummary > .col1 > h1').textContent = 'Generic';
            document.querySelector('#conversionSummary > .col2 > h1').textContent = 'Chrome';
            document.querySelector('#conversionSummary > .col3 > h1').textContent = 'Safari';
            document.querySelector('#conversionSummary > .col4 > h1').textContent = 'IE';
        }
        else if (display_mode == 'piezModeCPI') {
            document.querySelector('#conversionSummary > .col1 > h1').textContent = 'CPI Status';
            document.querySelector('#conversionSummary > .col2 > h1').textContent = 'Policy Version';
            document.querySelector('#conversionSummary > .col3 > h1').textContent = 'Preconnects';
            document.querySelector('#conversionSummary > .col4 > h1').textContent = 'Pushed Resources';
        }
        else {
            document.querySelector('#conversionSummary > .col1 > h1').textContent = 'Realtime Conversions';
            document.querySelector('#conversionSummary > .col2 > h1').textContent = 'Optimized Conversions';
            document.querySelector('#conversionSummary > .col3 > h1').textContent = 'Total Saved Bytes';
            document.querySelector('#conversionSummary > .col4 > h1').textContent = '% Bytes Change';
        }
	};

    global.updateSummaryTable = function(page, display_mode) {
    	if  (display_mode === 'piezModeBrowserFormatCompare') {
    		document.querySelector('#conversionSummary > .col1 > h3').textContent = displayBytes(page.genericFormatTotal);
    		document.querySelector('#conversionSummary > .col2 > h3').textContent = displayBytes(page.chromeFormatTotal);
    		document.querySelector('#conversionSummary > .col3 > h3').textContent = displayBytes(page.safariFormatTotal);
    		document.querySelector('#conversionSummary > .col4 > h3').innerHTML   = displayBytes(page.ieFormatTotal);
    	}
        else if (display_mode === 'piezModeCPI')  {
            document.querySelector('#conversionSummary > .col1 > h3').textContent = (page.CPIEnabled) ? 'On' : 'Off';
            document.querySelector('#conversionSummary > .col2 > h3').textContent = (page.CPIPolicy) ? ('Version: ' + page.CPIPolicy) : 'None';
            var total = page.preconnects.common.length + page.preconnects.unique.length;
            document.querySelector('#conversionSummary > .col3 > h3').textContent = (total - page.preconnects.notUsed.length) +  '/' + total;
            total = page.resourcesPushed.common.length + page.resourcesPushed.unique.length;
            document.querySelector('#conversionSummary > .col4 > h3').textContent = (total - page.resourcesPushed.notUsed.length) +  '/' + total;
        }
    	else {
            document.querySelector('#conversionSummary > .col1 > h3').textContent = page.totalIMImagesTransformed.toString();
            document.querySelector('#conversionSummary > .col2 > h3').textContent = page.totalICImagesTransformed.toString();
            document.querySelector('#conversionSummary > .col3 > h3').textContent = displayBytes(page.totalOriginalSize - (page.totalImTransformSize + page.totalIcTransformSize));
            document.querySelector('#conversionSummary > .col4 > h3').innerHTML   = displayPercentChange(page.totalOriginalSize, (page.totalImTransformSize + page.totalIcTransformSize));
    	}
    }

	global.showDetailsTable = function(display_mode) {
		document.getElementById('conversionDetails').style.display = 'block';
        if (display_mode === 'piezModeCPI') {
            document.querySelector('#imConversionBox > div > h1').textContent = 'Preconnected Resources';
            document.querySelector('#icConversionBox > div > h1').textContent = 'Pushed Resources';
        }
        else {
            document.querySelector('#imConversionBox > div > h1').textContent = 'Optimized Conversion Details';
            document.querySelector('#icConversionBox > div > h1').textContent = 'Realtime Conversion Details';
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

	global.bindRowHighlightingListener = function() {
		var rows = document.querySelectorAll('.urlInfo');
		for (var i = 0, len = rows.length; i < len; i++) {
			rows[i].addEventListener('mouseover', function() { this.className = 'urlInfoHover'; });
			rows[i].addEventListener('mouseout',  function() { this.className = 'urlInfo'; });
		}
	};

    global.hideDetails = function() {
        //insert blank space to keep box height
        document.querySelector('#conversionSummary > .col1 > h3').textContent = '\u00A0';
        document.querySelector('#conversionSummary > .col2 > h3').textContent = '\u00A0';
        document.querySelector('#conversionSummary > .col3 > h3').textContent = '\u00A0';
        document.querySelector('#conversionSummary > .col4 > h3').textContent = '\u00A0';
        document.getElementById('imageBox').style.display                     = 'none';
        document.getElementById('imConversionBox').style.display              = 'none';
        document.getElementById('icConversionBox').style.display              = 'none';
    };
})(this);