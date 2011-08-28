$(document).ready(function(){
   loadConfig();
   
   $("#qhash").append(chrome.extension.getBackgroundPage().currentQuestHash);
   $.getJSON(service("player/quest-tasks"), function callback(data) {
        var table = $("#tasks");
        var template = $("#task-list-template").html();
        if (data.tasks) {
            table.empty();
            data.tasks.forEach(function(task) {
               var html = template;
               html = html.replace("{descr}",task.descr);
               html = html.replace("{taskStatus}",task.taskStatus);
               table.append(html);
            });

        }
   });
   
   function service(action) {
       return config.serverUrl + action;
   }
   
   $('#tellfriends').click(function(e){
       bg = chrome.extension.getBackgroundPage();

       clipboardholder= bg.document.getElementById("clipboardholder");

       clipboardholder.style.display = "block";

       clipboardholder.value = bg.currentQuestHash;

       clipboardholder.select();

       bg.document.execCommand("Copy");

       clipboardholder.style.display = "none";
       
       $("#message").toggleClass("show");
   });
});