import {getIsItOutOfGame, setIsItOutOfGame, onlineStatusService, tokenService } from "../managers/globalManager.js"
import { databaseExtractorService } from "../services/databaseExtractorService.js"
import {delay, unwrite} from "../utils/utils.js"
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
        if (tokenService.isAuthenticated())
        {
            await onlineStatusService.init()
            await this.initBasicRoutes()
        }
        window.addEventListener('popstate', (event) => this.handleRoute(event.state ? event.state.path : null, false))
        this.handleRoute(null)
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
    async handleRoute(newPath=null, addToHistory = true)
    {
        const path = newPath || (window.location.pathname !== '/game-settings' ? window.location.pathname : '/')
        const query = path === '/' ? window.location.search :  null

        if (this._route === '/game' && path === '/game-settings')
            this.handlePopstateGame()
        if (document.getElementById('welcome-text') && document.getElementById('welcome-text').innerHTML.length
            && (path !== '/' && this._route !== '/signin' && this._route !== '/signup'))
            this.removeWelcomeText()
        if (query)
            return this.handleIntraRoute(query)
        if (!tokenService.isAuthenticated() && (path !== '/signin' && path !== '/signup'))
            this.navigateTo('/signin', addToHistory, '/signin') // check this one
        else if (tokenService.isAuthenticated() && (path === '/signin' || path === '/signup'))
            this.navigateTo('/', addToHistory, '/')
        else if (path === '/game' || (this._route === '/game' && path === '/game-settings'))
            this.navigateTo('/', addToHistory, '/')
        else
            this.navigateTo(path, addToHistory)
    }
    navigateTo(path, addToHistory, toReplaceHistory = null)
    {
        let options = null
        
        if (addToHistory === true)
            history.pushState({path}, '', path)
        if (path.includes('/profile'))
        {
            options = this.parseProfile(path)
            path = options !== null ? '/profile' : '/404'
        }
        if (this._route === '/signin' && path === '/')
            toReplaceHistory = '/'
        if (toReplaceHistory !== null)
            history.replaceState({}, '', toReplaceHistory)
        this._route = path
        this.updateContent(path, options)
    }
    parseProfile(path)
    {
        const str = path.split('/')
        if (str.includes("profile"))
            return (str[str.length - 1] === 'profile' ? 'me' : str[str.length - 1])
        return null
    }
    async removeWelcomeText()
    {
        const welcomeText = document.getElementById('welcome-text')

        await delay(3000)
        unwrite(100, welcomeText)
    }
    async handlePopstateGame()
    {
        setIsItOutOfGame(true)
        await this.initBasicRoutes()
        setIsItOutOfGame(false)
    }
    async handleIntraRoute(query)
    {
        const params = new URLSearchParams(query)
        const code = params.get('code')

        const response = await this._apiService.auth.intraCallback({code : code})
        if (window.opener)
        {
            window.opener.postMessage({ refresh: response.refresh, access : response.access}, '*');
            window.close();  
        }
    }
    async updateContent(path, options)
    {        
        let fragment = document.createDocumentFragment()
        const app = document.getElementById('app')
        const main = document.getElementById('main')
        
        const route = this._routes[path] || this._routes['/404']
        const container = route.allScreen ? app : main

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
        return new Promise (async resolve  => {
            const response = await api(options)
        
            if (response === 'not found')
                return this.handleRoute('/404')
            resolve(new databaseExtractorService(response, this))
        })
    }
}
