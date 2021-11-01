let _form = document.querySelector("form")
let _query = document.querySelector("input[type=text]")
let _allCountries = []
let _predictionList = document.querySelector('#predictions-wrapper')
let _activePrediction = -1

window.onload = async () => {
    _allCountries = await getAllCountryNames()
}

getAllCountryNames = async () => {
    let response = await fetch('https://restcountries.com/v2/all?fields=name')
    return await response.json()
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
    let element = document.createElement('div')
    element.setAttribute('class', 'prediction')
    element.innerHTML = "<strong>" + prediction.substr(0, query.length) + "</strong>"
    element.innerHTML += prediction.substr(query.length)
    element.innerHTML += "<input type='hidden' value='" + prediction + "'>"
    element.addEventListener('click', () => {
        _input.value = document.querySelector('.active-prediction>input').value
        //TODO | kör den riktiga submitten
    })
    return element
}

changeActivePrediction = (direction) => {
    let predicitons = document.querySelectorAll('.prediction')

    for(let i = 0; i < predicitons.length; i++) {
        let prediciton = predicitons[i]
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
    let query = _query.value

    closePredictionList(_predictionList)

    if(!query) return false

    for(let i = 0; i < _allCountries.length; i++) {
        let prediciton = _allCountries[i]
        if(prediciton.name.substr(0, query.length).toLowerCase() == query.toLowerCase()) {
            _predictionList.appendChild(createPrediction(prediciton.name, query))
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
        return false //TODO | kör den riktiga submitten
    }
    let prediciton = document.querySelector('.active-prediction')
    prediciton.click()
}