
/*
 * LOCALTIME
 */
var restAPI = "/rest/v1/"
var methods = {}

function findElements() {

    for (var key in methods) { //Перебираем все классы

        var element = document.getElementsByClassName(methods[key].name);

        if (element.length > 0) {
            methods[key].exist = true; // Отмечаем, что он есть
            console.log("Found this method: " + methods[key].name);
        } else {
            methods[key].exist = false; //Или нет
            console.log("Can't found this method: " + methods[key].name);
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
                }
            });

        }
    }
}


function methodsUpdate() {
    $.getJSON(restAPI) //Получаем возможные классы REST API и их методы

    .done(function(data) {
            for (var key in data.class) {
                methods[key] = data.class[key];
            }
            console.log("Got it!");
            findElements(); // Ищем экземпляры классов на странице
            getValues(); // Подставляем значения 
        })
        .fail(function() {
            console.log("Error");
        })
        .always(function() {
            console.log("Complete");
        });

    window.setTimeout(methodsUpdate, 1000);
}



/*
 * Misc.
 */


$(document).ready(function() {

    methodsUpdate();
});