import { ROUTES } from '../constants/routes.js'
import { _tokenService } from '../utils/global.js'
import { reset } from '../utils/utils.js'

import '../views/homeView.js'
import '../views/profileView.js'
import '../views/gameSettingsView.js'
import '../views/settingsView.js'
import '../views/gameView.js'

export class Router 
{
    constructor()
    {
        this._routes = ROUTES

        this.init()
    }
   
    async init() // this needs cleansing and to make it more maintenable
    {
        
        if (_tokenService.isAuthenticated())
        {
            await reset()
            document.querySelectorAll( '[data-action="router"]' ).forEach( ( item ) => item.classList.remove( 'selected' ) )
            
            const element = document.querySelector(`[href="${window.location.pathname}"]`)
            
            if (element)
                element.classList.add('selected')
        }
        window.addEventListener('popstate', this.handleRoute())
    }
    handleRoute(newPath=null)
    {
        const path = newPath || window.location.pathname

        if (!_tokenService.isAuthenticated() && (path !== '/signup' || path !== '/signup'))
            this.navigateTo('/signin')
        else if (_tokenService.isAuthenticated() && (path === '/signin' || path === '/signup'))
            this.navigateTo('/')
        else
            this.navigateTo(path)
    }
    navigateTo(path)
    {
        const route = this._routes[path] || this._routes['/404']

        history.pushState(null, null, path)
        this.updateContent(route)
    }
    updateContent(route)
    {
        let fragment = document.createDocumentFragment()
        const app = document.getElementById('app')
        const main = document.getElementById('main')

        if (route.customElement)
            fragment = document.createElement(route.customElement)
        else
        {
            const templateLitteral = route.template
            const template = document.createElement('template')

            template.innerHTML = templateLitteral
            fragment.appendChild(template.content)
        }
        const container = route.allScreen ? app : main
        container.replaceChildren(fragment)
    }
}
