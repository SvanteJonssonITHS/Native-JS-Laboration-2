let form = document.querySelector("form")
let query = document.querySelector("input[type=text]")
let submit = document.querySelector("input[type=submit]")

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    //https://restcountries.com/v3.1/name/(name)
    let response = await fetch(`https://restcountries.com/v3.1/name/${query.value}?fullText=true`)
    let result = await response.json()
    console.log(result)
})
