const express = require("express");
const app = express();
const axios = require("axios");
const { secret } = require("./secret.json");
const { response } = require("express");

app.use(express.static("public"));

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
const activities = [
	"education",
	"cooking",
	"diy",
	"busywork",
	"relaxation",
	"recreational",
	"social",
	"charity",
	"music",
];

app.get("/cities", (req, res) => {
	console.log("hit the get route!");
	res.json(cities);
});

app.get("/test/:city", (req, res) => {
	axios
		.get(
			`http://api.weatherapi.com/v1/current.json?key=${secret}&q=${req.params.city}`
		)
		.then(({ data }) => {
			let activity;
			if (data.current.condition.code < 1031) {
				activity = Math.floor(Math.random() * 4);
			} else {
				activity = getRandomIntInclusive(4, 9);
			}
			axios
				.get(
					`https://www.boredapi.com/api/activity?type=${activities[activity]}`
				)
				.then((bored_data) => {
					res.json({
						weather: {
							name: data.location.name,
							country: data.location.country,
							currentTemp: data.current.temp_c,
							feelsLike: data.current.feelslike_c,
							desc: data.current.condition.text,
							uv: data.current.uv,
							wind_kph: data.current.wind_kph,
							localTime: data.location.localtime.slice(10),
							image: data.current.condition.icon,
							activity: bored_data.data.activity.toLowerCase(),
						},
						success: true,
					});
				});
		})
		.catch((error) => {
			console.log("Error", error.message);
			res.json({
				success: false,
			});
		});
});

app.listen(8080, () => console.log("Weather App up and running..."));

//there are 47 codes
/*
{
    "location": {
        "name": "Hong Kong",
        "country": "Hong Kong",
        "lat": 22.28,
        "lon": 114.15,
        "localtime": "2021-04-07 18:09"
    },
    "current": {
        "temp_c": 22.3,
        "condition": {
            "text": "Cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/day/119.png",
            "code": 1006
        },
        "wind_kph": 24.1,
        "wind_dir": "E",
        "humidity": 78,
        "feelslike_c": 24.7,
        "vis_km": 10.0,
        "uv": 5.0,
    }
}
*/
/*error	
code	1006
message	"No matching location found." */
