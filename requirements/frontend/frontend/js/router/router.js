import {getIsItOutOfGame, setIsItOutOfGame, onlineStatusService, tokenService } from "../managers/globalManager.js"
import { databaseExtractorService } from "../services/databaseExtractorService.js"
import { write , delay} from "../utils/utils.js"
import { ROUTES } from '../constants/routes.js'
import { modalService } from "../services/modalService.js"
import { loader } from "../utils/utils.js"

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
            onlineStatusService.init()
            await this.initBasicRoutes()
        }
        window.addEventListener('popstate', () => this.handleRoute(null))
        this.handleRoute()
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
    async handleRoute(newPath=null)
    {
        const path = newPath || (window.location.pathname !== '/game-settings' ? window.location.pathname : '/')
        const query = window.location.search

        if (this._route === '/game' && path === '/')
        {
            console.log('isout  : ',  getIsItOutOfGame())
            setIsItOutOfGame(true)
            console.log('isout  : ',  getIsItOutOfGame())
            await this.initBasicRoutes()
        }
        if (document.getElementById('welcome-text') && document.getElementById('welcome-text').innerHTML.length)
            this.removeWelcomeText()
        if (query)
            await this.handleIntraRoute(query)
        if (!tokenService.isAuthenticated() && (path !== '/signup' || path !== '/signup'))
            this.navigateTo('/signin')
        else if (tokenService.isAuthenticated() && (path === '/signin' || path === '/signup'))
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
        this._route = path
        this.updateContent(path, options)
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
    }
    async fetchDataForCtmEl(options, api)
    {
        const response = await api(options)

        if (response === 'not found')
            return this.handleRoute('/404')
        return new databaseExtractorService(response, this)
    }
}
