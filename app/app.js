let _form = document.querySelector("form")
let _query = document.querySelector("input[type=text]")
let _allCountries = []
let _predictionList = document.querySelector('#predictions-wrapper')
let _activePrediction = -1

window.onload = async () => {
    validQuery()
    _allCountries = await getAllCountryNames()
    console.log(_allCountries)
}

_query.addEventListener('input', async () => {
    validQuery()
    if(_query.value){
        predictions = await getPredictions()
        console.log(predictions)
    }
})

_form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(query.value)
    //https://restcountries.com/v3.1/name/(name)
    let response = await fetch(`https://restcountries.com/v3.1/name/${_query.value}?fullText=true`)
    let result = await response.json()
    console.log(result)
})

validQuery = () => {
    submit.disabled = (!_query.value) ? true : false
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

_input.addEventListener('input', () => {
    let query = event.target.value
    let arr = ['sweden', 'somalia']

    closePredictionList(_list) //TODO | close the prediciton list

    if(!query) return false//Stop if no value is inputted

    document.querySelector('body').appendChild(_list) //TODO | change append selector

    for(let i = 0; i < arr.length; i++) {
        let prediciton = arr[i]
        if(prediciton.substr(0, query.length).toLowerCase() == query.toLowerCase()) {
            _list.appendChild(createPrediction(prediciton, query)) //TODO | add prediction to list of predictions
        }
    }

    openPredictionList(_list)

})

_input.addEventListener('keydown', () => {
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