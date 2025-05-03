
const uri = 'api/somethingitems';
let someItems = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const item = {
        name: addNameTextbox.value.trim()
    };
    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}
function loadJson() {
    fetch(uri)
        .then(response => response.json())
        .then(data => {
            document.getElementById('json-editor').value = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error('Unable to load JSON.', error));
}

function saveJson() {
    const jsonData = document.getElementById('json-editor').value;
    try {
        const parsedData = JSON.parse(jsonData);
        fetch(uri, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parsedData)
        })
            .then(() => alert('JSON saved successfully!'))
            .catch(error => console.error('Unable to save JSON.', error));
    } catch (e) {
        alert('Invalid JSON format!');
    }
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}
function displayEditForm(id) {
    const item = someItems.find(i => i.id === id);
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-name').value = item.name;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: itemId,
        name: document.getElementById('edit-name').value.trim()
    };
    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => {
            getItems();
            document.getElementById('editForm').style.display = 'none';
        })
        .catch(error => console.error('Unable to update item.', error));
}

function closeEditForm() {
    document.getElementById('editForm').style.display = 'none';
}
function _displayItems(data) {
    const tBody = document.getElementById('items');
    tBody.innerHTML = '';
    _displayCount(data.length);
    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });
    someItems = data;
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'item' : 'items';
    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}