let form = document.querySelector("form")
let query = document.querySelector("input[type=text]")
let submit = document.querySelector("input[type=submit]")

let _allCountries = []
let predictions = []

window.onload = async () => {
    validQuery()
    _allCountries = await getAllCountryNames()
    console.log(_allCountries)
}

query.addEventListener('input', async () => {
    validQuery()
    if(query.value){
        predictions = await getPredictions()
        console.log(predictions)
    }
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(query.value)
    //https://restcountries.com/v3.1/name/(name)
    let response = await fetch(`https://restcountries.com/v3.1/name/${query.value}?fullText=true`)
    let result = await response.json()
    console.log(result)
})

validQuery = () => {
    submit.disabled = (!query.value) ? true : false
}

getAllCountryNames = async () => {
    let response = await fetch('https://restcountries.com/v2/all?fields=name')
    return await response.json()
}