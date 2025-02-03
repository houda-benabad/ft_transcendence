export class OnlineStatusService
{
    constructor(global)
    {
        this._tokenService = global._tokenService

        this._socket = new WebSocket(`wss://${window.location.host}/wss/online_status`)
        this.init()
    }

    set newFriend(newValue)
    {
        console.log('newvalue : ', newValue)
        this._socket.send(JSON.stringify({type: 'new_friend', friend_id: newValue}))
    }
    init()
    {
        this._socket.onopen = () => { 
            console.log('websocket was opened successfully')
            this._socket.send (JSON.stringify({type: 'auth', token : this._tokenService.accessToken}))
        }
        this._socket.onclose = (e) => {console.log('connection is closing because  : ', e.reason, 'code : ', e.code)}
        this._socket.onerror = (e) => {
            console.log('WebSocket error:', e);
        };
        this._socket.onmessage = (e) => {
            const data = JSON.parse(e.data)

            console.log('the data i got when on message is  : ', data)
        }
    }
}