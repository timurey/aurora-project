
/*
 * LOCALTIME
 */
var restAPI = "/rest/v1/"
var mainObject = {}

function findElements(_methods) {

    for (var key in _methods) { //Перебираем все классы

        var element = document.getElementsByClassName(_methods[key].name);

        if (element.length > 0) {
            _methods[key].exist = true; // Отмечаем, что он есть
            console.log("Found this method: " + _methods[key].name);
        } else {
            _methods[key].exist = false; //Или нет
            console.log("Can't found this method: " + _methods[key].name);
        }
    }
}

function getValues() {
    for (var key in methods) {

        if (methods[key].exist == true) {
            $.ajax({
                dataType: "json",
                url: methods[key].path,
                context: {
                    Kkey: key
                },
                success: function(data) {
                    var Templates = HandleBarsTeplatesData[methods[this.Kkey].name]
                    for (var num in Templates) {
                        // Получаем шаблон
                        var templateScript = $(Templates[num].templateBody).html();
                        // Функция Handlebars.compile принимает шаблон и возвращает новую функцию
                        var template = Handlebars.compile(templateScript);
                        // Формируем HTML и вставляем в документ
                        $(Templates[num].templatePlace).html(template(data));
                    }
                },
                statusCode: {
                    300: function(data) {
                        //Есть субэлементы
                        methods[Kkey].subs = true;
                    }
                }
            });

        }
    }
}



function recursiveSearchElements(obj) {
    obj.statusCode = "";
    var allowGet = false;
    for (var i = 0; i < obj.method.length; i++) {
        if (obj.method[i] === "GET") {
            allowGet = true;
        }
    }
    if (allowGet == true) {
        $.ajax({
            dataType: "json",
            url: obj.path,
            success: {},

            statusCode: {
                200: function(data) {
                    // obj.response = JSON.parse(JSON.stringify(data));
                    obj.response = data;
                    obj.statusCode = 200;
                    var element = document.getElementsByClassName(obj.name);
                    if (element.length > 0) {
                        for (var num in obj.response[obj.name])
                            {
                                
                            }

                    }
                },
                300: function(data) {
                    obj.response = JSON.parse(data.responseText);
                    obj.statusCode = 300;
                    console.log("Got it!: " + data.responseText);
                    for (var i = 0; i < obj.response[obj.name].length; i++) {
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

    recursiveSearchElements(mainObject);

});