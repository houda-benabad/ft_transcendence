import { _tokenService } from './global.js'


export class Notification {

    constructor(  ){
        let url = `wss://${window.location.host}/wss/notification/`
        console.log( " window = ", window.location.host)
        this.notifSocket =new WebSocket( url )
        this.notifSocket.onopen = ( ) => this.#open(  )
        this.notifSocket.onmessage = ( message ) => this.#message( message )
    }

    #open( ){
        this.notifSocket.send( JSON.stringify( { 'type' : 'auth', 'data': _tokenService.accessToken } ) )
    }

    #message( message ){
        const  notifications = JSON.parse( message.data )
        console.log( message.data )
        notifications.forEach(element => {
            console.log( `notification form ${element.sender}` )
        });
    }

    send_msg( type, data ){
        this.notifSocket.send( JSON.stringify({'type' : type, 'data' : data}) )
    }
}
    