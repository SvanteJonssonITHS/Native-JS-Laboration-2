let citiesContainer = document.querySelector('#cities-container')
let addForm = document.querySelector('#add-form')
let editForm = document.querySelector('#edit-form')
let _cities = []
let cancelBtns = document.querySelectorAll('.cancel-button')

getCities = async () => {
    const response = await fetch('https://avancera.app/cities/')
    const result = await response.json()
    return result
}

getCity = async (id) => {
    const response = await fetch(`https://avancera.app/cities/${id}`)
    console.info(`${getTime()} | %cGET request%c for city %c${id}%c ended with status %c${response.status}`, 'color: blue', '', 'color: brown', '', 'color: purple')
    const result = await response.json()
    return result
}

window.onload = async () => {
    //Inital GET
    let _cities = await getCities()
    if(_cities) {
        console.info(`${getTime()} | Cities have been retrieved`)
        renderCities(_cities)
    }

    setInterval( async () => {
        let result = await getCities()
        if(JSON.stringify(_cities) != JSON.stringify(result)) {
            console.info(`${getTime()} | Updating cities...`)
            _cities = result
            renderCities(_cities)
        }
    }, 60000) //Check once every minute if   
    
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

addForm.addEventListener('submit', async (e) => { //TODO, onchange på input fälten så att knappen blir disabled, lägg även till felmeddelande
    e.preventDefault();
    let name = e.target.name.value
    let population = e.target.population.value
    if (name && population) {
        let cityExists = _cities.findIndex(c => c.name === name)
        if (cityExists == -1) _cities = await addCity(name, population)
    }
    if (_cities){
        console.info(`${getTime()} | Updating cities...`)
        renderCities(_cities)
    } 
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