var PiezController = {};
PiezController.current_page         = new Page();
PiezController.current_display_mode = 'piezModeSimple';

var port = chrome.runtime.connect({name:'piez'});

function parseRequest(http_transaction) {
    ParseHeaders(http_transaction, PiezController.current_page);
    Report(PiezController.current_page, PiezController.current_display_mode);
}

function newPageRequest(url) {
    hideDetails();
    PiezController.current_page = new Page();
    port.postMessage({
        type: "update-piez-analytics"
    });
    PiezController.current_display_mode = localStorage.getItem("piezCurrentState");
    if (PiezController.current_display_mode === 'piezModeCPI') {
        port.postMessage({type:'cpiPageLoad'});
        chrome.devtools.network.onRequestFinished.removeListener(parseRequest);
    }
    else {
        chrome.devtools.network.onRequestFinished.addListener(parseRequest);
    }
}

window.onload = function() {
    port.postMessage({type:'inspectedTab', tab: chrome.devtools.inspectedWindow.tabId});
    var state = localStorage.getItem("piezCurrentState");
    PiezController.current_display_mode = state;
    showSummaryTable(PiezController.current_display_mode);
    if (PiezController.current_display_mode !== 'piezModeCPI') {
        chrome.devtools.network.onRequestFinished.addListener(parseRequest);
    }

	chrome.devtools.network.onNavigated.addListener(newPageRequest);
};


port.onMessage.addListener(function cpiListener(message) {
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
