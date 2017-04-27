$(function() {

	// UI Outlets
	var listDivContainer = $("#weather-result .container");
	var template = document.getElementById("template");

	var api = new API_Connect({

		url: 'http://api.openweathermap.org/data/2.5/weather',
		apikey: '9b5ce98ebde507370ddccee0e549abf6'

	});

	api.request({

		'appid': api.apikey,
		'q' : 'newyork',
		'units' : 'imperial'

	}, function(result, status) {
		
		if(status == "success") {

			loadCurrentWeather(result);
			console.log(result);

		} else {

		}
				
	});

	function loadCurrentWeather(data) {
		listDivContainer.html(Mustache.to_html(template.innerHTML, data));
	}

});



