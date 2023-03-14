import "./../css/admin.css";

import ExcursionsAPI from "./ExcursionsAPI";
document.addEventListener("DOMContentLoaded", init);
const adminUrl = "http://localhost:3000/excursions";
const addTripForm = document.querySelector(".form");

const allTrips = document.querySelector(".panel__excursions");

const tripApi = new ExcursionsAPI();

function init() {
	loadTrips();
	allTrips.addEventListener("submit", removeTrip);
	allTrips.addEventListener("submit", editTrip);
	addTripForm.addEventListener("submit", addTrip);
}

function loadTrips() {
	tripApi
		.loadData()
		.then(data => insertTripsToHtml(data))
		.catch(err => console.error(err));
}

function insertTripsToHtml(tripsData) {
	const tripPrototype = document.querySelector(".excursions__item--prototype");
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
	singleTrip.querySelector(".excursions__title").innerText = trip.name;
	singleTrip.querySelector(".excursions__description").innerText =
		trip.description;
	singleTrip.querySelector(".adultPrice").innerText = trip.adultPrice;
	singleTrip.querySelector(".childPrice").innerText = trip.childPrice;

	return singleTrip;
}

function removeTrip(e) {
	e.preventDefault();
	const clickedTrip = e.target;
	const tripToRemove = clickedTrip.parentElement.parentElement.parentElement;
	allTrips.removeChild(tripToRemove);

	const id = tripToRemove.dataset.id;
	const options = {
		method: "DELETE",
	};

	fetch(`${adminUrl}/${id}`, options)
		.then(resp => console.log(resp))
		.catch(err => console.error(err))
		.finally(loadTrips);
}

function addTrip(e) {
	e.preventDefault();
	console.log(addTripForm);
	const tripName = addTripForm.elements[0];
	const tripDescription = addTripForm.querySelector(".form__field--longtext");
	const priceAdult = addTripForm.elements[2];
	const priceChild = addTripForm.elements[3];

	const dataToApi = {
		name: tripName.value,
		description: tripDescription.value,
		childPrice: priceAdult.value,
		childPrice: priceChild.value,
	};

	let errors = [];
	inputEvaluation(errors, priceAdult, priceChild, tripName, tripDescription);

	if (errors.length > 0) {
		errors.forEach(function (error) {
			alert("Fill in all empty spaces. Make sure to set a correct price.");
		});
	} else {
		addDataToApi(dataToApi);
	}
}

function inputEvaluation(errorsArray, adultPrice, childrenPrice) {
	if (
		adultPrice.value < 0 ||
		childrenPrice.value < 0 ||
		adultPrice.value === "" ||
		childrenPrice.value === ""
	) {
		errorsArray.push("Please set a price");
	}
}

function addDataToApi(data) {
	const options = {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	};
	fetch(adminUrl, options)
		.then(resp => console.log(resp))
		.catch(err => console.error(err))
		.finally(loadTrips);
}

function editTrip(e) {
	e.preventDefault();
	const clickedTrip = e.currentTarget;

	console.log(clickedTrip);

	if (clickedTrip.classList.contains("excursions__field-input--update")) {
		const parentEl = targetEl.parentElement.parentElement;
		const editableList = parentEl.querySelectorAll(".editable");
		const isEditable = [...editableList].every(
			editItem => editItem.isContentEditable
		);

		if (isEditable) {
			const id = parentEl.dataset.id;

			const dataToEdit = {
				name: editableList[0].innerText,
				description: editableList[1].innerText,
				adultPrice: editableList[2].innerText,
				childPrice: editableList[3].innerText,
			};

			const options = {
				method: "PUT",
				body: JSON.stringify(dataToEdit),
				headers: { "Content-Type": "application/json" },
			};

			fetch(`${apiUrl}/${id}`, options)
				.then(resp => console.log(resp))
				.catch(err => console.error(err))
				.finally(() => {
					targetEl.innerText = "edit";
					spanList.forEach(span => (span.contentEditable = false));
				});
		} else {
			clickedTrip.innerText = "save";
			editableList.forEach(editItem => {
				editItem.isContentEditable = true;
			});
		}
	}
}
