var config = {
    serverUrl : "http://oni.dyndns.org:8080/",
    nick: "ololo"
};

var States = {
    NONE : 0,
    CREATED : 1,
    OPENED : 2,
    STARTED : 3,
    JOINED : 4,
    CLOSED: 0
};

function saveConfig() {
    localStorage['nick'] = config.nick;
    localStorage["service"] = config.serverUrl;
}

function loadConfig() {
    config.nick = localStorage["nick"];
    if (!config.nick) {
                var nick = "Nick"+((Math.random()*1000)|0);
                config.nick = nick;
                saveConfig();
    }
    var serviceUrl = localStorage["service"];
    if (serviceUrl) config.serverUrl = serviceUrl;
}