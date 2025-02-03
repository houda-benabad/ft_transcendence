export class OnlineStatusService
{
    constructor(global)
    {
        this._tokenService = global._tokenService

        this.init()
    }

    init()
    {
        const url = `wss://${window.location.host}/wss/online_status`
        const socket = new WebSocket(url)

        socket.onopen = () => { 
            console.log('websocket was opened successfully')
            socket.send (JSON.stringify({token : this._tokenService.accessToken}))
        }
        socket.onclose = (e) => {console.log('connection is closing because  : ', e.reason, 'code : ', e.code)}
        socket.onerror = (e) => {
            console.log('WebSocket error:', e);
        };
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data)

            console.log('the data i got when on message is  : ', data)
        }
    }
}