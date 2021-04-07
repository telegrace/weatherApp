new Vue({
	el: "#main-container",
	data: {
		name: "Irn Bru",
		seen: true,
		error: false,
		cities: [],
		weather: [],
		searchTerm: "",
	},
	mounted: function () {
		console.log("my main vue instance has mounted!");
	},
	methods: {
		handleEnter: function (event) {
			console.log("You typed", event.target.value);
			axios.get("/test/" + event.target.value).then(({ data }) => {
				if (data.success === true) {
					this.seen = !this.seen;
					this.error = false;
					console.log("GRACE", data.weather);
					this.weather = data.weather;
				} else {
					this.error = true;
				}
			});
		},
		searchAgain: function () {
			this.seen = !this.seen;
		},
	},
});
