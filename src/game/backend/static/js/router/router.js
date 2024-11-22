import '../views/profileView.js'
import '../views/homeView.js'
import '../views/settingsView.js'
import '../views/gameView.js'
import '../views/localView.js'

import { eventHandlers } from '../utils/eventHandlers.js'
import { ROUTES } from '../constants/routes.js'

const router = {
    init : () => 
    {
        const anchors = document.querySelectorAll('.static')

        eventListeners.setAllByType(anchors, 'click')
        eventListeners.on(window, 'popstate', () => eventHandlers.router.popstateHandler)
      
        router.go('./home', false) // route to the view i want, normally it should be profile
    },
    go : (path, addTohistory=true) => {

        const main = document.getElementById('main')
        const app = document.getElementById('app')

        if(addTohistory)
            history.pushState({path}, {}, path)

        let mainContent = document.createElement(ROUTES.get(path))
        if (path === './game/local')
            app.replaceChildren(mainContent)
        else
            main.replaceChildren(mainContent)
    }
}

export default router