// import { _tokenService } from './global.js'
import { escapeHtml } from './security.js'

export class Notification {

    constructor(  ){
        let url = `wss://${window.location.host}/wss/notification/`
        console.log( " window = ", window.location.host)
        this.notifSocket =new WebSocket( url )
        this.notifSocket.onopen = ( ) => this.#open(  )
        this.notifSocket.onmessage = ( message ) => this.#message( message )
        this._notificationsHtml = document.createDocumentFragment()
    }

    get notificationsHtml()
    {
        return this._notificationsHtml
    }
    set notificationsHtml(newValue)
    {
        this._notificationsHtml = newValue
    }
    #open( ){
        this.notifSocket.send( JSON.stringify( { 'type' : 'auth', 'data': _tokenService.accessToken } ) )
    }

    #message( message ){
        const  notifications = JSON.parse( message.data )
        const { type, data } = notifications
        console.log( "type = ", type)
        if ( type == 'new_notification'){
            const notification = document.querySelector('.circle')

            notification.classList.add('active-notification')
            console.log('here : ', notification)
        }
        this.renderHtml(type, data)
    }
    renderHtml(type, data)
    {
        if (type === 'all_notifications')
        {
            data.forEach(e => {
                const notificationItem = document.createElement('div')
                notificationItem.classList.add('notification-item')

                notificationItem.innerHTML = 
                `<img src='${escapeHtml(e.profilePic)}'>
                <div class="notification-info">
                    <p class="username">${escapeHtml(e.sender)}</p>
                    <p class="content">${escapeHtml(e.content)}</p>
                </div>
                <div class="other">
                    <div class="seen" style="display : block;"></div>
                    <p class="notification-time">${escapeHtml(e.time)}</p>
                </div>
                `
                this.notificationsHtml.appendChild(notificationItem)
            })
        }
        else 
        {
            const notificationItem = document.createElement('div')
                notificationItem.classList.add('notification-item')

                notificationItem.innerHTML = 
                `<img src='${escapeHtml(data.profilePic)}'>
                <div class="notification-info">
                    <p class="username">${escapeHtml(data.sender)}</p>
                    <p class="content">${escapeHtml(data.content)}</p>
                </div>
                <div class="other">
                    <div class="seen" style="display : block;"></div>
                    <p class="notification-time">${escapeHtml(data.time)}</p>
                </div>
                `
                this.notificationsHtml.appendChild(notificationItem) // later
                this.notifSocket.send( JSON.stringify({"type": 'update', 'data': data.id})) 
        }
    }
    send_msg( type, data ){
        this.notifSocket.send( JSON.stringify({'type' : type, 'data' : data}) )
    }
}
    