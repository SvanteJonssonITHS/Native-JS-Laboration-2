const citiesContainer = document.querySelector('#cities-container'),
	addForm = document.querySelector('#add-form'),
	addFields = document.querySelectorAll('#add-form>input[id^=add-]'),
	editForm = document.querySelector('#edit-form'),
	editFields = document.querySelectorAll('#edit-form>input[id^=edit-]'),
	cancelBtns = document.querySelectorAll('.cancel-button'),
	addBtn = document.querySelector('#add-form>input[type=submit]'),
	editBtn = document.querySelector('.edit-modal>button'),
	deleteBtn = document.querySelector('.delete-modal>button')

let _cities = []

window.onload = async () => {
	errorCheck('add')
	//Inital GET
	_cities = await getCities()
	if (_cities) {
		console.info(`${getTime()} | Cities have been retrieved`)
		renderCities(_cities)
	}
	setInterval(async () => {
		const result = await getCities()
		if (JSON.stringify(_cities) != JSON.stringify(result)) {
			console.info(`${getTime()} | Updating cities...`)
			_cities = result
			renderCities(_cities)
		} else {
			console.info(`${getTime()} | No changes detected`)
		}
	}, 60000)

	addFields.forEach((field) => (field.oninput = () => errorCheck('add')))
	editFields.forEach((field) => (field.oninput = () => errorCheck('edit')))
	cancelBtns.forEach((btn) => (btn.onclick = () => closeModal()))
}
/**
 * Gets the current time in format HH:MM:SS
 */
getTime = () => {
	const d = new Date()
	let time = ''
	time += d.getHours().toString().length == 1 ? 0 + d.getHours().toString() + ':' : d.getHours() + ':'
	time += d.getMinutes().toString().length == 1 ? 0 + d.getMinutes().toString() + ':' : d.getMinutes() + ':'
	time += d.getSeconds().toString().length == 1 ? 0 + d.getSeconds().toString() : d.getSeconds()
	return time
}
/**
 * Gets the city with the corresponding id from the Avancera cities API
 * @param  {string} id
 */
getCity = async (id) => {
	const response = await fetch(`https://avancera.app/cities/${id}`)
	console.info(`${getTime()} | %cGET request%c for city %c${id}%c ended with status %c${response.status}`, 'color: blue', '', 'color: brown', '', 'color: purple')
	const result = await response.json()
	return result
}
/**
 * Gets all cities from the Avancera cities API
 */
getCities = async () => {
	const response = await fetch('https://avancera.app/cities/')
	console.info(`${getTime()} | %cGET request%c for all cities ended with status %c${response.status}`, 'color: blue', '', 'color: purple')
	const result = await response.json()
	return result
}
/**
 * Creates a DOM element from an object
 * @param  {Object} city
 */
createCityCard = (city) => {
	//Info wrapper
	const infoWrapper = document.createElement('div')
	infoWrapper.setAttribute('class', 'info-wrapper')

	//City name
	const name = document.createElement('h3')
	name.title = city.name
	name.textContent = city.name

	//City population
	const population = document.createElement('p')
	population.textContent = `Folkmängd: ${Intl.NumberFormat().format(city.population)}`

	//Elements added to wrapper
	infoWrapper.append(name, population)

	//Action wrapper
	const actionsWrapper = document.createElement('div')
	actionsWrapper.setAttribute('class', 'actions-wrapper')

	//Edit button
	const edit = document.createElement('button')
	edit.title = 'Redigera'
	edit.innerHTML = '<span class="material-icons">edit</span>'
	edit.setAttribute('class', 'primary-btn')
	edit.onclick = () => openModal('edit', city.id)

	//Remove button
	const remove = document.createElement('button')
	remove.title = 'Radera'
	remove.innerHTML = '<span class="material-icons">delete</span>'
	remove.setAttribute('class', 'primary-btn')
	remove.onclick = () => openModal('delete', city.id)

	//Elements added to wrapper
	actionsWrapper.append(edit, remove)

	//City card
	const card = document.createElement('div')
	card.setAttribute('class', 'card')
	card.append(infoWrapper, actionsWrapper)

	//Card is added to DOM
	citiesContainer.appendChild(card)
}
/**
 * Runs createCityCard() on all Objects in the results array
 * @param  {array} results
 */
renderCities = (results) => {
	citiesContainer.innerHTML = ''
	results.forEach((city) => createCityCard(city))
	console.info(`${getTime()} | All cities have been updated`)
}
/**
 * Adds a new city to the Avancera cities API
 * @param  {string} name
 * @param  {number} population
 */
