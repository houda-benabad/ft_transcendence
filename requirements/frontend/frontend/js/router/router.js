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
        // console.log( "path = ", path)
        history.pushState(null, null, path)

        this.updateContent(path)
    }
    updateContent(path) // to make this more clean and maintenable
    {
        let options 

        if (path.includes('/profile'))
        {
            const str = path.split('/')
            options = str[str.length - 1] === 'profile' ? 'me' : str[str.length - 1]
            path = '/profile'
        }
        const route = this._routes[path] || this._routes['/404']
        let fragment = document.createDocumentFragment()

        if (route.customElement)
        {
            fragment = document.createElement(route.customElement)
            if (options)
                fragment.userId = options

            document.querySelectorAll( '[data-action="router"]' ).forEach( ( item ) => item.classList.remove( 'selected' ))
            document.querySelector(`[data-action="router"],[href="${path}"]`).classList.add('selected')
        }
        else
        {
            const templateLitteral = route.template
            const template = document.createElement('template')

            template.innerHTML = templateLitteral
            fragment.appendChild(template.content)
        }

        const app = document.getElementById('app')
        const main = document.getElementById('main')
        const container = route.allScreen ? app : main

        container.replaceChildren(fragment)
    }
}
