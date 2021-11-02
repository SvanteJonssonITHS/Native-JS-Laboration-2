const _form = document.querySelector("form"),
      _query = document.querySelector("input[type=text]"),
      _predictionList = document.querySelector('#predictions-wrapper'),
      _recentList = document.querySelector('.recent-list')

let _allCountries = [],
    _activePrediction = -1,
    _recentSearches = []

window.onload = async () => {
    _allCountries = prepareNameArray(await getAllCountryNames())
    _recentSearches = localStorage.getItem('recent')
    if(_recentSearches.length > 0) {
        JSON.parse(_recentSearches).forEach(country => {
            _recentList.append(createRecentSearchCard(country))
        });
    }
}

getAllCountryNames = async () => {
    const response = await fetch('https://restcountries.com/v2/all?fields=name,nativeName,altSpellings')
    return await response.json()
}

prepareNameArray = (countries) => {
    const arr = JSON.parse(localStorage.getItem('allcoutries')) || []
    if(arr.length == 0) {
        for (let i = 0; i < countries.length; i++) {
            const country = countries[i];
            if(country.name) arr.push({common: country.name, alt: country.name})
            if(country.nativeName && country.name != country.nativeName) arr.push({common: country.name, alt: country.nativeName})
            if(country.altSpellings.length && country.name != country.altSpellings[0] && country.nativeName != country.altSpellings[0]) arr.push({common: country.name, alt: country.altSpellings[0]})
        }
        localStorage.setItem('allcoutries', JSON.stringify(arr))
    }
    return arr
}

openPredictionList = (element) => {
    element.hidden = false
}

closePredictionList = (element) => {
    element.innerHTML = ''
    element.hidden = true
    _activePrediction = -1
}

createPrediction = (prediction, query) => {
    const element = document.createElement('div')
    element.setAttribute('class', 'prediction')
    element.innerHTML = "<strong>" + prediction.substr(0, query.length) + "</strong>"
    element.innerHTML += prediction.substr(query.length)
    element.innerHTML += "<input type='hidden' value='" + prediction + "'>"
    element.addEventListener('click', () => {
        _query.value = document.querySelector('.active-prediction>input').value
        searchCountry()
    })
    return element
}

changeActivePrediction = (direction) => {
    const predicitons = document.querySelectorAll('.prediction')
    for(let i = 0; i < predicitons.length; i++) {
        const prediciton = predicitons[i]
        if(prediciton.classList.contains('active-prediction')) {
            _activePrediction = i
            prediciton.classList.remove('active-prediction')
        }
    }
    switch (direction) {
        case 'up':
        _activePrediction--
        break;
        case 'down':
        _activePrediction++
        break;
    }
    if(_activePrediction < -1) {
        _activePrediction = -1
    } else if(_activePrediction >= predicitons.length) {
        _activePrediction = predicitons.length -1
    }

    if(_activePrediction != -1) {
        predicitons[_activePrediction].classList.add('active-prediction')
    }
}

_query.addEventListener('input', () => {
    const query = _query.value

    closePredictionList(_predictionList)

    if(!query) return false

    for(let i = 0; i < _allCountries.length; i++) {
        const prediciton = _allCountries[i].alt
        if(prediciton.substr(0, query.length).toLowerCase() == query.toLowerCase()) {
            _predictionList.appendChild(createPrediction(prediciton, query))
            if(_predictionList.children.length >= 10) break;
        }
    }

    openPredictionList(_predictionList)

})

_query.addEventListener('keydown', () => {
    switch (event.keyCode) {
        case 38:
            changeActivePrediction('up')
        break;
        case 40:
        changeActivePrediction('down')
        break;
        case 13:
        event.preventDefault()
        handleSubmit()
        break;
    }
})

document.addEventListener('click', function (e) {
    closePredictionList(_predictionList);
})

handleSubmit = () => {
    if (_activePrediction == -1) {
        searchCountry()
    } else {
        const prediciton = document.querySelector('.active-prediction')
        prediciton.click()
    }
}

searchCountry = async () => {
    let query = _query.value.toLowerCase()
    let name 
    for (let i = 0; i < _allCountries.length; i++) {
        const country = _allCountries[i];
        if(query == country.common.toLowerCase() || query == country.alt.toLowerCase()){
            name = country.common
            break
        }
    }
    if(!name) return false //TODO | add message about faulty query
    const country = {
        name: name,
        flag: await getCountryFlag(name)
    }
    console.log(country)
    let recent = []
    if(localStorage.getItem('recent')) {
        recent = JSON.parse(localStorage.getItem('recent'))
        let index = recent.findIndex((e) => e == name)
        recent.unshift(country)
        
        if(index != -1) {
            recent.splice(index+1, 1)
        }
        if(recent.length > 5) {
            recent.pop()
        }
    } else {
        recent = [country]
    }
    localStorage.setItem('recent', JSON.stringify(recent))
    window.location = `./country?name=${name.replaceAll(' ', '-')}`
}

getCountryFlag = async (name) => {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true&fields=flags`)
    const flag = await response.json()
    return flag[0].flags.png
createRecentSearchCard = (country) => {
    const li = document.createElement('li')

    const a = document.createElement('a')
    a.setAttribute('href', `./country?name=${country.name.replaceAll(' ', '-')}`)

    const article = document.createElement('article')
    article.setAttribute('class', 'recent-search')

    const div = document.createElement('div')
    div.setAttribute('class', 'img-wrapper')
    div.innerHTML = `<img src="${country.flag}" alt="${country.name}" width="100%">`

    const p = document.createElement('p')
    p.setAttribute('class', 'recent-search-name')
    p.textContent = country.name

    article.append(div, p)
    a.append(article)
    li.append(a)

    return li
}