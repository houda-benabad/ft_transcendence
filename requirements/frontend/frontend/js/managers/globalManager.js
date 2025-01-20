import { EventManager } from './eventManager.js'
import { Router } from '../router/router.js'
import { TokenService } from '../services/tokenService.js'
import { modalService } from '../services/modalService.js'
import { apiService } from '../services/apiService.js'
import { EventService } from '../services/eventService.js'
import { eventHandlers } from '../utils/eventHandlers.js'

export class GlobalManager
{
    constructor()
    {
        this._apiService = apiService
        this._modalService = modalService
        this._eventHandler = eventHandlers

        this._router = new Router(this)
        this._eventManager = new EventManager(this)
        this._tokenService = new TokenService(this)
        this._eventService = new EventService(this)
    }
}

const eventListeners = new EventService() // just for the moment

export { eventListeners }