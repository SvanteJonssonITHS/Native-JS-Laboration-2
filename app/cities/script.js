let citiesContainer = document.querySelector('#cities-container')
let form = document.querySelector('form')
let cities = []
let cancelBtns = document.querySelectorAll('.cancel-button')

getCities = async () => {
    const response = await fetch('https://avancera.app/cities/')
    const result = await response.json()
    return result
}
getTime = () => {
    const d = new Date()
    let time = ''
    time += d.getHours().toString().length == 1 ? (0 + d.getHours().toString() + ':') : d.getHours() + ':'
    time += d.getMinutes().toString().length == 1 ? (0 + d.getMinutes().toString() + ':') : d.getMinutes() + ':'
    time += d.getSeconds().toString().length == 1 ? (0 + d.getSeconds().toString()) : d.getSeconds()
    return time
}

renderCities = (results) => {
    citiesContainer.innerHTML = '';
    results.forEach(city => createCityCard(city))
}

createCityCard = (city) => {
    //Info wrapper
    let infoWrapper = document.createElement('div')
    infoWrapper.setAttribute('class', 'info-wrapper')

    let name = document.createElement('h3')
    name.title = city.name
    name.textContent = city.name

    let population = document.createElement('p')
    population.textContent = `Folkmängd: ${Intl.NumberFormat().format(city.population)}`

    infoWrapper.append(name, population)

    //Action wrapper
    let actionsWrapper = document.createElement('div')
    actionsWrapper.setAttribute('class', 'actions-wrapper')

    let edit = document.createElement('button')
    edit.title = 'Redigera'
    edit.innerHTML = '<span class="material-icons">edit</span>'
    edit.onclick = () => openModal('edit', city.id) //TODO

    let remove = document.createElement('button')
    remove.title = 'Radera'
    remove.innerHTML = '<span class="material-icons">delete</span>'
    remove.onclick = () => openModal('delete', city.id) //TODO

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
    const result = await response.json()
    return result
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let name = e.target.name.value
    let population = e.target.population.value
    if (name && population) {
        let cityExists = cities.findIndex(c => c.name === name)
        if (cityExists == -1) cities = await addCity(name, population)
    }
    if (cities) renderCities(cities)
})

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
    let cities = await getCities()
    if(cities) {
        console.info(`${getTime()} | Updating cities...`)
        renderCities(cities)
    }
    closeModal()
}

deleteCity = async (id) => {
    let response = await fetch(`https://avancera.app/cities/${id}`, {method: 'DELETE'})
    console.info(`${getTime()} | %cDELETE request%c for city %c${id}%c ended with status %c${response.status}`, 'color: red', '', 'color: brown', '', 'color: purple')
    let cities = await getCities()
    if(cities) {
        console.info(`${getTime()} | Updating cities...`)
        renderCities(cities)
    }
    closeModal()
}

openModal = (type, city) => {
    let modal = document.querySelector('.modal')
    let title = document.querySelector('#modal-title')
    let modalContent
    switch (type) {
        case 'edit':
            console.log('edit', city)
            title.textContent = 'Redigera Stad'
            modalContent = document.querySelectorAll('.edit-modal')
        break;
        case 'delete':
            console.log('delete', city)
            title.textContent = 'Radera Stad'
            modalContent = document.querySelectorAll('.delete-modal')
            console.log(modalContent)
        break;
    }

    if(modalContent) {
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