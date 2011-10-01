var config = {
    serverUrl : "http://oni.dyndns.org:8080/",
    nick: "NeverSeeThis"
};

var States = {
    NONE : "NONE",
    // Master
    CREATING: "CREATING",
    CREATED : "CREATED",
    OPENED : "OPENED",
    STARTED : "STARTED",

    // player
    JOINED : "JOINED",
    PLAYING : "PLAYING",
    CLOSED: "CLOSED",

    RESULT: "RESULT"
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

function service(action) {
        return config.serverUrl + action;
}