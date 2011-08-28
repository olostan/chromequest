function listTasks() {
   $("#qhash").append("AA {"+chrome.extension.getBackgroundPage().currentQuestHash+"}");
   
   $.getJSON(service("player/quest-tasks"), function callback(data) {
        var table = $("#tasks");
        var template = $("#task-template").html();
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
}