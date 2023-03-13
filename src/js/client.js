import "./../css/client.css";
import ExcursionsAPI from "./ExcursionsAPI";

document.addEventListener("DOMContentLoaded", init);
const tripApi = new ExcursionsAPI();
let cartToApi = [];

function init() {
	loadTrips();
	const tripsWrapper = document.querySelector(".excursions");
	tripsWrapper.addEventListener("submit", makeTripSummary);

	const orderSubmit = document.querySelector(".order");
	const summaryList = document.querySelectorAll(".panel__summary");

	orderSubmit.addEventListener("submit", submitOrder);
	summaryList.forEach(function (item) {
		item.addEventListener("click", removeTrip);
	});
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

function makeTripSummary(e) {
	e.preventDefault();
	const singleTripEl = e.target.parentElement;
	const title = singleTripEl.querySelector(".excursions__title");
	const childPrice = singleTripEl.querySelector(".adultPrice");
	const adultPrice = singleTripEl.querySelector(".childPrice");
	const adultsNumber = Number(e.target[0].value);
	const childrenNumber = Number(e.target[1].value);

	const tripBasket = {
		title: title.innerText,
		adultNumber: adultsNumber,
		adultPrice: adultPrice.innerText,
		childNumber: childrenNumber,
		childPrice: childPrice.innerText,
	};

	let errors = [];
	inputEvaluation(errors, adultsNumber, childrenNumber);

	if (errors.length > 0) {
		errors.forEach(function (error) {
			alert("Choose number of participants");
		});
	} else {
		addTripToSummary(tripBasket);
	}
}

function inputEvaluation(errorsArray, adultNr, childrenNr) {
	if (Number.isNaN(Number(adultNr)) || Number.isNaN(Number(childrenNr))) {
		errorsArray.push("This is not a number");
	}
	if (adultNr < 0 || childrenNr < 0) {
		errorsArray.push("Please choose correct number of participants");
	}
	if (adultNr === 0 && childrenNr === 0) {
		errorsArray.push("Fill in at least one field");
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
	const summaryPrices = basketSummaryTrip.querySelector(".summary__prices");
	const childrenNUmberInSummary = document.querySelector(".summary__children");
	const adultsInSummary = document.querySelector(".summary__adult");
	console.log(adultsInSummary);

	tripTitle.innerText = basketElement.title;
	summaryTotalPrice.innerText = `${
		basketElement.adultNumber * basketElement.adultPrice +
		basketElement.childNumber * basketElement.childPrice
	} EUR`;
	summaryPrices.innerText = `adults: ${adultsInSummary.innerText} x 99EUR, children: ${childrenNUmberInSummary.innerText} x 50EUR`;

	basketSummaryWrapper.appendChild(basketSummaryTrip);

	addFinalPrice(basketElement);
}

function createTripPrototype() {
	const basketSummaryWrapperEl = document.querySelector(".panel__summary");
	const basketSummaryPrototype = basketSummaryWrapperEl.querySelector(
		".summary__item--prototype"
	);

	console.log(basketSummaryPrototype);
	const basketSummaryTripEl = basketSummaryPrototype.cloneNode(true);
	console.log(basketSummaryTripEl);
	basketSummaryTripEl.classList.remove("summary__item--prototype");
	if (basketSummaryPrototype.classList.contains("summary__item--prototype")) {
		basketSummaryPrototype.classList.remove = "summary__item--prototype";
	}
	return basketSummaryTripEl;
}

function addFinalPrice(basketEl) {
	const basketSummaryWrapperElement = document.querySelector(".panel__summary");
	const tripsList =
		basketSummaryWrapperElement.querySelectorAll(".summary__item");
	const totalPrice = document.querySelector(".order__total-price-value");

	finalPrice +=
		parseFloat(basketEl.adultNumber * basketEl.adultPrice) +
		parseFloat(basketEl.childNumber * basketEl.childPrice);

	totalPrice.innerText = `${finalPrice} EUR`;
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
	} else {
		errors.forEach(function (error) {
			const errorLiEl = document.createElement("li");
			errorLiEl.innerText = error;
			errorLiEl.style.color = "pink";
			alertsList.appendChild(errorLiEl);
		});
	}
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

function sendOrderToCart(name, email, price) {
	const panelSummary = document.querySelector(".panel__summary");
	const tripsSummary = panelSummary.querySelectorAll(".summary__item");

	console.log(tripsSummary);

	tripsSummary.forEach(trip => {
		const title = trip.querySelector(".summary__name");
		console.log(trip);

		const childPrice = trip.querySelector(".childPrice");
		console.log(childPrice);
		const adultPrice = trip.querySelector(".adultPrice");
		const childrenNumber = trip.querySelector(".summary__children");
		const adultNumber = trip.querySelector(".summary__adult");

		const tripsData = {
			title: title.innerText,
			adultPrice: adultPrice.innerText,
			adultNumber: adultNumber,
			childPrice: childPrice,
			childNumber: childrenNumber,
		};

		console.log(tripsData);
		cartToApi.push(tripsData);
	});

	console.log(cartToApi);
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
		".summary__total-price"
	);
	const totalPrice = document.querySelector(".order__total-price-value");
	let total = 0;
	summaryPricesList.forEach(price => {
		total += Number(price.innerText.replace("EUR", ""));
	});

	const sum = total;
	totalPrice.innerText = sum + " EUR";
}
