countryPopulationComparedChart = async (country) => {
	const config = {
		type: 'bar',
		data: await preparePopulationComparedData(country),
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: false
				}
			}
		}
	}
	const ctx = document.querySelector('#country-population-chart').getContext('2d')
	const populationComparedChart = new Chart(ctx, config)
}

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

