const express = require("express");
const app = express();
const axios = require("axios");
let secret;
if (process.env.SECRET) {
	secret = process.env.SECRET;
} else {
	secret = require("./secret.json").secret;
}
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
			console.log(data);
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
							image:
								"https://" +
								data.current.condition.icon.slice(2),
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

app.listen(process.env.PORT || 8080, () =>
	console.log("Weather App up and running...")
);
