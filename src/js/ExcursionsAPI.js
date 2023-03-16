class ExcursionsAPI {
	constructor() {
		this.url = "http://localhost:3000/excursions";
		this.adminUrl = "http://localhost:3000/orders";
	}

	loadData() {
		return this._fetch();
	}

	add(data) {
		const options = {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		};

		return this._fetch(options);
	}

	_fetch(options, additionalPath = "") {
		const url = this.url + additionalPath;
		return fetch(url, options).then(resp => {
			if (resp.ok) {
				return resp.json();
			}
			return Promise.reject(resp);
		});
	}

	removeData(id) {
		const options = {
			method: "DELETE",
		};

		return this._fetch(options, `/${id}`);
	}

	editData(id, dataToEdit) {
		const options = {
			method: "PUT",
			body: JSON.stringify(dataToEdit),
			headers: { "Content-Type": "application/json" },
		};

		return this._fetch(options, `/${id}`);
	}

	addOrder(dataToApi) {
		const options = {
			method: "POST",
			body: JSON.stringify(dataToApi),
			headers: { "Content-Type": "application/json" },
		};

		return fetch(this.adminUrl, options).then(resp => {
			if (resp.ok) {
				return resp.json();
			}
			return Promise.reject(resp);
		});
	}
}

export default ExcursionsAPI;
