let citiesContainer = document.querySelector('#cities-container')

getCities = async () => {
    const response = await fetch('https://avancera.app/cities/')
    const result = await response.json()
    return result
}
}

renderCities = (cities) => {
    cities.forEach(city => createCityCard(city))
}

createCityCard = (city) => {
    //Info wrapper
    let infoWrapper = document.createElement('div')
    infoWrapper.setAttribute('class', 'info-wrapper')

    let name = document.createElement('h3')
    name.title = city.name
    name.textContent = city.name

    let population = document.createElement('p')
    population.textContent = `Folkmängd: ${city.population}`

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