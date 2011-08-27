
window._state = States.NONE;
window.currentQuest = null;

chrome.browserAction.onClicked.addListener(function(tab) {
    refreshPopup();
});

window.setState = function(state){
    _state = state;
    refreshPopup();
}

window.refreshPopup = function(){
    switch(_state)
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
}