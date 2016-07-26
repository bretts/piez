(function(global) {

    global.updateCpiSummary = function(page) {
        document.querySelector('#totalICImagesTransformed h3').textContent = (page.CPIEnabled) ? 'On' : 'Off';
        document.querySelector('#totalIMImagesTransformed h3').textContent = (page.CPIPolicy) ? ('Version: ' + page.CPIPolicy) : 'None';
        var total = page.preconnects.common.length + page.preconnects.unique.length;
        document.querySelector('#totalByteReduction h3').textContent = (total - page.preconnects.notUsed.length) +  '/' + total;
        total = page.resourcesPushed.common.length + page.resourcesPushed.unique.length;
        document.querySelector('#pctByteReduction h3').textContent = (total - page.resourcesPushed.notUsed.length) +  '/' + total;
    };

    global.displayCPIView = function(page) {
        if (!page.CPIEnabled || !page.CPIPolicy) {
            return;
        } //do nothing if we don't have a valid policy or CPI not enabled

        //preconnects
        if (page.preconnects.common.length + page.preconnects.unique.length + page.preconnects.notUsed.length > 0) {
            document.getElementById('imConversionBox').style.display = 'block';
        }
        var preconnectsTable = '<table id="imDetailsTable" class="transformedResults">';
        preconnectsTable += '<thead><tr>' + '<th>Peconnect URL</th>' + '<th>Type</th>' + '<th>Status</th>' + '</tr></thead>';
        preconnectsTable += '<tbody>';
        page.preconnects.common.forEach(function(info) {
            preconnectsTable += '<tr class="urlInfo"><td>' + info +'</td>' + '<td>Default</td>';
            preconnectsTable += '<td>' + ((page.preconnects.notUsed.indexOf(info) === -1) ? 'Connected' : 'Not connected!') + '</td></tr>';
        });
        page.preconnects.unique.forEach(function(info) {
            preconnectsTable += '<tr class="urlInfo"><td>' + info +'</td>' + '<td>Page Specific</td>';
            preconnectsTable += '<td>' + ((page.preconnects.notUsed.indexOf(info) === -1) ? 'Connected' : 'Not connected!') + '</td></tr>';
        });
        preconnectsTable += '</tbody></table>';
        document.getElementById('imDetailsTable').innerHTML = preconnectsTable;

        //pushed resources
        if (page.resourcesPushed.common.length + page.resourcesPushed.unique.length + page.resourcesPushed.notUsed.length > 0) {
            document.getElementById('icConversionBox').style.display = 'block';
        }
        var pushedTables = '<table id="icDetailsTable" class="transformedResults">';
        pushedTables += '<thead><tr>' + '<th>Pushed Resource</th>' + '<th>Type</th>' + '<th>Status</th>' + '<th>Resource Size</th>' + '</tr></thead>';
        pushedTables += '<tbody>';
        page.resourcesPushed.common.forEach(function(info) {
            pushedTables += '<tr class="urlInfo"><td>' + info.url +'</td>' + '<td>Default</td>' + '<td>';
            pushedTables += ((page.resourcesPushed.notUsed.indexOf(info) === -1) ? 'Pushed' : 'Not pushed!') + '</td>';
            pushedTables += '<td>' + ((typeof info.transferSize === 'number') ? displayBytes(info.transferSize) : 'N/A') +'</td></tr>';
        });
        page.resourcesPushed.unique.forEach(function(info) {
            pushedTables += '<tr class="urlInfo"><td>' + info.url +'</td>' + '<td>Page Specific</td>' + '<td>';
            pushedTables += ((page.resourcesPushed.notUsed.indexOf(info) === -1) ? 'Pushed' : 'Not pushed!') + '</td>';
            pushedTables += '<td>' + ((typeof info.transferSize === 'number') ? displayBytes(info.transferSize) : 'N/A') +'</td></tr>';
        });
        pushedTables += '</tbody></table>';
        document.getElementById('icDetailsTable').innerHTML = pushedTables;
    };

})(this);
