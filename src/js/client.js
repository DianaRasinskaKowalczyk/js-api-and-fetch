import "./../css/client.css";
import ExcursionsAPI from "./ExcursionsAPI";
console.log("client");

document.addEventListener("DOMContentLoaded", init);
const tripApi = new ExcursionsAPI();

function init() {
	loadTrips();
}

function loadTrips() {
	tripApi
		.loadData()
		.then(data => insertTripsToHtml(data))
		.catch(err => console.error(err));
}

function insertTripsToHtml(tripsData) {
	const tripPrototype = document.querySelector(".excursions__item--prototype");
	console.log(tripPrototype);
	const tripsWrapper = document.querySelector(".panel__excursions");
	tripsWrapper.innerHTML = "";

	tripsData.forEach(trip => {
		const oneTrip = makeSingleTrip(tripPrototype, trip);
		tripsWrapper.appendChild(oneTrip);
	});
}

function makeSingleTrip(prototype, trip) {
	const singleTrip = prototype.cloneNode(true);
	singleTrip.classList.remove("excursions__item--prototype");

	prototype.querySelector(".excursions__title").innerText = trip.name;
	prototype.querySelector(".excursions__description").innerText =
		trip.description;
	prototype.querySelector(".adultPrice").innerText = trip.adultPrice;
	prototype.querySelector(".childPrice").innerText = trip.childPrice;

	return singleTrip;
}
