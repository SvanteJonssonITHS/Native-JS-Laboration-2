const _query = sessionStorage.getItem('country')

let _country

window.onload = async () => {
	if (!_query) window.location = './index.html'
	_country = await getCountry(_query)
	if (_country) createCountryOverview(_country)
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
	const flag = document.createElement('img')
	flag.setAttribute('src', country.flags.svg)
	flag.setAttribute('alt', `${country.name.common} flag`)
	const coa = document.createElement('img')
	coa.setAttribute('src', country.coatOfArms.svg)
	coa.setAttribute('alt', `${country.name.common} coat of arms`)
	symbols.append(flag, coa)
	identity.append(commonName, officialName, symbols)
	// Region section
	createMap(country.cca3, country.latlng[0], country.latlng[1])
}
