import "./../css/client.css";
import ExcursionsAPI from "./ExcursionsAPI";
import showAlert from "./helper";

document.addEventListener("DOMContentLoaded", init);
const tripApi = new ExcursionsAPI();

function init() {
	loadTrips();
	addTripsToCart();
	deleteTrip();
	sendTotalOrder();
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

	clearTrips(tripsData, tripPrototype, tripsWrapper);
}

function clearTrips(tripsData, prototype, tripsWrapper) {
	tripsData.forEach(trip => {
		const oneTrip = makeSingleTrip(prototype, trip);
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

function addTripsToCart() {
	const tripsWrapper = document.querySelector(".excursions");
	tripsWrapper.addEventListener("submit", makeTripSummary);
}

function makeTripSummary(e) {
	e.preventDefault();
	const singleTripEl = e.target.parentElement;
	const title = singleTripEl.querySelector(".excursions__title");
	const adultPrice = singleTripEl.querySelector(".adultPrice");
	const childPrice = singleTripEl.querySelector(".childPrice");

	const [adultsNumber, childrenNumber] = e.target;
	console.log(Number(adultsNumber.value), Number(childrenNumber.value));

	const adultNumber = Number(adultsNumber.value);
	const childNumber = Number(childrenNumber.value);

	// const adultsNumber = Number(e.target[0].value);
	// const childrenNumber = Number(e.target[1].value);

	const tripBasket = {
		title: title.innerText,
		adultNumber: adultNumber,
		adultPrice: adultPrice.innerText,
		childNumber: childNumber,
		childPrice: childPrice.innerText,
	};

	console.log(tripBasket);

	let errors = [];
	inputEvaluation(errors, adultNumber, childNumber);
	console.log(errors);

	if (errors.length > 0) {
		showAlert(errors);
	} else {
		addTripToSummary(tripBasket);
	}
}

function inputEvaluation(errorsArray, adultNr, childrenNr) {
	if (
		Number.isNaN(Number(adultNr)) ||
		Number.isNaN(Number(childrenNr)) ||
		adultNr <= 0 ||
		childrenNr <= 0 ||
		(adultNr === "" && childrenNr === "")
	) {
		errorsArray.push("Choose correct number of participants");
	}
}

let finalPrice = 0;

function addTripToSummary(basketElement) {
	const basketSummaryWrapper = document.querySelector(".panel__summary");
	const basketSummaryTrip = createTripPrototype();
	const tripTitle = basketSummaryTrip.querySelector(".summary__name");
	const summaryTotalPrice = basketSummaryTrip.querySelector(
		".summary__total-price"
	);
	const childrenInSummary =
		basketSummaryTrip.querySelector(".summary__children");
	const adultsInSummary = basketSummaryTrip.querySelector(".summary__adult");
	const adultPrice = basketSummaryTrip.querySelector(".adultPrice");
	const childrenPrice = basketSummaryTrip.querySelector(".childPrice");

	tripTitle.innerText = basketElement.title;
	summaryTotalPrice.innerText = `${
		basketElement.adultNumber * basketElement.adultPrice +
		basketElement.childNumber * basketElement.childPrice
	} EUR`;

	adultsInSummary.innerText = basketElement.adultNumber;
	childrenInSummary.innerText = basketElement.childNumber;
	adultPrice.innerText = basketElement.adultPrice;
	childrenPrice.innerText = basketElement.childPrice;

	basketSummaryWrapper.appendChild(basketSummaryTrip);
	addFinalPrice(basketElement);
}

function createTripPrototype() {
	const basketSummaryWrapperEl = document.querySelector(".panel__summary");
	const basketSummaryPrototype = basketSummaryWrapperEl.querySelector(
		".summary__item--prototype"
	);
	const basketSummaryTripEl = basketSummaryPrototype.cloneNode(true);
	basketSummaryTripEl.classList.remove("summary__item--prototype");
	return basketSummaryTripEl;
}

function addFinalPrice(basketEl) {
	const totalPrice = document.querySelector(".order__total-price-value");

	finalPrice +=
		parseFloat(basketEl.adultNumber * basketEl.adultPrice) +
		parseFloat(basketEl.childNumber * basketEl.childPrice);

	totalPrice.innerText = `${finalPrice} EUR`;
}

function sendTotalOrder() {
	const orderSubmit = document.querySelector(".order");
	orderSubmit.addEventListener("submit", submitOrder);
}

function submitOrder(e) {
	e.preventDefault();

	const inputList = e.target.querySelectorAll(".order__field-input");

	let errors = [];

	const alertsList = document.querySelector(".alertsList");
	alertsList.innerHTML = "";

	validateOrderForm(inputList, errors);

	if (errors.length === 0) {
		const name = e.target.querySelector(".order__field-input").value;
		const orderPrice = e.target.querySelector(
			".order__total-price-value"
		).innerText;
		const email = document.querySelector('[name="email"]').value;
		sendOrderToCart(name, email, orderPrice);

		alert(
			`Thank you for your order. Please check yor e-mail ${email} for details.`
		);

		resetForms();
		document.querySelector(".order__total-price-value").innerText = "0EUR";
	} else {
		errors.forEach(function (error) {
			createErrorAlert(error, alertsList);
		});
	}
}

function createErrorAlert(error, alertsList) {
	const errorLiEl = document.createElement("li");
	errorLiEl.innerText = error;
	errorLiEl.style.color = "pink";
	alertsList.appendChild(errorLiEl);
}

function validateOrderForm(inputListEl, errorsEl) {
	if (
		inputListEl[0].value === "" ||
		!Number.isNaN(Number(inputListEl[0].value))
	) {
		errorsEl.push("Fill in your name and lastname");
	}

	if (inputListEl[1].value === "" || !inputListEl[1].value.includes("@")) {
		errorsEl.push("Fill in a correct e-mail address");
	}

	if (finalPrice === 0) {
		errorsEl.push("Select a trip");
		alert("Select a trip");
	}
}

function sendOrderToCart(name, email, totalPrice) {
	const tripsSummary = document.querySelectorAll(".summary__item");

	const dataToApi = { name, email, totalPrice, tripInfo: [] };

	tripsSummary.forEach(trip => {
		const title = trip.querySelector(".summary__name");
		const childPrice = trip.querySelector(".childPrice");
		const adultPrice = trip.querySelector(".adultPrice");
		const childrenNumber = trip.querySelector(".summary__children");
		const adultNumber = trip.querySelector(".summary__adult");

		const tripsData = {
			title: title.innerText,
			adultPrice: adultPrice.innerText,
			adultNumber: adultNumber.innerText,
			childPrice: childPrice.innerText,
			childNumber: childrenNumber.innerText,
		};

		dataToApi.tripInfo.push(tripsData);
	});

	dataToApi.tripInfo.splice(0, 1);

	tripApi
		.addOrder(dataToApi)
		.then(resp => console.log(resp))
		.catch(error => console.error(error));
}

function resetForms() {
	const panelSummary = document.querySelector(".panel__summary");
	while (panelSummary.children.length > 1) {
		panelSummary.removeChild(panelSummary.lastElementChild);
	}
	const allForms = document.querySelectorAll("form");
	allForms.forEach(function (form) {
		form.reset();
	});
}

function deleteTrip() {
	const summaryList = document.querySelectorAll(".panel__summary");
	summaryList.forEach(function (item) {
		item.addEventListener("click", removeTrip);
	});
}

function removeTrip(e) {
	e.preventDefault();
	const panelSummary = e.currentTarget;
	const summaryItem = e.target.parentElement.parentElement;
	panelSummary.removeChild(summaryItem);
	updateTotalPrice();
}

function updateTotalPrice() {
	const summaryContainer = document.querySelector(".summary");
	const summaryPricesList = summaryContainer.querySelectorAll(
		"li:not(.summary__item--prototype) .summary__total-price"
	);
	const totalPrice = document.querySelector(" .order__total-price-value");

	console.log(totalPrice);
	finalPrice = 0;
	summaryPricesList.forEach(price => {
		finalPrice += Number(price.innerText.replace("EUR", ""));
	});
	totalPrice.innerText = finalPrice + " EUR";
}
