
var state = States.NONE;

var data = 42;

chrome.browserAction.onClicked.addListener(function(tab) {

    switch(state)
    {
        case States.CREATED:
                chrome.browserAction.setPopup({"popup": "views/created.html"});
        break;
        case States.OPENED:
                chrome.browserAction.setPopup({"popup": "views/opened.html"});
        break;
        case States.STARTED:
                chrome.browserAction.setPopup({"popup": "views/started.html"});
        break;
        case States.JOINED:
                chrome.browserAction.setPopup({"popup": "views/joined.html"});
        break;
        default:
                chrome.browserAction.setPopup({"popup": "views/default.html"});
    }
});