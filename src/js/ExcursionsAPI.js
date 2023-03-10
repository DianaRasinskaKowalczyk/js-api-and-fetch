class ExcursionsAPI {
	constructor() {
		this.url = "http://localhost:3000/excursions";
	}

	loadData() {
		return fetch(this.url).then(resp => {
			if (resp.ok) {
				return resp.json();
			}
			return Promise.reject(resp);
		});
	}
}

export default ExcursionsAPI;
