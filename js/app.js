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

class DeleteMessageView {
	render(type, message) {
		console.log('this is the ' + type + ' view, message is ' + message);
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

	deleteItem(url) {
		let inputDelete = document.getElementById('item-label-delete');

		$.ajax({
			url: url + '/' + inputDelete.value,
			type: 'DELETE',
			success: function() {
				let view = new DeleteMessageView();
				view.render('success', 'success, item has been deleted');
			},
			error: function(xhr) {
				let view = new DeleteMessageView();
				view.render('error', xhr.responseText);
			}
		});
	}

	addEventListeners() {
		let form = document.getElementById('add-item');
		//let buttonDelete = document.getElementById('button-delete');
		//let inputDelete = document.getElementById('item-label-delete');

		let self = this;
		
		form.addEventListener('submit', event => {
			event.preventDefault();
			self.addNewItem(self.url, form);
		});

		// buttonDelete.addEventListener('click', () => {
		// 	self.deleteItem(self.url);
		// });

	}

}


window.onload = function() {
	let controller = new Controller('http://localhost:3000/items');
	controller.getData();
	controller.addEventListeners();
};