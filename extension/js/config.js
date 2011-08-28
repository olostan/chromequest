var config = {
    serverUrl : "http://localhost:8080/",
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
}

function loadConfig() {
    config.nick = localStorage["nick"];
    if (!config.nick) {
                var nick = "Nick"+((Math.random()*1000)|0);
                config.nick = nick;
                saveConfig();
    }
}