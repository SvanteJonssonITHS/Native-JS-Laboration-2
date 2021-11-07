/**
 * Creates a chart comparing countries population size
 * @param  {Object} country
 */
countryPopulationComparedChart = async (country) => {
	const config = {
		type: 'bar',
		data: await preparePopulationComparedData(country),
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: false
				},
				title: {
					display: true,
					text: `${country.continents[0]}'s largest populations`
				}
			}
		}
	}
	const ctx = document.querySelector('#country-population-chart').getContext('2d')
	const populationComparedChart = new Chart(ctx, config)
}

/**
 * Prepares the data object required for chart creation
 * @param  {Object} country
 */
preparePopulationComparedData = async (country) => {
	let data = {
		labels: [],
		datasets: [{ label: '', backgroundColor: [], data: [] }]
	}
	const countries = await getContinentTopPopulaitons(country.name.common, country.continents[0])
	countries.push({ name: country.name, population: country.population, continents: country.continents })
	countries.sort((a, b) => a.population - b.population)
	countries.forEach((c) => {
		data.labels.push(c.name.common)
		if (c.name.common == country.name.common) {
			data.datasets[0].backgroundColor.push('#aa2828')
			data.datasets[0].data.push(c.population)
		} else {
			data.datasets[0].backgroundColor.push('#567d46')
			data.datasets[0].data.push(c.population)
		}
	})
	return data
}

/**
 * Creates a chart comparing countries Gini index
 * @param  {Object} country
 */
countryGiniComparedChart = async (country) => {
	const config = {
		type: 'bar',
		data: await prepareCountryGiniComparedData(country),
		options: {
			responsive: true,
			indexAxis: 'y',
			plugins: {
				legend: {
					display: false
				},
				title: {
					display: true,
					text: `Gini index, ${country.name.common} and bordering countries vs. World average`
				},
				subtitle: {
					display: true,
					text: 'Lower is better'
				}
			},
			scales: {
				x: {
					min: 0,
					max: 100
				}
			}
		}
	}
	const ctx = document.querySelector('#country-gini-chart').getContext('2d')
	const giniComparedChart = new Chart(ctx, config)
}

/**
 * Prepares the data object required for chart creation
 * @param  {Object} country
 */
prepareCountryGiniComparedData = async (country) => {
	let data = {
		labels: [],
		datasets: [{ label: '', backgroundColor: [], data: [] }]
	}
	let countries = _borderingCountries ? _borderingCountries : []
	countries.unshift({ name: country.name, gini: country.gini })
	countries.push({ name: { common: 'World average' }, gini: { value: await getWorldGiniAverage() } })
	countries.forEach((c) => {
		data.labels.push(c.name.common)
		if (c.name.common == country.name.common) {
			data.datasets[0].backgroundColor.push('#aa2828')
			data.datasets[0].data.push(Object.values(c.gini)[0])
		} else if (c.name.common == 'World average') {
			data.datasets[0].backgroundColor.push('#3956c9')
			data.datasets[0].data.push(Object.values(c.gini)[0])
		} else {
			data.datasets[0].backgroundColor.push('#567d46')
			data.datasets[0].data.push(Object.values(c.gini)[0])
		}
	})
	return data
}
