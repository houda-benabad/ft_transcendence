import { init , reset } from './utils/utils.js'
import { eventService } from './services/eventService.js'
import router  from './router/router.js'
 
window.eventListeners = new eventService()
window.gameSettings = null

window.addEventListener('DOMContentLoaded', async () => 
{
    // await init()
    await reset() // no need for this.
    router.init()
})

