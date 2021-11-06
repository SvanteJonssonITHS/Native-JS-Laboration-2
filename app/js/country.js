/*
API endpoints with usefull data
https://restcountries.com/v3.1/name/{ name }                            | Short info to put in a table 
https://restcountries.com/v3.1/alpha?codes={ code },{ code },{ code }   | Can be used to find bordering countries and their capital
https://api.teleport.org/api/urban_areas/slug:{ city }/details/         | A lot of information that can be displayed in a chart or similar
https://api.teleport.org/api/urban_areas/slug:{ city }/scores/          | One field has a short summary of the city. Could be interesting to show
*/

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
	summaryText.innerHTML = Object.values(await generateSummary(country, borderingCountries)).join(' ')
	summary.append(summaryTitle, summaryText)
}

generateSummary = async (country, borderingCountries) => {
	let summary = {}

	// Location sentence
	if (country.name.common && country.continents[0].length > 0) {
		summary.location = `${country.name.common} is a country located in ${country.continents[0]}`
		if (country.borders && country.borders.length > 0) {
			summary.location += ` and shares borders with `
			const borders = borderingCountries.map(({ name }) => name.common)
			if (borders.length > 3) {
				summary.location += `${borders[0]}, ${borders[1]} and ${borders[2]} among others.`
			} else if (borders.length == 3) {
				summary.location += `${borders[0]}, ${borders[1]} and ${borders[2]}.`
			} else if (borders.length == 2) {
				summary.location += `${borders[0]} and ${borders[1]}.`
			} else {
				summary.location += `${borders[0]}.`
			}
		} else {
			summary.location += '.'
		}
	}

	// Capital sentence
	if (country.capital && country.capital[0].length > 0) {
		summary.capital = `Its capital, ${country.capital[0]}`
		if (country.capitalInfo.latlng && country.capitalInfo.latlng.length > 0) {
			summary.capital += `, is located at the coordinates ${country.capitalInfo.latlng[0]}&#176;N,  ${country.capitalInfo.latlng[1]}&#176;E.`
		} else {
			summary.capital += '.'
		}
	}

	// Size sentence
	if (country.name.common && country.population) {
		summary.size = `The total population of ${country.name.common} is currently ${Intl.NumberFormat().format(country.population)}`
		if (country.area) {
			summary.size += `, and it has a total land area of ${Intl.NumberFormat().format(country.area)} km&#178;.`
		} else {
			summary.size += '.'
		}
	}

	// Economy sentence
	if (country.gini) {
		const giniWorldAverage = await getWorldGiniAverage()
		let aboveWorldAverage
		switch (country.gini > giniWorldAverage) {
			case true:
				aboveWorldAverage = 'above'
				break
			case false:
				aboveWorldAverage = 'below'
				break
		}
		summary.economy = `The country's distribution of income among its citizens(Gini index, lower is better) is ${Object.values(country.gini)[0]} and is ${aboveWorldAverage} the world average of ${giniWorldAverage}.`
	}

	// Traffic sentence
	if (country.car.side) {
		summary.traffic = `They drive on the ${country.car.side} side of the road`
		if (country.car.signs && country.car.signs.length > 0) {
			summary.traffic += ` with license plates starting with `
			for (let i = 0; i < country.car.signs.length; i++) {
				summary.traffic += `${country.car.signs[i]}, `
			}
			summary.traffic += `${summary.traffic.slice(0, -2)}.`
		} else {
			summary.traffic += '.'
		}
	}

	// Calendar sentence
	if (country.startOfWeek) summary.calendar = `Its calendar week starts on ${country.startOfWeek}s.`

	return summary
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
