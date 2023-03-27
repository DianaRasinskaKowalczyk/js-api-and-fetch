function showAlert(messages) {
	// const parent = document.querySelector(selector);
	messages.forEach(text => {
		// const p = document.createElement("p");
		// p.innerText = text;
		// parent.appendChild(p);
		alert(text);
	});
}

export default showAlert;
