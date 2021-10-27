let citiesContainer = document.querySelector('#cities-container')
let form = document.querySelector('form')
let cities = []

getCities = async () => {
    const response = await fetch('https://avancera.app/cities/')
    const result = await response.json()
    return result
}
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
    edit.onclick = `editCity(${city.id})` //TODO

    let remove = document.createElement('button')
    remove.title = 'Radera'
    remove.innerHTML = '<span class="material-icons">delete</span>'
    remove.onclick = `removeCity(${city.id})` //TODO

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

editCity = () => {
    //TODO
}

deleteCity = () => {
    //TODO
}