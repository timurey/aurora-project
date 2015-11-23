var temperatureAPI = "/rest/v1/sensors/temperature"

var temperatureTemplates = ["temperature_template"];
	
var temperatureType = ["temperature_place"]

var exist=0;

var constDataTemperature = {"temperature":[ {"id":0,"name":"Температура воздуха","place":"room","value":"21.2","serial":"28:3A:CF:7B:04:00:00:D3","online":true},{"id":1,"name":"air","place":"kitchen","value":"0.0","serial":"28:33:96:6A:05:00:01:3F","online":false},{"id":2,"name":"hot water","place":"bath room","value":"20.7","serial":"28:A7:74:7C:04:00:00:91","online":true}]};

function temperature_update()
{

	exist=0;
	var value_1;
	for (var i = 0; i < temperatureType.length; i++) 
	{
		var element = document.getElementsByClassName(temperatureType[i]);
		if(element.length>0)
		{
			exist++;
		}
	};

	if (exist)
		{
			var value;
// var data = constDataTemperature;
$.getJSON(temperatureAPI, function(data) {
			
 				// Получаем шаблон
				var templateScript = $('#temperature_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.temperature_place').html(template(data));

				});
			
			window.setTimeout(temperature_update, 4000);
 		}
}


function temperature_create()
{
	// var data = data1;
	exist=0;
	var value_1;
	var i;
	var value;
	for (i = 0; i < temperatureType.length; i++) 
	{
		var element = document.getElementsByClassName(temperatureType[i]);
		if(element.length>0)
		{
			exist++;
		}
	};
	if (exist)
		{
// var data = constDataTemperature;
$.getJSON(temperatureAPI, function(data) {
			
 				// Получаем шаблон
				var templateScript = $('#temperature_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.temperature_place').html(template(data));

				});
 		}
 		window.setTimeout(temperature_update, 4000);
}




/*
 * Misc.
 */


 $(document).ready(function() {
 	Handlebars.registerHelper('makeSerialTrTooltip', function() {
 		var serial = Handlebars.escapeExpression(this.serial);
 		var string = "<tr data-toggle=\"tooltip\" title=\""+serial+"\">";
 		return string;
 	});
	window.setTimeout(temperature_create, 1000);
 });
