import { apiService } from '../services/apiService.js'
import { EventManager } from './eventManager.js'
import { Router } from '../router/router.js'
import { TokenService } from '../services/tokenService.js'
import { EventService } from '../services/eventService.js'
import { reset } from '../utils/utils.js'
import { OnlineStatusService } from '../services/onlineStatusService.js'
import { FormService } from '../services/formService.js'


const eventListeners = new EventService()
const onlineStatusService = new OnlineStatusService()
const tokenService = new TokenService()
let isItOutOfGame = false
let isAllOptionsForGameSettings = true

export function setIsItOutOfGame(value)
{
    console.log('im in here - - , i set value to  : ', value)
    isItOutOfGame = value
}
export function getIsItOutOfGame()
{
    return isItOutOfGame
}

export function setisAllOptionsForGameSettings(value)
{
    isAllOptionsForGameSettings = value
}
export function getisAllOptionsForGameSettings()
{
    return isAllOptionsForGameSettings
}

export class GlobalManager
{
    constructor()
    {
        this._apiService = apiService
        this._reset = reset
        this._formService = new FormService(this)
        
        this._router = new Router(this)
        this._formService = new FormService(this)
        this._eventManager = new EventManager(this)
    }
}

const globalManager = new GlobalManager()

export { eventListeners, globalManager, tokenService, onlineStatusService}
