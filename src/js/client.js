import "./../css/client.css";
import ExcursionsAPI from "./ExcursionsAPI";
console.log("client");

document.addEventListener("DOMContentLoaded", init);
const tripsUrl = "http://localhost:3000/excursions";

function init() {
	console.log("init");
	loadTrips();
}

function loadTrips() {
	fetch(tripsUrl)
		.then(resp => {
			if (resp.ok) {
				return resp.json();
			}
			return Promise.reject(resp);
		})
		.then(data => console.log(data))
		.then(data => console.log(Array.isArray(data)))

		.then(data => insertTripsToHtml(data))
		.catch(err => console.error(err));
}

function insertTripsToHtml(tripsData) {
	const tripPrototype = document.querySelector(".excursions__item--prototype");
	const tripsWrapper = document.querySelector(".panel__excursions");

	tripsData.forEach(trip => {
		const singleTrip = tripPrototype.cloneNode(true);
		singleTrip.classList.remove("excursions__item--prototype");
		console.log(singleTrip);

		const tripTitle = tripPrototype.querySelector(".excursions__title");
		const tripDescription = tripPrototype.querySelector(
			".excursions__description"
		);

		const adultPrice = tripPrototype.querySelector(".adultPrice");
		const childPrice = tripPrototype.querySelector(".childPrice");

		console.log(adultPrice, childPrice);

		tripTitle.innerText = trip.name;

		console.log(trip.name);
		tripDescription.innerText = trip.description;
		adultPrice.innerText = trip.adultPrice;
		childPrice.innerText = trip.childPrice;

		tripsWrapper.appendChild(singleTrip);
	});
}
