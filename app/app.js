let form = document.querySelector("form")
let query = document.querySelector("input[type=text]")
let submit = document.querySelector("input[type=submit]")

let predictions = []

window.onload = () => {
    validQuery()
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

getPredictions = async () => {
    let response = await fetch(`https://restcountries.com/v3.1/name/${query.value}`)
    let result = await response.json()
    let names = []
    let amount = result.length > 10 ? 10 : result.length
    for (let i = 0; i < amount; i++) {
        names.push(result[i].name.common)
    }
    return names
}