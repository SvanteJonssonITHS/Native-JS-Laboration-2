const _query = sessionStorage.getItem('country')

window.onload = () => {
    if(!_query) window.location = './index.html'
}

