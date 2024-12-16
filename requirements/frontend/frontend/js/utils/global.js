import { eventService } from "../services/eventService.js"
import { searchService } from "../services/searchService.js"
import { tokenService } from "../services/tokenService.js"

const eventListeners = new eventService()
const token = new tokenService()
const search = new searchService() // i dont know if this is gonna be proper or not

export {eventListeners, token, search}
