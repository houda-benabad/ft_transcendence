import { EventManager } from './managers/eventManager.js'
import { _tokenService } from './utils/global.js'
import { reset } from './utils/utils.js'

let url = `wss://${window.location.host}/wss/notification/1`
let notifSocket =new WebSocket( url )
console.log( "token = ", _tokenService.accessToken)
notifSocket.onopen = ( ) =>{
    notifSocket.send( JSON.stringify( { 'type' : 'auth', 'data': _tokenService.accessToken } ) )
}

window.addEventListener('DOMContentLoaded', async () => 
{
    const eventManager = new EventManager()
})

