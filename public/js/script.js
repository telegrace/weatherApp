new Vue({
	el: "#main-container",
	data: {
		name: "Irn Bru",
		seen: true,
		error: false,
		loading: false,
		cities: [],
		weather: [],
		searchTerm: "",
	},
	mounted: function () {
		console.log("my main vue instance has mounted!");
	},
	methods: {
		handleEnter: function (event) {
			this.loading = true;
			console.log("You typed", event.target.value);
			axios.get("/test/" + event.target.value).then(({ data }) => {
				if (data.success === true) {
					this.loading = false;
					this.error = false;
					this.seen = !this.seen;
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
