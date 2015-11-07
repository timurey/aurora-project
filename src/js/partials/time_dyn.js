/*
 * LOCALTIME
 */
var clockAPI = "/rest/v1/clock/"


function localtime_update()
{
	var exist=0;
	var element=document.getElementsByClassName("date_and_time");
	if(element)
		{
			exist++;
		}
	var element=document.getElementsByClassName("time");
	if(element)
		{
			exist++;
		}
	var element=document.getElementsByClassName("date");
	if(element)
		{
			exist++;
		}
		if (exist)
			{
				$.getJSON(clockAPI, function(data) {
 				// Получаем шаблон
 				var templateScript = $('#date_and_time_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.date_and_time').html(template(data));

				templateScript = $('#time_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.time').html(template(data));

				templateScript = $('#date_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.date').html(template(data));
				});
 				window.setTimeout(localtime_update, 1000);
 			}
}




/*
 * Misc.
 */


 $(document).ready(function() {

 	localtime_update();

 });
