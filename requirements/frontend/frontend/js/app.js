import { init , reset } from './utils/utils.js'
import { eventService } from './services/eventService.js'
import router  from './router/router.js'
 
window.eventListeners = new eventService()
// not CLEAAAAAAN
window.token = null

window.addEventListener('DOMContentLoaded', async () => 
{
    // await init()
    await reset() // use this only when u need to start from home 
    router.init()
})

