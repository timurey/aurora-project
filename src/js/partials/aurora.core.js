/*
 * LOCALTIME
 */
var restAPI = "/rest/v1/restapi"
var mainObject = {}

function doHanleBars(obj) {

    var Templates = HandleBarsTeplatesData[obj.parent.name] //объект HandleBarsTeplatesData описан в handlebars.html

    for (var num in Templates) {
        // Получаем шаблон
        var templateScript = $(Templates[num].tBody).html();
        // Функция Handlebars.compile принимает шаблон и возвращает новую функцию
        var template = Handlebars.compile(templateScript);
        // Формируем HTML и вставляем в документ
        var html = template(obj);
        $('.' + Templates[num].tPlace).html(html);
    }
}

function recursiveSearchElements(obj) {
    obj.statusCode = "";
    var allowGet = false;
    var pHtmlColl;
    //Find current object in parent elements
    if (obj.parent !== undefined) {

        obj.domEl = [];
        var len = obj.domEl.length; //Сохраняем длину текущего domEl
        for (var num = 0; num < obj.parent.domEl.length; num++) { //Ищем текущий объект во всех родительских 
            pHtmlColl = obj.parent.domEl[num].getElementsByClassName(obj.name);
            for (var i = 0; i < pHtmlColl.length; i++) {
                obj.domEl[obj.domEl.length + num] = pHtmlColl[i];
            }
        }

    } else {
        obj.domEl.length = 1;
    }
    for (var i = 0; i < obj.method.length; i++) {
        if (obj.method[i] === "GET") {
            allowGet = true;
        }
    }
    if (allowGet == true && (obj.domEl.length > 0)) {
        $.ajax({
            dataType: "json",
            url: obj.path,
            success: {},
            statusCode: {
                200: function(data) {
                    obj.response = data;
                    obj.statusCode = 200;
                    obj.response.parent = obj;
                    doHanleBars(obj.response);
                },
                300: function(data) {
                    obj.response = JSON.parse(data.responseText);
                    obj.statusCode = 300;
                    console.log("Got it!: " + data.responseText);
                    for (var i = 0; i < obj.response[obj.name].length; i++) {
                        obj.response[obj.name][i].parent = obj;
                        recursiveSearchElements(obj.response[obj.name][i]);
                    }
                },
                404: {

                },
                501: {

                }
            }
        });
    }
}

$(document).ready(function() {

    mainObject.path = restAPI;
    mainObject.name = "classes";
    mainObject.method = ["GET"];
    mainObject.domEl = [];
    mainObject.domEl[0] = document.getElementsByTagName('body')[0];
    recursiveSearchElements(mainObject);

});
