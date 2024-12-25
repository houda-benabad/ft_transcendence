import { EventManager } from './managers/eventManager.js'
import { Router }  from './router/router.js'
import { _tokenService } from './utils/global.js'
import { reset } from './utils/utils.js'

window.addEventListener('DOMContentLoaded', async () => 
{
    if (_tokenService.isAuthenticated())
        await reset()

    const router = new Router()
    const eventManager = new EventManager(router)
})

