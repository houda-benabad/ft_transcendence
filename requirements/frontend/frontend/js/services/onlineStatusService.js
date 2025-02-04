import { tokenService } from "../managers/globalManager.js"

export class OnlineStatusService
{
    constructor()
    {
        this._socket = null
        this._onlineFriendsList = null
    }

    set newFriend(newValue)
    {
        console.log('newvalue : ', newValue)
        this._socket.send(JSON.stringify({type: 'new_friend', friend_id: newValue}))
    }
    get onlineFriendsList()
    {
        return this._onlineFriendsList
    }
    init()
    {
        this._socket = new WebSocket(`wss://${window.location.host}/wss/online_status`)
        
        this._socket.onopen = () => { 
            console.log('websocket was opened successfully')
            this._socket.send (JSON.stringify({type: 'auth', token : tokenService.accessToken}))

            setTimeout(() => 
                {
                    const logout = document.querySelector('a[href="/logout"]')
                    logout.addEventListener('click', () => this._socket.close(1000))
                }
                , 3000)
        }
        this._socket.onclose = (e) => {console.log('connection is closing because  : ', e.reason, 'code : ', e.code)}
        this._socket.onerror = (e) => {
            console.log('WebSocket error:', e);
        };
        this._socket.onmessage = (e) => {
            const response = JSON.parse(e.data)

            const {type, online_friends} = response
            if (type === 'online_friends_list')
                this._onlineFriendsList = online_friends
            console.log('the data i got is ', this._onlineFriendsList)
        }
    }
    closeSocket()
    {
        this._socket.close()
    }
}