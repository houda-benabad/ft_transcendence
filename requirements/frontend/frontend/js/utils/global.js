import { eventService } from "../services/eventService.js"
import { tokenService } from "../services/tokenService.js"

const eventListeners = new eventService()
const token = new tokenService()

export {eventListeners, token}
