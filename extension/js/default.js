$(document).ready(function(){
	
	$("#qhash").val(chrome.extension.getBackgroundPage().newQuestHash);
	
    $('#createQuest').click(function (){
        var action="master/create-quest";
        var url = config.serverUrl + action + "?master=" + config.nick;
        $.getJSON(url, function callback(data) {
          //  debugger;
            if (data.questhash){
                var bgp = chrome.extension.getBackgroundPage();
                bgp.currentQuest = data.questhash;
                bgp.setState(States.CREATED);
                
                bgp.newQuestHash = data.questhash;
                
                
                //TODO: find out how to avoid duplication of routing logic
                window.location.href = "created.html";
            }
            console.log(data);
        });
    });

    $('#joinQuest').click(function (){
        var action="player/join-quest";
        var url = config.serverUrl + action + "?q=" + $('#hash').val();
        $.getJSON(url, function callback(data) {
            var bgp = chrome.extension.getBackgroundPage();
            bgp.setState(States.JOINED);
            console.log(data);
        });
    });

    $("#addPage").click(function() {
        var action="master/add-task";
        var service = config.serverUrl + action;
        var url;
        chrome.tabs.getSelected(null, function (tab)
        		{
        			url = tab.url;
        			$.post(service,{url:url, descr:$("#descr").val()}, function(data) {
        	            if (!data || !data.ok) {
        	                alert("Failed adding page:"+JSON.stringify(data));
        	            }
                         UpdateTasks();
        	        });

        		}); 
    });
    function UpdateQuest() {
        var action="player/quest-status";
        var service = config.serverUrl + action;
    }
    function UpdateTasks() {
       var action="player/quest-tasks";
       var service = config.serverUrl + action;
       $.getJSON(service, function callback(data) {
            console.log(data);
            var table = $("#tasks");
            var template = $("#task-template").html();
            if (data.tasks) {
                table.empty();

                 table.append("test task ");
                data.tasks.forEach(function(task) {
                   var html = template;
                   html = html.replace("{descr}",task.descr);
                   if (task.url)
                        html = html.replace("{url}",task.url);
                   table.append(html);
                });

            }
       });
    }
});