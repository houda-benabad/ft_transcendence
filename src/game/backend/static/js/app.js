import {loadPage} from './services/tools.js'
import {waitForFormSubmit} from './services/tools.js'
import {eventListener} from './services/tools.js'
import {delay} from './services/tools.js'
import {init} from './services/tools.js'
import router from './services/router.js'

async function addWebsiteLayout() {
    const response = await fetch('websiteLayout')
    const responseText = await response.text()
    const app = document.getElementById('app')

    app.classList.add('active')
    app.innerHTML = `${responseText}`
}

window.addEventListener('DOMContentLoaded', async () => 
{
    let path = '/signin'
    await init(path)
    // await delay(1500)
    // await addWebsiteLayout()
    // router.init()
})
