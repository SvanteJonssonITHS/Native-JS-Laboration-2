const _form = document.querySelector('form'),
	_query = document.querySelector('input[type=text]'),
	_predictionList = document.querySelector('#predictions-wrapper'),
	_recentWrapper = document.querySelector('.recent-wrapper'),
	_recentList = document.querySelector('.recent-list')

let _allCountries = [],
	_activePrediction = -1

window.onload = async () => {
	_allCountries = prepareNameArray(await getAllCountryNames())
	showRecentSearches(localStorage.getItem('recent'))
}

/**
 * Retrieves all country names from the API
 */
getAllCountryNames = async () => {
	const response = await fetch('https://restcountries.com/v3.1/all?fields=name,altSpellings')
	return await response.json()
}

/**
 * Prepares the wanted names for the prediction list, saves them in local storage to improve performance
 * @param  {Object} countries
 */
prepareNameArray = (countries) => {
	let allcoutries = JSON.parse(localStorage.getItem('allcoutries')) || []
	if (allcoutries.length == 0) {
		for (let i = 0; i < countries.length; i++) {
			let countrySpellings = []
			const country = countries[i]
			if (!country.name || country.name.length < 1) continue
			countrySpellings.push({ common: country.name.common, alt: country.name.common })
			for (const lang in country.name.nativeName) {
				countrySpellings.push({ common: country.name.common, alt: country.name.nativeName[lang].common })
			}

			if (country.altSpellings) {
				country.altSpellings.forEach((spelling) => {
					if (spelling.length < 4) {
						countrySpellings.push({ common: country.name.common, alt: spelling })
					}
				})
			}

			countrySpellings = countrySpellings.filter((instance, index, array) => index === array.findIndex((i) => instance.alt === i.alt))

			allcoutries = allcoutries.concat(countrySpellings)
		}
		localStorage.setItem('allcoutries', JSON.stringify(allcoutries))
	}
	return allcoutries
}

/**
 * Changes the display rule for the predictions container to block
 * @param  {Element} element
 */
openPredictionList = (element) => {
	element.style.display = 'block'
	_query.classList.add('search-bar-predictions')
}

/**
 * CHanges the display rule for the predictions container to none and clears it
 * @param  {Element} element
 */
closePredictionList = (element) => {
	element.innerHTML = ''
	element.style.display = 'none'
	_query.classList.remove('search-bar-predictions')
	_activePrediction = -1
}

/**
 * Creates a DOM element containing a prediction
 * @param  {string} prediction
 * @param  {string} query
 */
createPrediction = (prediction, query) => {
	const element = document.createElement('div')
	element.setAttribute('class', 'prediction')
	element.innerHTML = '<strong>' + prediction.substr(0, query.length) + '</strong>'
	element.innerHTML += prediction.substr(query.length)
	element.innerHTML += "<input type='hidden' value='" + prediction + "'>"
	element.addEventListener('click', () => {
		event.stopPropagation()
		_query.value = event.target.children[1].value
		searchCountry()
	})
	return element
}

/**
 * Changes the active prediction by one, either 'up' or 'down', depending on the parameter direction
 * @param  {string} direction
 */
changeActivePrediction = (direction) => {
	const predicitons = document.querySelectorAll('.prediction')
	for (let i = 0; i < predicitons.length; i++) {
		const prediciton = predicitons[i]
		if (prediciton.classList.contains('active-prediction')) {
			_activePrediction = i
			prediciton.classList.remove('active-prediction')
		}
	}
	switch (direction) {
		case 'up':
			_activePrediction--
			break
		case 'down':
			_activePrediction++
			break
	}
	if (_activePrediction < -1) {
		_activePrediction = -1
	} else if (_activePrediction >= predicitons.length) {
		_activePrediction = predicitons.length - 1
	}

	if (_activePrediction != -1) {
		predicitons[_activePrediction].classList.add('active-prediction')
	}
}

