import {loadPage} from './services/tools.js'
import {waitForFormSubmit} from './services/tools.js'
import router from './services/router.js'

async function init()
{
    let path = window.location.pathname
    while (path != '/home')
    {
        await loadPage(path)
        path = await waitForFormSubmit()
    }
}

async function addWebsiteLayout() {
    const response = await fetch('/signup')
    const responseText = await response.text()
    const app = document.getElementById('app')

    app.classList.add('active')
    app.innerHTML = `${responseText}`
}
window.addEventListener('DOMContentLoaded', async () => 
{
    // await init()
    await addWebsiteLayout()
    router.init()
})
