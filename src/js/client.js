import "./../css/client.css";
import ExcursionsAPI from "./ExcursionsAPI";
console.log("client");

document.addEventListener("DOMContentLoaded", init);

function init() {
	console.log("init");
}

function loadTrips() {
	fetch("http://localost:3000/excursions")
		.then(resp => {
			if (resp.ok) {
				return resp.json();
			}
			return Promise.reject(resp);
		})
		.then(resp => console.log(resp))
		.catch(err => console.error(err));
}

loadTrips();
