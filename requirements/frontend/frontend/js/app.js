import { init , reset } from './utils/utils.js'
import { eventService } from './services/eventService.js'
import router  from './router/router.js'
import { token } from './utils/global.js'
import { EventManager } from './utils/managers/eventManager.js'
 
class App
{
    constructor()
    {
        //put the other element i may need in here and see if i can share them between modules  
        this.eventManager = new EventManager()
        this.init()
    }
    async init()
    {
        console.log('is user authenticated : ', token.isAuthenticated())
        if (token.isAuthenticated() === false)
            await init() // i will do this one lateer ....
        await reset()
        router.init()
    }
}
window.addEventListener('DOMContentLoaded', async () => 
{
    const app = new App()
})

