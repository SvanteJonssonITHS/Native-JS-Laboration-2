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