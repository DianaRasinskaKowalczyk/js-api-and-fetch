import "./../css/admin.css";
import ExcursionsAPI from "./ExcursionsAPI";
import showAlert from "./helper";

document.addEventListener("DOMContentLoaded", init);
const tripApi = new ExcursionsAPI();

function init() {
	loadTrips();
	addNewTrip();
	deleteTrip();
	updateTrip();
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
	Array.from(tripsWrapper.children).forEach(child => {
		if (!child.className.includes("excursions__item--prototype")) {
			child.parentElement.removeChild(child);
		}
	});
	tripsData.forEach(trip => {
		const oneTrip = makeSingleTrip(tripPrototype, trip);
		tripsWrapper.appendChild(oneTrip);
	});
}

function makeSingleTrip(prototype, trip) {
	const singleTrip = prototype.cloneNode(true);
	singleTrip.classList.remove("excursions__item--prototype");
	singleTrip.dataset.id = trip.id;
	singleTrip.querySelector(".excursions__title").innerText = trip.name;
	singleTrip.querySelector(".excursions__description").innerText =
		trip.description;
	singleTrip.querySelector(".adultPrice").innerText = trip.adultPrice;
	singleTrip.querySelector(".childPrice").innerText = trip.childPrice;

	return singleTrip;
}

function deleteTrip() {
	const allTrips = document.querySelector(".panel__excursions");
	allTrips.addEventListener("click", removeTrip);
}

function removeTrip(e) {
	e.preventDefault();
	const clickedTrip = e.target;

	if (clickedTrip.className.includes("excursions__field-input--remove")) {
		const tripToRemove = clickedTrip.parentElement.parentElement.parentElement;
		allTrips.removeChild(tripToRemove);

		const id = tripToRemove.dataset.id;

		tripApi
			.removeData(id)
			.catch(err => console.error(err))
			.finally(loadTrips);
	}
}

function addNewTrip() {
	const addTripForm = document.querySelector(".form");
	addTripForm.addEventListener("submit", createNewTrip);
}

function createNewTrip(e) {
	e.preventDefault();
	const addTripForm = document.querySelector(".form");
	const [tripName, tripDescription, priceAdult, priceChild] =
		addTripForm.elements;

	const dataToApi = {
		name: tripName.value,
		description: tripDescription.value,
		adultPrice: priceAdult.value,
		childPrice: priceChild.value,
	};

	let errors = [];
	inputEvaluation(errors, priceAdult, priceChild, tripName, tripDescription);

	if (errors.length > 0) {
		showAlert(errors);
	} else {
		tripApi
			.add(dataToApi)
			.then(resetForm)
			.catch(err => console.error(err))
			.finally(loadTrips);
	}
}

function resetForm() {
	const allInputs = document.querySelectorAll("form");
	allInputs.forEach(function (form) {
		form.reset();
	});
}

function inputEvaluation(
	errorsArray,
	adultPrice,
	childrenPrice,
	tripName,
	tripDescription
) {
	if (
		adultPrice.value < 0 ||
		childrenPrice.value < 0 ||
		adultPrice.value === "" ||
		childrenPrice.value === "" ||
		tripName.value === "" ||
		tripDescription === ""
	) {
		errorsArray.push("Please set a price and fill in all empty spaces");
	}
}

function updateTrip() {
	const allTrips = document.querySelector(".panel__excursions");
	allTrips.addEventListener("click", editTrip);
}

function editTrip(e) {
	e.preventDefault();
	const clickedTrip = e.target;

	if (clickedTrip.className.includes("excursions__field-input--update")) {
		const parentEl = clickedTrip.parentElement.parentElement.parentElement;
		const editableList = parentEl.querySelectorAll(".editable");
		const isEditable = [...editableList].every(
			editItem => editItem.isContentEditable
		);

		if (isEditable) {
			const id = parentEl.dataset.id;

			const [name, description, adultPrice, childPrice] = editableList;

			const dataToEdit = {
				name: name.innerText,
				description: description.innerText,
				adultPrice: adultPrice.innerText,
				childPrice: childPrice.innerText,
			};

			tripApi
				.editData(id, dataToEdit)
				.catch(err => console.error(err))
				.finally(() => {
					clickedTrip.value = "edit";
					editableList.forEach(editItem => (editItem.contentEditable = false));
				});
		} else {
			clickedTrip.value = "save";
			editableList.forEach(editItem => {
				editItem.contentEditable = true;
			});
		}
	}
}
