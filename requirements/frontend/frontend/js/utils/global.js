import { TokenService } from "../services/tokenService.js"
import { Router } from "../router/router.js"
import { eventService } from '../services/eventService.js'

const _tokenService = new TokenService()
const router = new Router()
const eventListeners = new eventService()

export {_tokenService, router, eventListeners}
