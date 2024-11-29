import '../views/profileView.js'
import '../views/homeView.js'
import '../views/settingsView.js'
import '../views/gameSettingsView.js'
import '../views/gameView.js'

import { eventHandlers } from '../utils/eventHandlers.js'
import { ROUTES } from '../constants/routes.js'
import { eventListeners } from '../utils/global.js'

const router = {
    init : () => 
    {
        const anchors = document.querySelectorAll('.static')
        const searchInput = document.getElementById('search-input')
        const path = window.location.pathname

        eventListeners.setAllByType(anchors, 'click')
        eventListeners.on(window, 'popstate', eventHandlers.router.popstateHandler)
        eventListeners.on(searchInput, 'focus', eventHandlers.router.searchHandler)
      
        router.navigateTo(path, false) // route to the view i want, normally it should be profile
    },
    navigateTo : (path, addTohistory=true) =>
    {
        if(addTohistory)
            history.pushState({path}, {}, path)

        router.handleRoute(path)
    },
    handleRoute : (path) => 
    {
        //attention with the event listener
        const main = document.getElementById('main')
        const app = document.getElementById('app')

        let mainContent = document.createElement(ROUTES.get(path))
        mainContent.settings = 'hello'

        if (path === './game')
            app.replaceChildren(mainContent)
        else
            main.replaceChildren(mainContent)
    }
}

export default router