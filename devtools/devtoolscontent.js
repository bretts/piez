var PiezController = {};
PiezController.current_page         = new Page();
chrome.storage.local.get('piezCurrentState', function(result) {
    PiezController.current_display_mode = result['piezCurrentState'] || 'piezModeImSimple';
    showSummaryTable(PiezController.current_display_mode); //choose correct summary header before page actually loads
});
var port = chrome.runtime.connect({name:'piez'});

function parseImResponse(http_transaction) {
    ParseHeaders(http_transaction, PiezController.current_page);
    Report(PiezController.current_page, PiezController.current_display_mode);
}

function newPageRequest(url) {
    hideDetails();
    PiezController.current_page = new Page();
    port.postMessage({
        type: "update-piez-analytics"
    });
    chrome.storage.local.get('piezCurrentState', function(result) {
        PiezController.current_display_mode = result['piezCurrentState'] || 'piezModeImSimple';
        //toggle the IM on request listener depending on what mode Piez is on
        if (PiezController.current_display_mode === 'piezModeCPI') {
            port.postMessage({type:'cpiPageLoad'});
        }
    });
}

window.onload = function() {
    port.postMessage({type:'inspectedTab', tab: chrome.devtools.inspectedWindow.tabId});
    chrome.devtools.network.onRequestFinished.addListener(parseImResponse);
    chrome.devtools.network.onNavigated.addListener(newPageRequest);
};


port.onMessage.addListener(function(message) {
    switch(message.type) {
        case 'cpiPageLoaded':
            chrome.devtools.network.getHAR(function(har) {
                if (PiezController.current_display_mode === 'piezModeCPI') {
                    ParsePageCpi(har, PiezController.current_page);
                }
                Report(PiezController.current_page, PiezController.current_display_mode);
            });
            break;
        default:
            console.log('unexpected message on background port: ', message);
            break;
    }
});
