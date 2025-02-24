import { tokenService } from "../managers/globalManager.js"
import { debounce, tokenExpired } from "../utils/utils.js"

export class OnlineStatusService
{
    constructor()
    {
        this._socket = null
        this._onlineFriendsList = []
        this._debounced = null
    }

    set newFriend(newValue)
    {
        this._socket.send(JSON.stringify({type: 'new_friend', friend_id: newValue}))
    }
    set removeFriend(newValue)
    {
        this._socket.send(JSON.stringify({type: 'removed_friend', friend_id: newValue}))
        this.updateFriend()
    }
    get onlineFriendsList()
    {
        return this._onlineFriendsList
    }
    init()
    {
        return new Promise (resolve => {
            this.createSocket(resolve)
        })
    }
    createSocket(resolve)
    {
        this._socket = new WebSocket(`wss://${window.location.host}/wss/online_status?token=${tokenService.accessToken}`)
        this._debounced = debounce(this.updateContent, 500)

        this._socket.onopen = () => { 
            console.log('websocket was opened successfully !!!')
        }
        
        this._socket.onclose = (e) => {
            console.log('websocket was closed because ', e.reason , ' with code ', e.code)
            if (e.code === 1006)
                tokenExpired(this.createSocket.bind(this, resolve))
        }
        this._socket.onmessage = (e) => {
            console.log('im in here - -')
            const response = JSON.parse(e.data)
            const {type, online_friends, friend_id, status} = response
         
            if (type === 'online_friends_list')
            {
                this._onlineFriendsList = Object.values(online_friends)
                resolve()
            }
            else if (type === 'friend_online_status')
                this._debounced({friend_id : Number(friend_id), status}) // in here sends me friend_id as a string
            else if (type === 'friend_removed')
                this.updateFriend(friend_id)
        }
    }
    updateFriend(friend_id)
    {
        this._onlineFriendsList = this._onlineFriendsList.filter((num) => num !== friend_id);
        
        const profileView = document.querySelector('profile-view')
        if (profileView)
            profileView.updateStatus = {friend_id, status : 'unknown'}
    }
    updateContent({friend_id, status})
    {        
        if (status === 'offline')
            this._onlineFriendsList = this._onlineFriendsList.filter((num) => num !== friend_id);
        else
            this._onlineFriendsList.push(friend_id)

        const profileView = document.querySelector('profile-view')
        if (profileView)
        {
            const friendsBoxContainer = document.getElementById('friends-box-container')

            profileView.updateStatus = {friend_id, status}
            friendsBoxContainer.updateStatus = {friend_id, status}
        }
    }
    closeSocket()
    {
        this._socket.close(1000)
    }
}
