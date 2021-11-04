createTable = (country) => {
	const table = new Tabulator('#table', {
		data: prepareTableData(country),
		columns: [{ field: 'label' }, { field: 'value', hozAlign: 'right' }],
		headerVisible: false,
		layout: 'fitDataStretch'
	})
}

prepareTableData = (country) => {
	const data = []
	if (country.region) data.push({ label: 'Continent', value: country.continents[0] })
	if (country.area && country.area > 0) data.push({ label: 'Land', value: `${Intl.NumberFormat().format(country.area)} km²` }) // Add landlocked later
	if (country.capital[0]) data.push({ label: 'Capital', value: country.capital[0] })
	if (country.languages) data.push({ label: 'Languages', value: Object.values(country.languages).join(', ') })
	if (country.demonyms) data.push({ label: 'Denonyms', value: country.demonyms.eng.m == country.demonyms.eng.f ? country.demonyms.eng.m : `${country.demonyms.eng.m}, ${country.demonyms.eng.f}` }) // add male and female seperators later
	if (country.gini) data.push({ label: 'Gini', value: Object.values(country.gini) }) // Only show the latest
	if (country.currencies) data.push({ label: 'Currency', value: `${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol})` }) //fix
	if (country.startOfWeek) data.push({ label: 'Start of week', value: country.startOfWeek })
	if (country.car) data.push({ label: 'Drives on the', value: country.car.side }) // add license plate letter(s)
	if (country.car.signs && country.car.signs[0].length > 0) data.push({ label: 'License plate', value: country.car.signs[0] })
	if (country.cca3) data.push({ label: 'CCA3', value: country.cca3 })
	if (country.tld) data.push({ label: 'Top domain', value: country.tld.join(' ') })
	if (country.idd) data.push({ label: 'International Prefix', value: country.idd.suffixes.length > 1 ? country.idd.root : country.idd.root + country.idd.suffixes[0] })

	return data
}
