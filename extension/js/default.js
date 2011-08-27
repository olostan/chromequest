
$('createQuest').click = function (){
    var action="master/create-quest";
    var url = config.serverUrl + action;
    $.getJSON(url, function callback(data) {
        var bgp = chrome.extension.getBackgroundPage();
        gbp.state = States.CREATED;
        console.log(data);
    });
}

$('joinQuest').click = function (){
    var action="player/join-quest";
    var url = config.serverUrl + action + "?q=" + $('hash').val();
    $.getJSON(url, function callback(data) {
        var bgp = chrome.extension.getBackgroundPage();
        gbp.state = States.JOINED;
        console.log(data);
    });
}