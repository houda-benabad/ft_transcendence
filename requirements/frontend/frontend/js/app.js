import { init , reset } from './utils/utils.js'
import { eventService } from './services/eventService.js'
import router  from './router/router.js'
import { token } from './utils/global.js'
 
window.addEventListener('DOMContentLoaded', async () => 
{
    // console.log(token.isAuthenticated())
    // if (token.isAuthenticated() === false)
    //     await init() // to remove the reset function from here
    await reset()
    router.init()
})

