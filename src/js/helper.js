function showAlert(errors, cb, tripBasket) {
	if (errors.length > 0) {
		alert(`${errors}`);
	} else {
		cb(tripBasket);
	}
}

module.exports = showAlert;
