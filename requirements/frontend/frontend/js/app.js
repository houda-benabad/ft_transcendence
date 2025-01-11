import { EventManager } from './managers/eventManager.js'
import { _tokenService } from './utils/global.js'
// import { _tokenService, notificationSocket } from './utils/global.js'
import { Notification } from './utils/notification.js'
import { reset } from './utils/utils.js'

const notificationSocket = new Notification(  )
window.addEventListener('DOMContentLoaded', async () => 
{
    const eventManager = new EventManager()
})

export default notificationSocket

