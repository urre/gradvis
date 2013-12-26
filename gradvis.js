// when the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {

});

chrome.tabs.onCreated.addListener(gradvis);
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (info.status == 'complete') gradvis(tab);
});

function gradvis(tab) {
    var tabUrl = tab.url;
    if (tabUrl && tabUrl.indexOf("gradvall.se") != -1) {
        chrome.tabs.insertCSS(tab.id, { "file": "css/styles.css" });
        chrome.tabs.executeScript(null, {"file": "js/jquery.min.js"});
        chrome.tabs.executeScript(null, {"file": "js/jquery.ba-replacetext.js"});
        chrome.tabs.executeScript(null, {"file": "js/gradvis-actions.js"});
    }
}

// show the popup when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.pageAction.show(tab.id);
});