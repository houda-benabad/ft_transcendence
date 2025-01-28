import { databaseExtractorService } from "../services/databaseExtractorService.js"
import { ROUTES } from '../constants/routes.js'

import '../views/homeView.js'
import '../views/profileView.js'
import '../views/gameSettingsView.js'
import '../views/settingsView.js'
import '../views/gameView.js'

export class Router 
{
    constructor(global)
    {
        this._apiService = global._apiService
        this._tokenService = global._tokenService
        this._reset = global._reset
        this._routes = ROUTES(this._apiService)
        
        this.init()
    }
   
    async init() // this needs cleansing and to make it more maintenable
    {
        if (this._tokenService.isAuthenticated())
        {
            await this._reset()
            document.querySelectorAll( '[data-action="router"]' ).forEach( ( item ) => item.classList.remove( 'selected' ) )
            
            const element = document.querySelector(`[href="${window.location.pathname}"]`)
            
            if (element)
                element.classList.add('selected')
        }
        window.addEventListener('popstate', () => this.handleRoute())
        this.handleRoute()
    }
    async handleRoute(newPath=null)
    {
        // console.log('im heree')
        const path = newPath || window.location.pathname
        const query = window.location.search

        if (query) // this should nt stay in here - -
        {
            const params = new URLSearchParams(query)
            const code = params.get('code')

            const response = await this._apiService.auth.intraCallback({code : code}) // im getting a 500 error what could be the reason
            this._tokenService.tokens = response
            await this._reset()
        }
        if (!this._tokenService.isAuthenticated() && (path !== '/signup' || path !== '/signup'))
            this.navigateTo('/signin')
        else if (this._tokenService.isAuthenticated() && (path === '/signin' || path === '/signup'))
            this.navigateTo('/')
        else if (path === '/game')
            this.navigateTo('/')
        else
            this.navigateTo(path)
    }
    navigateTo(path)
    {
        let options = null

        history.pushState(null, null, path)

        if (path.includes('/profile'))
        {
            if (path === '/profile' || path.includes('/profile/'))
            {
                const str = path.split('/')
                options = str[str.length - 1] === 'profile' ? 'me' : str[str.length - 1]
                path = '/profile'
            }
            else 
                path = '/404'
        }
        this.updateContent(path, options)
    }
    async updateContent(path, options) // to make this more clean and maintenable
    {
        let fragment = document.createDocumentFragment()
        const route = this._routes[path] || this._routes['/404']
        if (route.customElement)
        {
            fragment = document.createElement(route.customElement)
            if (route.api)
                fragment.database = await this.fetchDataForCtmEl(options, route.api)
            if (options)
                fragment.userId = options
            document.querySelectorAll( '[data-action="router"]' ).forEach( ( item ) => item.classList.remove( 'selected' ))
            // console.log('->>>>>>>>> here in router : ', document.querySelector(`[data-action="router"][href="${path}"]`))
            document.querySelector(`[data-action="router"][href="${path}"]`).classList.add('selected')
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
    async fetchDataForCtmEl(options, api)
    {
        const response = await api(options)

        if (response === 'not found')
            return this.handleRoute('/404')
        return new databaseExtractorService(response)
    }
}
