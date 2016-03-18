/*eslint no-undef: 2*/
class AjaxRequest {
	
	constructor(url, successCallback, errorCallback) {
		this.url = url;
		this.successCallback = successCallback;
		this.errorCallback = errorCallback;
	}

	fetchData() {
		$.ajax({
			url: this.url,
			dataType: 'jsonp',
			crossDomain: true,
			success: this.successCallback,
			error: this.errorCallback,
			context: document.body
		});
	}

}

class Model {

	constructor({ items }) {
		this.items = items;
	}

}

class InventoryItemsView {
	render(model) {
		let items = model.items;

		var inventoryItemsTemplate;

		if (items.length) {
			inventoryItemsTemplate = `<table>
				<thead>
					<th>Label</th>
					<th>Type</th>
					<th>Expiry</th>
				</thead>
				<tbody>
					${items.map(item => `<tr>
						<td>${item.label}</td>
						<td>${item.type}</td>
						<td>${item.expiry}</td>
					</tr>`).join('\n    ')}
				</tbody>
			</table>`;
		} else {
			inventoryItemsTemplate = `<p>
				There are no items in the inventory.
			</p>`;
		}

		$('main').append(inventoryItemsTemplate);
	}
}

class Controller {

	constructor(url) {
		this.url = url;
	}

	getUrl() {
		return this.url;
	}

	// ajax success callback
	populateView(data) {
		let model = new Model(data);
		
		let views = new Set([ 
			new InventoryItemsView()
		]);

		for (let view of views) {
			view.render(model);
		}
	}

	// ajax error callback
	error() {
		console.log('error');
	}

	getData() {
		let inventoryRequest = new AjaxRequest(this.url, this.populateView, this.error);
		inventoryRequest.fetchData();
	}

	addNewItem(url, formId) {
		var form = $(formId);
		var formData = form.serializeArray();

		$.ajax({
			url: url,
			type: 'POST',
			data: formData,
			dataType: 'json'
		});
		
	}

	addEventListeners() {
		let form = document.getElementById('add-item');
		let self = this;
		form.addEventListener('submit', event => {
			event.preventDefault();
			self.addNewItem(self.url, form);
		});
	}

}


window.onload = function() {
	let controller = new Controller('http://localhost:3000/items');
	controller.getData();
	controller.addEventListeners();
};