import { apiService } from '../services/apiService.js'
import { EventManager } from './eventManager.js'
import { Router } from '../router/router.js'
import { TokenService } from '../services/tokenService.js'
import { EventService } from '../services/eventService.js'
import { eventHandlers } from '../utils/eventHandlers.js'
import { reset } from '../utils/utils.js'
import { OnlineStatusService } from '../services/onlineStatusService.js'


const eventListeners = new EventService() // just for the moment i wont be in need of it later on
const onlineStatusService = new OnlineStatusService()
const tokenService = new TokenService()


export class GlobalManager
{
    constructor()
    {
        this._eventHandler = eventHandlers
        this._apiService = apiService
        this._reset = reset
        
        this._router = new Router(this)
        this._eventManager = new EventManager(this)
    }
}

const globalManager = new GlobalManager()

export { eventListeners, globalManager, tokenService, onlineStatusService}
