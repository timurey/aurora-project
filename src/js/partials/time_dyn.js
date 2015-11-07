/*
 * LOCALTIME
 */
var clockAPI = "/rest/v1/clock/"
var ntpAPI = "/rest/v1/ntp/"


function localtime_update()
{
	$.getJSON(clockAPI, function(data) {
 	// Получаем шаблон
 	var templateScript = $('#date_and_time_template').html();  
 	// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 	var template = Handlebars.compile(templateScript);  
	// Формируем HTML и вставляем в документ
	$('#date_and_time').html(template(data));
});
 	window.setTimeout(localtime_update, 1000);
}




/*
 * Misc.
 */


 $(document).ready(function() {

 	localtime_update();

 });
