$(document).ready(function(){
	
	$("#qhash").val(chrome.extension.getBackgroundPage().newQuestHash);
	UpdateTasks();
    UpdateQuest();
    function service(action) {
        return config.serverUrl + action;
    }
    $('#createQuest').click(function (){
        
        var url = service("master/create-quest") + "?master=" + config.nick;
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
        var url = service("player/join-quest") + "?q=" + $('#hash').val();
        $.getJSON(url, function callback(data) {
            var bgp = chrome.extension.getBackgroundPage();
            bgp.setState(States.JOINED);
            console.log(data);
        });
    });

    $("#addPage").click(function() {
        var url;
        chrome.tabs.getSelected(null, function (tab)
        		{
        			url = tab.url;
        			$.post(service("master/add-task"),{url:url, descr:$("#descr").val()}, function(data) {
        	            if (!data || !data.ok) {
        	                alert("Failed adding page:"+JSON.stringify(data));
        	            }
                         UpdateTasks();
        	        });

        		}); 
    });
    function UpdateQuest() {
        $.getJSON(config.serverUrl + "player/quest-status", function callback(data) {$("#qstatus").html(data.status);});       
    }
    function UpdateTasks() {
       $.getJSON(service("player/quest-tasks"), function callback(data) {
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