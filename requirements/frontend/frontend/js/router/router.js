import '../views/profileView.js'
import '../views/homeView.js'
import '../views/settingsView.js'
import '../views/gameSettingsView.js'
import '../views/gameView.js'

import { eventHandlers } from '../utils/eventHandlers.js'
import { ROUTES } from '../constants/routes.js'
import { eventListeners } from '../utils/global.js'
import { searchService } from '../services/searchService.js'

//maybe i should make this a constructor.
const router = {
    init : () => 
    {
        // console.log('location pathname :', window.location.pathname)
        const anchors = document.querySelectorAll('.static')
        const path = window.location.pathname  === '/' ? '/home' : window.location.pathname
        const search = new searchService()
        
        eventListeners.setAllByType(anchors, 'click')
        eventListeners.on(window, 'popstate', eventHandlers.router.popstateHandler)
        search.init()

        router.navigateTo(path, false) // route to the view i want, normally it should be profile
    },
    navigateTo : (path, addTohistory=true) =>
    {
        if(addTohistory)
            history.pushState({path}, {}, path) // how does this work - -
       
        const customElement = path.includes('/profile') ? ROUTES.get('/profile') : ROUTES.get(path)
        const options = customElement === 'profile-view' ? ( path === '/profile' ? 'me' :  path.replace('/profile/', '')) : null
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