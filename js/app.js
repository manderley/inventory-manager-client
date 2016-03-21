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
					<th>Action</th>
				</thead>
				<tbody>
					${items.map(item => `<tr>
						<td>${item.label}</td>
						<td>${item.type}</td>
						<td>${item.expiry}</td>
						<td><button id="delete-${item.label}">Delete</button</td>
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

	deleteItem(url, itemID) {
		let id = itemID.split('-')[1];

		$.ajax({
			url: url + '/' + id,
			type: 'DELETE'
		});
	}

	addEventListeners() {
		let form = document.getElementById('add-item');
		let itemsContainer = document.getElementById('items-container');

		let self = this;
		
		form.addEventListener('submit', event => {
			event.preventDefault();
			self.addNewItem(self.url, form);
		});

		itemsContainer.addEventListener('click', event => {
			event.preventDefault();
			if (event.target && event.target.nodeName === 'BUTTON') {
				self.deleteItem(self.url, event.target.id);
			}
		});

	}

}


window.onload = function() {
	let controller = new Controller('http://localhost:3000/items');
	controller.getData();
	controller.addEventListeners();
};