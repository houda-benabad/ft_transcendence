import {getIsItOutOfGame, setIsItOutOfGame, onlineStatusService, tokenService } from "../managers/globalManager.js"
import { databaseExtractorService } from "../services/databaseExtractorService.js"
import { write , delay} from "../utils/utils.js"
import { ROUTES } from '../constants/routes.js'
import { eventListeners } from "../managers/globalManager.js"

import '../views/homeView.js'
import '../views/profileView.js'
import '../views/gameSettingsView.js'
import '../views/settingsView.js'

export class Router 
{
    constructor(global)
    {
        this._apiService = global._apiService
        this._reset = global._reset
        this._routes = ROUTES(this._apiService)

        this._route = null
        this.init()
    }
   
    async init()
    {
        await tokenService.init()
        if (tokenService.isAuthenticated())
        {
            onlineStatusService.init()
            await this.initBasicRoutes()
        }
        window.addEventListener('popstate', (event) => this.handleRoute(event.state ? event.state.path : null, false))
        this.handleRoute(null, false)
    }
    async handleRoute(newPath=null, addToHistory = true)
    {

        // console.log('history : ', addToHistory)
        // console.log('path : ', newPath)
        // console.log('route : ', this._route)
        const path = newPath || (window.location.pathname !== '/game-settings' ? window.location.pathname : '/')
        const query = path === '/' ? window.location.search :  null
        
        if (this._route === '/game' && path === '/game-settings')
            return setIsItOutOfGame(true)
        if (document.getElementById('welcome-text') && document.getElementById('welcome-text').innerHTML.length)
            this.removeWelcomeText()
        if (query)
            await this.handleIntraRoute(query)
        if (!tokenService.isAuthenticated() && (path !== '/signup' || path !== '/signup'))
            this.navigateTo('/signin', addToHistory)
        else if (tokenService.isAuthenticated() && (path === '/signin' || path === '/signup'))
            this.navigateTo('/', addToHistory)
        else if (path === '/game')
            this.navigateTo('/', addToHistory)
        else
            this.navigateTo(path, addToHistory)
    }
    navigateTo(path, addToHistory)
    {
        // console.log('im in here - - ', path ,  ' history . ' , addToHistory)
        let options = null

        if (addToHistory === true)
            history.pushState({path}, '', path)
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
        this._route = path
        this.updateContent(path, options)
    }
    async removeWelcomeText()
    {
        const welcomeText = document.getElementById('welcome-text')

        await delay(3000)
        welcomeText.replaceChildren()
    }
    handleIntraRoute(query)
    {
        return new Promise (async resolve  => {
            const params = new URLSearchParams(query)
            const code = params.get('code')
    
            const response = await this._apiService.auth.intraCallback({code : code})
            tokenService.tokens = response
            await this._reset()
            onlineStatusService.init()

            const userInfos = await this._apiService.user.getBasicDataOfUser()

            const text = `hello , ${userInfos.username}`
            const welcomeText = document.getElementById('welcome-text')

            write(text, 100, welcomeText)
            resolve()
        })
    }
    initBasicRoutes()
    {
        return new Promise (async resolve  => {
            await this._reset()
            document.querySelectorAll( '[data-action="router"]' ).forEach( ( item ) => item.classList.remove( 'selected' ) )
            
            const element = document.querySelector(`[href="${window.location.pathname}"]`) 
            if (element)
                element.classList.add('selected')
            resolve()
        })
    }
    async updateContent(path, options)
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
            document.querySelector(`[data-action="router"][href="${path}"]`).classList.add('selected')
        }
        else if (route.template)
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
        this.doSomeChecks(app)
    }
    doSomeChecks(app)
    {
        const modalBackground = app.querySelector('#modal-background')

        if (modalBackground)
        {
            modalBackground.remove()
            eventListeners.off(modalBackground, 'click')
        }
    }
    async fetchDataForCtmEl(options, api)
    {
        const response = await api(options)

        if (response === 'not found')
            return this.handleRoute('/404')
        return new databaseExtractorService(response, this)
    }
}
