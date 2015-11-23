var cpuAPI = "/rest/v1/cpu/"

	var cputemplates = ["uuid_template", "cpu_load_template", "cpu_clock_template", "cpu_temperature_template", "memory_total_template", "memory_heap_template", "memory_free_template"];
	var cpunames = ['uuid', "cpu_load", "cpu_clock", "cpu_temperature", "memory_total", "memory_heap", "memory_free"];

	var exist=0;

	var constDataCpu = {
					cpu: {
						load : 33,
						clock : 120000000,
						temperature : 38
					},
					 memory : {
					 	total : 131072,
					 	heap : 65536,
					 	free : 12800,
					 	usage : 52736
					},
					uid : "00:42:00:42:30:34:51:0D:31:32:39:32" 
				};

function status_update()
{
	exist=0;
	var value_1;
	for (var i = 0; i < cpunames.length; i++) 
	{
		var element = document.getElementsByClassName(cpunames[i]);
		if(element.length>0)
		{
			exist++;
		}
	};
	if (exist)
		{
			var value;
			// var dataSysInfo = constDataCpu;
			$.getJSON(cpuAPI, function(dataSysInfo) {
 				
 				// Получаем шаблон
 				var templateScript = $('#uuid_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.uuid').html(template(dataSysInfo));

				templateScript = $('#cpu_load_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.cpu_load').html(template(dataSysInfo));

				templateScript = $('#cpu_clock_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.cpu_clock').html(template(dataSysInfo));

				templateScript = $('#cpu_temperature_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.cpu_temperature').html(template(dataSysInfo));

				templateScript = $('#memory_total_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.memory_total').html(template(dataSysInfo));

				templateScript = $('#memory_heap_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.memory_heap').html(template(dataSysInfo));

				templateScript = $('#memry_free_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.memory_free').html(template(dataSysInfo));

				templateScript = $('#memory_usage_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.memory_usage').html(template(dataSysInfo));

				//Передаем значения в крговые диаграммы
				$('#cpu_load_knob').val(dataSysInfo.cpu.load).trigger('change');

				$('#cpu_temperature_knob').val(dataSysInfo.cpu.temperature).trigger('change');
				
				$('#memory_usage_knob').trigger('configure',
					{
						max : dataSysInfo.memory.heap
					});
				$('#memory_usage_knob').val(dataSysInfo.memory.usage).trigger('change');

				});
			
			window.setTimeout(status_update, 1000);
 		}
}




/*
 * Misc.
 */


 $(document).ready(function() {	
 	status_update(); 
 });