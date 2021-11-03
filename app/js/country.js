const _query = sessionStorage.getItem('country')

let _country

window.onload = async () => {
    if(!_query) window.location = './index.html'
    _country = await getCountry(_query)
}

getCountry = async (name) => {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
    const country = await response.json()
    return country[0]
}
