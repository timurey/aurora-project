var inputsAPI = "/rest/v1/sensors/inputs"

var inputTemplates = ["digital_template", "sequential_template", "dimmer_template", "analog_template"];
	
var inputType = ["digital_place",	"sequential_place", "dimmer_place", "analog_place"]

var exist=0;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};



var data1 = 
				{
					inputs:
						[{
							id: 0,
							name: "digital",
							place: "bath",
							type: "digital",
							value: false,
							serial: "34:51:0D:31:32:39:32:06",
							online: true
						},{
							id: 1,
							name: "dimmer",
							place: "room",
							type: "dimmer",
							value: 44,
							serial: "34:51:0D:31:32:39:32:05",
							online: false
						},{
							id: 2,
							name: "sequential",
							place: "bedroom",
							type: "sequential",
							value: 7,
							serial: "34:51:0D:31:32:39:32:04",
							online: false
						},{
							id: 3,
							name: "analog",
							place: "bath",
							type: "analog",
							value: 1265,
							serial: "34:51:0D:31:32:39:32:00",
							online: false
						}]
					};

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
 					if (data.inputs[i].type == 'analog')
 					{
 						$('#analog_'+data.inputs[i].id).val(data.inputs[i].value).trigger('change');

 					}
 					if (data.inputs[i].type == 'digital')
 					{
 						$('#digital_'+data.inputs[i].id).val((data.inputs[i].value? 100 : 0)).trigger('change');

 					}
 					if (data.inputs[i].type == 'sequential')
 					{
 						$('#sequential_'+data.inputs[i].id).val(parseInt(data.inputs[i].value,16)).trigger('change');

 					}
 				};
				

				});
			
			window.setTimeout(input_update, 400);
 		}
}


function input_create()
{
	// var data = data1;
	exist=0;
	var value_1;
	var i;
	var value;
	for (i = 0; i < inputType.length; i++) 
	{
		var element = document.getElementsByClassName(inputType[i]);
		if(element.length>0)
		{
			exist++;
		}
	};
	if (exist)
		{
			
			$.getJSON(inputsAPI, function(data) {
			
 				// Получаем шаблон
				var templateScript = $('#digital_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.digital_place').html(template(data));

 				var templateScript = $('#analog_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.analog_place').html(template(data));

				var templateScript = $('#sequential_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.sequential_place').html(template(data));

				var templateScript = $('#dimmer_template').html();
 				// Функция Handlebars.compile принимает шаблон и возвращает новую функцию
 				var template = Handlebars.compile(templateScript);
				// Формируем HTML и вставляем в документ
				$('.dimmer_place').html(template(data));	

 				// Get the size of an object
				var size = Object.size(data.inputs);
 				//Инициализируем Knob

 				var inputs = data["inputs"];
 				
 				for (var j = 0; j < size; j++) {
 					if (inputs[j].type == "dimmer")
 					{
 						$(function() {
 							$("#dimmer_"+inputs[j].id).knob();
 						});
 					}
 					else if (inputs[j].type == "digital")
 					{
 						$(function() {
 							$("#digital_"+inputs[j].id).knob();
 						});
 					}
 					else if (inputs[j].type == "analog")
 					{
 						$(function() {
 							$("#analog_" + inputs[j].id).knob();
 						});
 						$("#analog_"+inputs[j].id).trigger("configure",
					{
						max : 4096
					});
 					}
 					else if (inputs[j].type == "sequential")
 					{
 						$(function() {
 							$("#sequential_"+inputs[j].id).knob();
 						});
 						$('#sequential_'+inputs[j].id).trigger('configure',
					{
						max : 7
					});
 					}
 				};

				});
 		}
 		window.setTimeout(input_update, 1000);
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
 	Handlebars.registerHelper('makeAnalog', function() {
 		
 		var id = Handlebars.escapeExpression(this.id),
 		value = Handlebars.escapeExpression(this.value);
 		var string = "<input type=\"text\" id=\"analog_"+id+"\" class=\"knob\" value=\""+value+"\" data-width=\"90\" data-height=\"90\" data-angleArc=\"250\" data-angleOffset=\"-125\" data-fgColor=\"#3c8dbc\" data-readOnly=true>";
 		return string;
 	});

 	Handlebars.registerHelper('makeDigital', function() {
 		
 		var id = Handlebars.escapeExpression(this.id),
 		value = Handlebars.escapeExpression(this.value);

 		var string = "<input type=\"text\" id=\"digital_"+id+"\" class=\"knob\" value=\""+(value? 100 : 0)+"\" data-width=\"90\" data-height=\"90\" data-angleArc=\"250\" data-angleOffset=\"-125\" data-fgColor=\"#3c8dbc\" data-readOnly=true data-displayInput=\"false\">";
 		return string;
 	});

 	Handlebars.registerHelper('makeSequential', function() {
 		
 		var id = Handlebars.escapeExpression(this.id),
 		value = Handlebars.escapeExpression(this.value);

 		var string = "<input type=\"text\" id=\"sequential_"+id+"\" class=\"knob\" value=\""+value+"\" data-width=\"90\" data-height=\"90\" data-angleArc=\"250\" data-angleOffset=\"-125\" data-fgColor=\"#3c8dbc\" data-readOnly=true>";
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

	window.setTimeout(input_create, 1000);
 });
