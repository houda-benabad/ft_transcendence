import '../views/profileView.js'
import '../views/homeView.js'
import '../views/settingsView.js'
import '../views/gameSettingsView.js'
import '../views/gameView.js'

import { eventHandlers } from '../utils/eventHandlers.js'
import { ROUTES } from '../constants/routes.js'
import { eventListeners, search } from '../utils/global.js'

const router = {
    init : () => 
    {
        const anchors = document.querySelectorAll('.static')
        const path = window.location.pathname  === '/' ? './home' : window.location.pathname

        eventListeners.setAllByType(anchors, 'click')
        eventListeners.on(window, 'popstate', eventHandlers.router.popstateHandler)
        search.init()

        router.navigateTo(path, false) // route to the view i want, normally it should be profile
    },
    navigateTo : (path, addTohistory=true) =>
    {
        if(addTohistory)
            history.pushState({path}, {}, path)
       
        const customElement = path.includes('./profile') ? ROUTES.get('./profile') : ROUTES.get(path)
        const options = customElement === 'profile-view' ? ( path === './profile' ? 'me' :  path.replace('./profile/', '')) : null

        router.handleRoute(customElement, options)
    },
    handleRoute : (customElement, options) => 
    {
        const main = document.getElementById('main')
        const app = document.getElementById('app')

        let mainContent = document.createElement(customElement)

        if (options)
            mainContent.userId = options
        const targetContainer = customElement === 'game-view' ? app : main

        targetContainer.replaceChildren(mainContent)
        
    }
}

export default router