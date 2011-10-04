function Quest(tasks) {
    this.tasks = tasks;
}

function getUrlByType(url,type) {
    var r = url;
    var parts = parseUri(url);
    switch(type) {
            case "domain": r = parts['host'];break;
            case "nopar": r = parts['protocol']+"://"+parts['host']+parts['port']+parts['path'];
    }
    return r;
}

Quest.prototype.onStarted = function() {
    var quest = this;

    this.urlTracker = function(tabId, changeInfo, tab) {
        //console.log(tab.url, tab.status, tasks);
        if (tab.status != "complete" || tab.url == "chrome://newtab/" || !quest.tasks) {
            return;
        }

        var hash = {
            "full": hex_md5(tab.url),
            "domain": hex_md5(getUrlByType(tab.url,"domain")),
            "nopar" : hex_md5(getUrlByType(tab.url,"nopar"))
        }
        var match;
        for (var i = 0; i < quest.tasks.length; ++i) {
            if (quest.tasks[i].hash == hash[quest.tasks[i].type]) {
                match = quest.tasks[i];
                break;
            }
        }

        if (match && match.taskStatus != "completed") {
            $.getJSON(service("player/test-url"), {url: tab.url, hash: match.hash})
            .done(function(data) {
                if (data.ok) {
                    //alert("You've got it!");
                    match.taskStatus = "completed";
                    var total = quest.tasks.length;
                    var done  = 0;
                    quest.tasks.forEach(function(t) { if (t.taskStatus!="active") done++; });

                    var msg = chrome.i18n.getMessage;

                    var notification = webkitNotifications.createNotification(
                        'icons/checkmark.png', // icon url - can be relative
                        msg("gotit"), // notification title
                        msg("gotItDescr",[match.descr,total-done])
                    );
                    notification.show();
                }
                else alert("Don't even think about hacking me!");
            })
            .fail(function(err){
                    alert(JSON.stringify(err));
            });
        }
    }
    chrome.tabs.onUpdated.addListener(this.urlTracker);
}
Quest.prototype.onStopped = function() {
    if (this.urlTracker) {
        chrome.tabs.onUpdated.removeListener(this.urlTracker);
    }

}