_query.addEventListener('input', () => {
	const query = _query.value

	closePredictionList(_predictionList)

	if (!query) return false

	for (let i = 0; i < _allCountries.length; i++) {
		const prediciton = _allCountries[i].alt
		if (prediciton.substr(0, query.length).toLowerCase() == query.toLowerCase()) {
			_predictionList.appendChild(createPrediction(prediciton, query))
			if (_predictionList.children.length >= 10) break
		}
	}

	if (_predictionList.children.length > 0) openPredictionList(_predictionList)
})

_query.addEventListener('keydown', () => {
	switch (event.keyCode) {
		case 38:
			changeActivePrediction('up')
			break
		case 40:
			changeActivePrediction('down')
			break
		case 13:
			event.preventDefault()
			handleSubmit()
			break
	}
})

document.addEventListener('mousedown', function () {
	if (!window.event.target.classList.contains('search-bar') && !window.event.target.classList.contains('prediction')) {
		closePredictionList(_predictionList)
	}
})

/**
 * Performs the submit event in different orders depending on the _activePrediction variable
 */
handleSubmit = () => {
	if (_activePrediction == -1) {
		searchCountry()
	} else {
		const prediciton = document.querySelector('.active-prediction')
		prediciton.click()
	}
}

/**
 * Compares saved countries to user query, if a match is found the query is saved in local storage and the user is redirected
 */
searchCountry = async () => {
	let query = _query.value.toLowerCase()
	let name
	for (let i = 0; i < _allCountries.length; i++) {
		const country = _allCountries[i]
		if (query == country.common.toLowerCase() || query == country.alt.toLowerCase()) {
			name = country.common
			break
		}
	}
	if (!name) {
		_query.style.animation = 'shake .5s linear'
		setTimeout(() => {
			_query.style.animation = ''
		}, 500)
		return false
	}
	const country = {
		name: name,
		flag: await getCountryFlag(name)
	}
	let recent = []
	if (localStorage.getItem('recent')) {
		recent = JSON.parse(localStorage.getItem('recent'))
		let index = recent.findIndex((e) => e.name == name)
		recent.unshift(country)

		if (index != -1) {
			recent.splice(index + 1, 1)
		}
		if (recent.length > 5) {
			recent.pop()
		}
	} else {
		recent = [country]
	}
	await localStorage.setItem('recent', JSON.stringify(recent))
	saveAndRedirect(name)
}

/**
 * saves parameter country to session storage and redirects user to country.html
 * @param  {string} country
 */
saveAndRedirect = (country) => {
	sessionStorage.setItem('country', country)
	window.location = `./country.html`
}

/**
 * Retrieves one countries flag from the API
 * @param  {string} name
 */
getCountryFlag = async (name) => {
	const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fields=flags`)
	const flag = await response.json()
	return flag[0].flags.svg
}

/**
 * Creates a DOM element containing for displaying the parameter object
 * @param  {Object} country
 */
createRecentSearchCard = (country) => {
	const li = document.createElement('li')

	const container = document.createElement('div')
	container.onclick = () => saveAndRedirect(country.name)
	container.setAttribute('title', country.name)

	const article = document.createElement('article')
	article.setAttribute('class', 'recent-search')

	const div = document.createElement('div')
	div.setAttribute('class', 'img-wrapper')
	div.innerHTML = `<img src="${country.flag}" alt="${country.name}" width="100%">`

	const p = document.createElement('p')
	p.setAttribute('class', 'recent-search-name')
	p.textContent = country.name

	article.append(div, p)
	container.append(article)
	li.append(container)

	return li
}

/**
 * Creates and displays recent searches in the DOM if there is any saved in local storage
 * @param  {array} recentSearches
 */
showRecentSearches = (recentSearches) => {
	if (recentSearches && recentSearches.length > 0) {
		_recentWrapper.style.display = 'block'
		JSON.parse(recentSearches).forEach((country) => {
			_recentList.append(createRecentSearchCard(country))
		})
	} else {
		_recentWrapper.style.display = 'none'
	}
}
