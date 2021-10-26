getCities = async () => {
    const response = await fetch('https://avancera.app/cities/')
    const result = await response.json()
    console.log(result)
}