addCity = async (name, population) => {
	const city = {
		name: name,
		population: parseInt(population)
	}
	const response = await fetch('https://avancera.app/cities/', {
		body: JSON.stringify(city),
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST'
	})
	console.info(`${getTime()} | %cPOST request%c for city %c${name}%c ended with status %c${response.status}`, 'color: green', '', 'color: brown', '', 'color: purple')
	const result = await response.json()
	return result
}
/**
 * Edits an existing city in the Avancera cities API
 * @param  {string} id
 */
editCity = async (id) => {
	const name = document.querySelectorAll('#edit-name')[0]
	const population = document.querySelectorAll('#edit-population')[0]
	const city = {
		id: id,
		name: name.value,
		population: parseInt(population.value)
	}
	const response = await fetch(`https://avancera.app/cities/${id}`, {
		body: JSON.stringify(city),
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'PATCH'
	})
	console.info(`${getTime()} | %cPATCH request%c for city %c${name.value}%c ended with status %c${response.status}`, 'color: green', '', 'color: brown', '', 'color: purple')
	_cities = await getCities()
	if (_cities) {
		console.info(`${getTime()} | Updating cities...`)
		renderCities(_cities)
	}
	closeModal()
}
/**
 * Deletes a city from the Avancera cities API
 * @param  {string} id
 */
deleteCity = async (id) => {
	const response = await fetch(`https://avancera.app/cities/${id}`, {
		method: 'DELETE'
	})
	console.info(`${getTime()} | %cDELETE request%c for city %c${id}%c ended with status %c${response.status}`, 'color: red', '', 'color: brown', '', 'color: purple')
	_cities = await getCities()
	if (_cities) {
		console.info(`${getTime()} | Updating cities...`)
		renderCities(_cities)
	}
	closeModal()
}
/**
 * Opens the modal in the DOM with content based in the type parameter
 * @param  {string} type
 * @param  {string} id
 */
openModal = async (type, id) => {
	const modal = document.querySelector('.modal')
	const title = document.querySelector('#modal-title')
	let modalContent
	switch (type) {
		case 'edit':
			title.textContent = 'Redigera Stad'
			modalContent = document.querySelectorAll('.edit-modal')

			const city = await getCity(id)

			const name = document.querySelectorAll('#edit-name')[0]
			name.value = `${city.name}`

			const population = document.querySelectorAll('#edit-population')[0]
			population.value = `${city.population}`

			errorCheck('edit')

			editBtn.onclick = () => editCity(id)
			break
		case 'delete':
			title.textContent = 'Radera Stad'
			modalContent = document.querySelectorAll('.delete-modal')
			deleteBtn.onclick = () => deleteCity(id)
			break
	}
	if (modalContent) {
		modalContent.forEach((e) => (e.hidden = false))
		modal.hidden = false
	}
}
/**
 * Closes the modal in the DOM
 */
closeModal = () => {
	const modal = document.querySelector('.modal')
	modal.hidden = true
	const modalContent = document.querySelectorAll('.edit-modal, .delete-modal')
	modalContent.forEach((element) => (element.hidden = true))
}
/**
 * Checks if a form is ready for submission based on the type parameter
 * @param  {string} type
 */
errorCheck = (type) => {
	let name, population, button
	switch (type) {
		case 'add':
			name = addFields[0]
			population = addFields[1]
			button = addBtn
			break
		case 'edit':
			name = editFields[0]
			population = editFields[1]
			button = editBtn
			break
	}
	const nameValid = name.value.length > 0
	const populationValid = population.value.toString().length > 0 && !isNaN(population.value)

	if (nameValid) {
		//Name field is valid
		name.classList.remove('invalid-input')
	} else {
		//Name field is not valid
		name.classList.add('invalid-input')
	}

	if (populationValid) {
		//Population field is valid
		population.classList.remove('invalid-input')
	} else {
		//Population field is not valid
		population.classList.add('invalid-input')
	}

	button.disabled = nameValid && populationValid ? false : true
}
/**
 * On submit listener for the 'add city' form
 * @param  {} e
 */
addForm.addEventListener('submit', async (e) => {
	e.preventDefault()
	const name = e.target['add-name'].value
	const population = e.target['add-population'].value
	const message = document.querySelector('#add-message')
	let cityExists = -1

	if (name && population) {
		cityExists = _cities.findIndex((c) => c.name === name)
		if (cityExists == -1) {
			message.textContent = `${name} lades till i databasen`
			message.setAttribute('class', 'success')
			_cities = await addCity(name, population)
		} else {
			message.textContent = `${name} finns redan i databasen`
			message.setAttribute('class', 'fail')
		}
	}
	if (_cities && cityExists == -1) {
		console.info(`${getTime()} | Updating cities...`)
		renderCities(_cities)
	}
})
