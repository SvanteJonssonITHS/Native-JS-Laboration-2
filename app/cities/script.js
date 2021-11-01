let citiesContainer = document.querySelector('#cities-container')
let addForm = document.querySelector('#add-form')
let addFields = document.querySelectorAll('#add-form>input[id^=add-]')
let editForm = document.querySelector('#edit-form')
let editFields = document.querySelectorAll('#edit-form>input[id^=edit-]')
let _cities = []
let cancelBtns = document.querySelectorAll('.cancel-button')
let addBtn = document.querySelector('#add-form>input[type=submit]')
let editBtn = document.querySelector('.edit-modal>button')
let deleteBtn = document.querySelector('.delete-modal>button')

window.onload = async () => {
    errorCheck('add')
    //Inital GET
    _cities = await getCities()
    if (_cities) {
        console.info(`${getTime()} | Cities have been retrieved`)
        renderCities(_cities)
    }
    setInterval(async () => {
        let result = await getCities()
        if (JSON.stringify(_cities) != JSON.stringify(result)) {
            console.info(`${getTime()} | Updating cities...`)
            _cities = result
            renderCities(_cities)
        } else {
            console.info(`${getTime()} | No changes detected`)
        }
    }, 60000)

    addFields.forEach(field => field.oninput = () => errorCheck('add'))
    editFields.forEach(field => field.oninput = () => errorCheck('edit'))
    cancelBtns.forEach(btn => btn.onclick = () => closeModal())
}

getTime = () => {
    const d = new Date()
    let time = ''
    time += d.getHours().toString().length == 1 ? (0 + d.getHours().toString() + ':') : d.getHours() + ':'
    time += d.getMinutes().toString().length == 1 ? (0 + d.getMinutes().toString() + ':') : d.getMinutes() + ':'
    time += d.getSeconds().toString().length == 1 ? (0 + d.getSeconds().toString()) : d.getSeconds()
    return time
}

getCity = async (id) => {
    const response = await fetch(`https://avancera.app/cities/${id}`)
    console.info(`${getTime()} | %cGET request%c for city %c${id}%c ended with status %c${response.status}`, 'color: blue', '', 'color: brown', '', 'color: purple')
    const result = await response.json()
    return result
}

getCities = async () => {
    const response = await fetch('https://avancera.app/cities/')
    console.info(`${getTime()} | %cGET request%c for all cities ended with status %c${response.status}`, 'color: blue', '', 'color: purple')
    const result = await response.json()
    return result
}

renderCities = (results) => {
    citiesContainer.innerHTML = '';
    results.forEach(city => createCityCard(city))
    console.info(`${getTime()} | All cities have been updated`)
}

createCityCard = (city) => {
    //Info wrapper
    let infoWrapper = document.createElement('div')
    infoWrapper.setAttribute('class', 'info-wrapper')

    //City name
    let name = document.createElement('h3')
    name.title = city.name
    name.textContent = city.name

    //City population 
    let population = document.createElement('p')
    population.textContent = `Folkmängd: ${Intl.NumberFormat().format(city.population)}`

    //Elements added to wrapper
    infoWrapper.append(name, population)

    //Action wrapper
    let actionsWrapper = document.createElement('div')
    actionsWrapper.setAttribute('class', 'actions-wrapper')

    //Edit button
    let edit = document.createElement('button')
    edit.title = 'Redigera'
    edit.innerHTML = '<span class="material-icons">edit</span>'
    edit.setAttribute('class', 'primary-btn')
    edit.onclick = () => openModal('edit', city.id)

    //Remove button
    let remove = document.createElement('button')
    remove.title = 'Radera'
    remove.innerHTML = '<span class="material-icons">delete</span>'
    remove.setAttribute('class', 'primary-btn')
    remove.onclick = () => openModal('delete', city.id)

    //Elements added to wrapper
    actionsWrapper.append(edit, remove)

    //City card
    let card = document.createElement('div')
    card.setAttribute('class', 'card')
    card.append(infoWrapper, actionsWrapper)

    //Card is added to DOM
    citiesContainer.appendChild(card)
}

addCity = async (name, population) => {
    const city = {
        "name": name,
        "population": parseInt(population)
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

editCity = async (id) => {
    let name = document.querySelectorAll('#edit-name')[0]
    let population = document.querySelectorAll('#edit-population')[0]
    let city = {
        "id": id,
        "name": name.value,
        "population": parseInt(population.value)
    }
    let response = await fetch(`https://avancera.app/cities/${id}`, {
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

deleteCity = async (id) => {
    let response = await fetch(`https://avancera.app/cities/${id}`, {
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

addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let name = e.target['add-name'].value
    let population = e.target['add-population'].value
    let message = document.querySelector('#add-message')
    let cityExists = -1

    if (name && population) {
        cityExists =  _cities.findIndex(c => c.name === name)
        if (cityExists == -1){
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

openModal = async (type, id) => {
    let modal = document.querySelector('.modal')
    let title = document.querySelector('#modal-title')
    let modalContent
    switch (type) {
        case 'edit':
            title.textContent = 'Redigera Stad'
            modalContent = document.querySelectorAll('.edit-modal')

            let city = await getCity(id)

            let name = document.querySelectorAll('#edit-name')[0]
            name.value = `${city.name}`

            let population = document.querySelectorAll('#edit-population')[0]
            population.value = `${city.population}`

            errorCheck('edit')

            editBtn.onclick = () => editCity(id)
            break;
        case 'delete':
            title.textContent = 'Radera Stad'
            modalContent = document.querySelectorAll('.delete-modal')
            deleteBtn.onclick = () => deleteCity(id)
            break;
    }
    if (modalContent) {
        modalContent.forEach(e => e.hidden = false)
        modal.hidden = false
    }
}

closeModal = () => {
    let modal = document.querySelector('.modal')
    modal.hidden = true
    let modalContent = document.querySelectorAll('.edit-modal, .delete-modal')
    modalContent.forEach(element => element.hidden = true)
}

errorCheck = (type) => {
    let name, population, button
    switch (type) {
        case 'add':
            name = addFields[0]
            population = addFields[1]
            button = addBtn
        break;
        case 'edit':
            name = editFields[0]
            population = editFields[1]
            button = editBtn
        break;
    }
    let nameValid = (name.value.length > 0)
    let populationValid = (population.value.toString().length > 0 && !isNaN(population.value))

    if (nameValid) { //Name field is valid
        name.classList.remove('invalid-input')
    } else { //Name field is not valid
        name.classList.add('invalid-input')
    }

    if (populationValid) { //Population field is valid
        population.classList.remove('invalid-input')
    } else { //Population field is not valid
        population.classList.add('invalid-input')
    }

    button.disabled = (nameValid && populationValid) ? false : true
}