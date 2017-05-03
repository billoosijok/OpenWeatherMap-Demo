$(function() {

	// UI Outlets
	var listDivContainer = $("#weather-result .container");
	
	var current_weather_template = document.getElementById("current_weather_template");
	var forecast_weather_template = document.getElementById("forecast_weather_template");
	
	var current_weather_container = $("#weather-result #current_weather");
	var forecast_weather_container = $("#weather-result #forecast_weather");

	var searchForm = $("#search-form");
	var statusBar = $("#status-bar");

	var cur_weather_api = new API_Connect({

		url: 'http://api.openweathermap.org/data/2.5/weather',
		apikey: '9b5ce98ebde507370ddccee0e549abf6'

	});

	var forecast_weather_api = new API_Connect({

		url: 'http://api.openweathermap.org/data/2.5/forecast',
		apikey: '9b5ce98ebde507370ddccee0e549abf6'

	});

	

	init();

	function init() {

		var userLocation = {};

		navigator.geolocation.getCurrentPosition(function(pos) {
			
			userLocation.lat = pos.coords.latitude;
			userLocation.lon = pos.coords.longitude;

			makeRquestWithParams(cur_weather_api, {
				'appid': cur_weather_api.apikey,
				'lat' : userLocation.lat,
				'lon' : userLocation.lon,
				'units' : 'imperial'
			}, function(result) {
				
				loadCurrentWeather(listDivContainer, result);

			});

			// Requesting The Forecast Weather API
			makeRquestWithParams(forecast_weather_api, {
			'appid'	: forecast_weather_api.apikey,
			'lat' : userLocation.lat,
			'lon' : userLocation.lon,
			'units' : 'imperial'
			}, function(result) {
				loadForecastWeather(listDivContainer, result);

				var header = $("#weather-result .container h2")
				header.html(header.html() + " <span class='current_location'>(Current Location)</span>")
			});

		});

		searchForm.submit(function(e) {
			e.preventDefault();

			var query = searchForm.find("input[name='q']").val();

			if(query.length) {

					// Requesting The Current Weather API
					makeRquestWithParams(cur_weather_api, {
					'appid'	: cur_weather_api.apikey,
					'q'		: query,
					'units' : 'imperial'
					}, function(result) {
						loadCurrentWeather(listDivContainer, result);
					});

					// Requesting The Forecast Weather API
					makeRquestWithParams(forecast_weather_api, {
					'appid'	: forecast_weather_api.apikey,
					'q'		: query,
					'units' : 'imperial'
					}, function(result) {
						loadForecastWeather(listDivContainer, result);
						console.log(result);
					});

			} else {
				statusBar.html("<div class='error'>Please enter a location!</div>");
			}
		});

		searchForm.find("input[name='q']").keydown(function(event) {
			statusBar.html("");
		});
	}

	function loadCurrentWeather(container, data) {
		if(data) {
			current_weather_container.html(Mustache.to_html(current_weather_template.innerHTML, data));
		} else {
			statusBar.html("<div class='error'>Couldn't find such loaction!</div>");
		}
	}

	function loadForecastWeather(container, data) {
		if(data) {
			data.list = data.list.slice(0, 5);

			forecast_weather_container.html(Mustache.to_html(forecast_weather_template.innerHTML, data));
		} else {
			statusBar.html("<div class='error'>Couldn't find such loaction!</div>");
		}
	}

	function makeRquestWithParams(api, params, callback) {
		
		statusBar.html("<img src='resources/loading.gif'>");
		// current_weather_container.html("<img src='resources/loading.gif'>");
		// forecast_weather_container.html("<img src='resources/loading.gif'>");

		api.request(params, function(result, status) {
			
			statusBar.html("");

			if(status == "success") {
				callback(result);
			} else {
				callback(false);
			}
		});

}
});



