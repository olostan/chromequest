function Quest() {

}

Quest.onStarted = function() {
    this.urlTracker = function(tabId, changeInfo, tab) {
        //console.log(tab.url, tab.status, tasks);
        if (tab.status != "complete" || tab.url == "chrome://newtab/" || !tasks) {
            return;
        }
        var hash = hex_md5(tab.url);
        var match;
        for (var i = 0; i < tasks.length; ++i) {
            if (tasks[i].hash == hash) {
                match = tasks[i];
                break;
            }
        }

        if (match) {
            $.getJSON(service("player/test-url") + "?url=" + tab.url, function(data) {
                if (data.ok) {
                    //alert("You've got it!");
                    var notification = webkitNotifications.createNotification(
                        'icons/checkmark.png', // icon url - can be relative
                        "You've got it!", // notification title
                        "You've correctly guessted web site! Go on!"  // notification body text
                    );
                    notification.show();
                }
                else alert("Don't even think about hacking me!");
            });
        }
    }
    chrome.tabs.onUpdated.addListener(this.urlTracker);
}
Quest.onStopped = function() {
    if (this.urlTracker) {
        chrome.tabs.onUpdated.removeListener(this.urlTracker);
    }

}
