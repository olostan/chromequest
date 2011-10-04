
var quests = require("./quests");


var q = quests.addQuest("MyMaster","Some Quest","Desciption of some quest",{isopen:true});
q.addTask("http://google.com.ua/","Big number","full");
q.addTask("ya.ru","YaYa","domain");
q.addTask("yandex.ua","YaYa","domain");
q.open();
q.run();


