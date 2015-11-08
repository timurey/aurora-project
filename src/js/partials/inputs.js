var inputsAPI = "/rest/v1/sensors/inputs"

var inputTemplates = ["digital_template", "sequential_template", "dimmer_template", "analog_template"];
	
var inputType = ["digital",	"sequential", "dimmer_place", "analog"]

var exist=0;

// var data = 
// 				{
// 					inputs:
// 						[{
// 							id:0,
// 							name:"bath is full",
// 							place:"bath",
// 							type:"digital",
// 							value:false,
// 							serial:"34:51:0D:31:32:39:32:06",
// 							online:true
// 						},{
// 							id:1,
// 							name:"door is opened",
// 							place:"room",
// 							type:"dimmer",
// 							value:44,
// 							serial:"34:51:0D:31:32:39:32:05",
// 							online:false
// 						},{
// 							id:2,
// 							name:"light dimmer",
// 							place:"bedroom",
// 							type:"dimmer",
// 							value:25,
// 							serial:"34:51:0D:31:32:39:32:04",
// 							online:false
// 						},{
// 							id:3,
// 							name:"water level",
// 							place:"bath",
// 							type:"analog",
// 							value:1265,
// 							serial:"34:51:0D:31:32:39:32:00",
// 							online:false
// 						}]
// 					};

function input_update()
{

	exist=0;
	var value_1;
	for (var i = 0; i < inputType.length; i++) 
	{
		var element = document.getElementsByClassName(inputType[i]);
		if(element.length>0)
		{
			exist++;
		}
	};
	if (exist)
		{
			var value;
			
			$.getJSON(inputsAPI, function(data) {
			
				
 				//Передаем значения в крговые диаграммы
 				for (var i = 0; i < data.inputs.length; i++) {
 					if (data.inputs[i].type == 'dimmer')
 					{
 						$('#dimmer_'+data.inputs[i].id).val(data.inputs[i].value).trigger('change');

 					}
 				};
				

				});
			
			window.setTimeout(input_update, 100);
 		}
}


function input_create()
{

	exist=0;
	var value_1;
	for (var i = 0; i < inputType.length; i++) 
	{
		var element = document.getElementsByClassName(inputType[i]);
		if(element.length>0)
		{
			exist++;
		}
	};
	if (exist)
		{
			var value;
			
			$.getJSON(inputsAPI, function(data) {
			
 				// Получаем шаблон
 				var templateScript = $('#digital_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.digital').html(template(data));

 				var templateScript = $('#analog_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.analog').html(template(data));

				var templateScript = $('#sequential_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.sequential').html(template(data));

				var templateScript = $('#dimmer_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.dimmer_place').html(template(data));			
 				
 				//Инициализируем Knob
 				for (var i = 0; i < data.inputs.length; i++) {
 					if (data.inputs[i].type == 'dimmer')
 					{
 						$(function() {
 							$('#dimmer_'+data.inputs[i].id).knob();
 						});
 					}
 				};

				});
 		}
}




/*
 * Misc.
 */


 $(document).ready(function() {
 	Handlebars.registerHelper('makeDimmer', function() {
 		
 		var id = Handlebars.escapeExpression(this.id),
 		value = Handlebars.escapeExpression(this.value);
 		var string = "<input type=\"text\" id=\"dimmer_"+id+"\" class=\"knob\" value=\""+value+"\" data-width=\"90\" data-height=\"90\" data-angleArc=\"250\" data-angleOffset=\"-125\" data-fgColor=\"#3c8dbc\" data-readOnly=true>";
 		return string;

});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

	switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

	input_create();
 	input_update(); 
 });
