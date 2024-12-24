import { EventManager } from './managers/eventManager.js'
import { Router }  from './router/router.js'
 
window.addEventListener('DOMContentLoaded', async () => 
{
    const router = new Router()
    const eventManager = new EventManager(router)
})

