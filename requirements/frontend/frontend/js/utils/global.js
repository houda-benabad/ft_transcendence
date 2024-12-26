import { eventService } from "../services/eventService.js"
import { tokenService } from "../services/tokenService.js"

//those variables are global, some data inside of them i dont want them to change .
const eventListeners = new eventService()
const token = new tokenService()

export {eventListeners, token}
