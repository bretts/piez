(function(global) {
    'use strict';

    var timeoutID;

    function A2LoadingPage() {
        hideDetails();
        if (PiezController.current_page.A2Started) {
            document.getElementById('notEnabled').style.display = 'block';
            document.getElementById('notEnabled').innerHTML = '<div class="piezConfigMessage">Please wait while page loads before A2 data is parsed.\n'
                + 'If the page takes longer than 20s to load, Piez will try to parse the current available data.</div>';
        }
    }

    global.displayA2Loading = function(page, display) {
        if (display !== 'piezModeA2') {
            return;
        }
        A2LoadingPage();
        if (!timeoutID) {
            timeoutID = setTimeout(function() {
                chrome.devtools.network.getHAR(function(har) {
                    if (display === 'piezModeA2') {
                        ParsePageA2(har, page);
                    }
                    page.pageLoaded = true;
                    Report(page, display);
                });
            }, 20000);
        }
    };

    global.displayA2View = function(page) {
        if(page.pageLoaded) {
            clearTimeout(timeoutID);
            timeoutID = undefined;
        }
        else {
            A2LoadingPage();
        }
        function isA2Enabled() {
            return (page.A2Enabled && page.A2Policy)
                || (page.preconnects.common.length + page.preconnects.unique.length)
                || (page.resourcesPushed.common.length + page.resourcesPushed.unique.length);
        }
        if (!isA2Enabled()) {
            return;
        } //do nothing if we don't have a valid policy or A2 not enabled
        else {
            page.A2Enabled = true;
            document.getElementById('col-1-info').textContent = 'On';
        }

        //preconnects
        if (page.preconnects.common.length + page.preconnects.unique.length + page.preconnects.notUsed.length > 0) {
            document.getElementById('detailsBox1').style.display = 'block';
        }
        var preconnectsTable = '<table class="transformedResults">';
        preconnectsTable += '<thead><tr>' + '<th>Peconnect URL</th>' + '<th>Type</th>' + '<th>Status</th>' + '</tr></thead>';
        preconnectsTable += '<tbody>';
        page.preconnects.common.forEach(function(info) {
            preconnectsTable += '<tr class="urlInfo"><td class="urlData" title="' + info + '">'  + info +'</td>' ;
            preconnectsTable += '<td>Default</td>' + '<td>' + ((page.preconnects.notUsed.indexOf(info) === -1) ? 'Connected' : 'Not connected!') + '</td></tr>';
        });
        page.preconnects.unique.forEach(function(info) {
            preconnectsTable += '<tr class="urlInfo"><td class="urlData" title="' + info + '">' + info +'</td>';
            preconnectsTable += '<td>Page Specific</td>' + '<td>' + ((page.preconnects.notUsed.indexOf(info) === -1) ? 'Connected' : 'Not connected!') + '</td></tr>';
        });
        preconnectsTable += '</tbody></table>';
        document.getElementById('detailsBox1Table').innerHTML = preconnectsTable;

        //pushed resources
        if (page.resourcesPushed.common.length + page.resourcesPushed.unique.length + page.resourcesPushed.notUsed.length > 0) {
            document.getElementById('detailsBox2').style.display = 'block';
        }
        var pushedTables = '<table class="transformedResults">';
        pushedTables += '<thead><tr>' + '<th>Pushed Resource</th>' + '<th>Type</th>' + '<th>Status</th>' + '<th>Resource Size</th>' + '</tr></thead>';
        pushedTables += '<tbody>';
        page.resourcesPushed.common.forEach(function(info) {
            pushedTables += '<tr class="urlInfo"><td class="urlData" title="' + info.url + '">'+ info.url + '</td>';
            pushedTables += '<td>Default</td>' + '<td>' + ((page.resourcesPushed.notUsed.indexOf(info) === -1) ? 'Pushed' : 'Not pushed!') + '</td>';
            pushedTables += '<td>' + ((typeof info.transferSize === 'number') ? displayBytes(info.transferSize) : 'N/A') +'</td></tr>';
        });
        page.resourcesPushed.unique.forEach(function(info) {
            pushedTables += '<tr class="urlInfo"><td class="urlData" title="' + info.url + '">' + info.url +'</td>';
            pushedTables += '<td>Page Specific</td>' + '<td>' + ((page.resourcesPushed.notUsed.indexOf(info) === -1) ? 'Pushed' : 'Not pushed!') + '</td>';
            pushedTables += '<td>' + ((typeof info.transferSize === 'number') ? displayBytes(info.transferSize) : 'N/A') +'</td></tr>';
        });
        pushedTables += '</tbody></table>';
        document.getElementById('detailsBox2Table').innerHTML = pushedTables;
    };

})(this);
