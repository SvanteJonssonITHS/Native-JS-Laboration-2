const _query = sessionStorage.getItem('country')

let _country
let _borderingCountries

window.onload = async () => {
	if (!_query) window.location = './index.html'
	_country = await getCountry(_query)
	if (_country) {
		createCountryOverview(_country)
		if (_country.borders) _borderingCountries = await getBorderingCountries(_country.borders)
		if (_borderingCountries) createMainContent(_country, _borderingCountries)
	}
}

getCountry = async (name) => {
	const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
	const country = await response.json()
	return country[0]
}

createCountryOverview = (country) => {
	// Country identity section
	const identity = document.querySelector('.country-identity')
	const commonName = document.createElement('h2')
	commonName.textContent = country.name.common
	const officialName = document.createElement('h3')
	officialName.textContent = country.name.official
	const symbols = document.createElement('div')
	symbols.setAttribute('class', 'national-symbols-wrapper')
	const flagWrapper = document.createElement('div')
	flagWrapper.innerHTML = `<img src="${country.flags.svg}" alt="${country.name.common} flag" height="100%">`
	const coaWrapper = document.createElement('div')
	coaWrapper.innerHTML = `<img src="${country.coatOfArms.svg}" alt="${country.name.common} coat of arms" height="100%">`
	symbols.append(flagWrapper, coaWrapper)
	identity.append(commonName, officialName, symbols)
	// Region section
	createMap(country.cca3, country.latlng[0], country.latlng[1])
	// Info section
	createTable(country)
}

createMainContent = async (country, borderingCountries) => {
	// Capital summary section
	const summary = document.querySelector('.capital-summary')
	const summaryTitle = document.createElement('h2')
	summaryTitle.textContent = 'Summary'
	const summaryText = document.createElement('p')
	summary.append(summaryTitle, summaryText)
}

getBorderingCountries = async (codes) => {
	const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}&fields=name,gini`)
	const countries = await response.json()
	return countries
}

getWorldGiniAverage = async () => {
	const response = await fetch(`https://restcountries.com/v3.1/all?fields=gini`)
	const result = await response.json()
	const countriesWithGini = result.filter((country) => Object.values(country.gini)[0])
	const average = countriesWithGini.reduce((total, country) => total + Object.values(country.gini)[0], 0) / countriesWithGini.length
	return Math.round((average + Number.EPSILON) * 100) / 100
}
