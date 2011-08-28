$(document).ready(function(){

	displayMasterButtons(chrome.extension.getBackgroundPage().newQuestStatus);
	
	$("#qhash").val(chrome.extension.getBackgroundPage().newQuestHash);
	UpdateTasks();
    UpdateQuest();

    function service(action) {
        return config.serverUrl + action;
    }
    
    function displayMasterButtons(status)
    {
    	switch(status)
    	{
    	case "new":
    		$("#qopen").show();
    		$("#qstart").hide();
    		$("#qfinish").hide();
    		$("#qdelete").hide();
    		break;
    	case "opened":
    		$("#qopen").hide();
    		$("#qstart").show();
    		$("#qfinish").hide();
    		$("#qdelete").hide();
    		break;
    	case "running":
    		$("#qopen").hide();
    		$("#qstart").hide();
    		$("#qfinish").show();
    		$("#qdelete").hide();
    		break;
    	case "finished":
    		$("#qopen").hide();
    		$("#qstart").hide();
    		$("#qfinish").hide();
    		$("#qdelete").show();
    		break;
    	}
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
        var url = service("player/join-quest") + "?q=" + $('#hash').val()+"&nick="+config.nick;
        $.getJSON(url, function callback(data) {
            if (!data || !data.ok) {
                alert("Can't join: "+JSON.stringify(data));
                return;
            }
            var bgp = chrome.extension.getBackgroundPage();
            bgp.setState(States.JOINED);
            
            window.location.href = "joined.html";
        });
    });

    $("#openQuest").click(function() {
    	$.getJSON(config.serverUrl + "master/open-quest", function(data) {
    		if (data.ok)
    		{
    			UpdateQuest();
    			chrome.extension.getBackgroundPage().newQuestStatus = "opened";
    	        displayMasterButtons("opened");
    		}
    	});
    });
    
    $("#startQuest").click(function() {
    	$.getJSON(config.serverUrl + "master/start-quest",  function(data) {
    		if (data.ok)
    		{
    			UpdateQuest();
    			chrome.extension.getBackgroundPage().newQuestStatus = "running";
    	        displayMasterButtons("running");
    		}
    	});
    });
    
    $("#finishQuest").click(function() {
    	$.getJSON(config.serverUrl + "master/finish-quest",  function(data) {
    		if (data.ok)
    		{
    			UpdateQuest();
    			chrome.extension.getBackgroundPage().newQuestStatus = "finished";
    	        displayMasterButtons("finished");
    		}
    	});
    });
    
    $("#deleteQuest").click(function() {
    	$.getJSON(config.serverUrl + "master/delete-quest",  function(data) {
    		if (data.ok)
    		{
    			UpdateQuest();
    			chrome.extension.getBackgroundPage().newQuestStatus = "new";
    			chrome.extension.getBackgroundPage().newQuestHash = null;
    			chrome.browserAction.setPopup({"popup": "views/default.html"});
    			window.location.href = "default.html";
    		}
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
        $.getJSON(config.serverUrl + "player/quest-status", function callback(data) 
        {
        	$("#qstatus").html(data.status);
        	
        	var table = $("#players");
            var template = $("#players-template").html();
            if (data.players) 
            {
                table.empty();
                table.append("List of players:<br>");
                data.players.forEach(function(player) {
	                var html = template;
	                html = html.replace("{name}", player.name);
	                html = html.replace("{completed}", player.completed);
	                table.append(html);
                });
            }
        });       
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