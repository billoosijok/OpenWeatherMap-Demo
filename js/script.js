$(function() {

	// UI Outlets
	var listDivContainer = $("#weather-result .container");
	var template = document.getElementById("template");
	var searchForm = $("#search-form");
	var statusBar = $("#status-bar");

	var api = new API_Connect({

		url: 'http://api.openweathermap.org/data/2.5/weather',
		apikey: '9b5ce98ebde507370ddccee0e549abf6'

	});

	init();

	function init() {

		var userLocation = {};

		navigator.geolocation.getCurrentPosition(function(pos) {
			
			userLocation.lat = pos.coords.latitude;
			userLocation.lon = pos.coords.longitude;

			makeRquestWithParams(api, {
				'appid': api.apikey,
				'lat' : userLocation.lat,
				'lon' : userLocation.lon,
				'units' : 'imperial'
			}, function(result) {
				loadCurrentWeather(listDivContainer, result);
			});
		});

		searchForm.submit(function(e) {
			e.preventDefault();

			var query = searchForm.find("input[name='q']").val();

			if(query.length) {
					makeRquestWithParams(api, {
					'appid'	: api.apikey,
					'q'		: query,
					'units' : 'imperial'
				}, function(result) {
					loadCurrentWeather(listDivContainer, result);
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
			container.html(Mustache.to_html(template.innerHTML, data));
		} else {
			statusBar.html("<div class='error'>Couldn't find such loaction!</div>");
		}
	}

	function makeRquestWithParams(api, params, callback) {
		statusBar.html("<img src='resources/loading_boys.gif'>");
		
		api.request(params, function(result, status) {
			
			statusBar.html("");

			if(status == "success") {
				callback(result);
				console.log(result);
			} else {
				callback(false)
			}
		});

}
});



