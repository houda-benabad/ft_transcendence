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
        console.log('added a new friends!!')
        this._socket.send(JSON.stringify({type: 'new_friend', friend_id: newValue}))
    }
    set removeFriend(newValue)
    {
        console.log('removed friends!!')

        this._socket.send(JSON.stringify({type: 'removed_friend', friend_id: newValue}))
        this.updateFriend()
        
    }
    get onlineFriendsList()
    {
        return this._onlineFriendsList
    }
    init()
    {
        this._socket = new WebSocket(`wss://${window.location.host}/wss/online_status?token=${tokenService.accessToken}`)
        this._debounced = debounce(this.updateContent, 500)

        this._socket.onopen = () => { 
            console.log('websocket was opened successfully !!!')
        }
        
        this._socket.onclose = (e) => {
            console.log('websocket was closed because ', e.reason , ' with code ', e.code)
            if (e.code === 1006)
                tokenExpired(this.init.bind(this))
        }
        this._socket.onmessage = (e) => {
            const response = JSON.parse(e.data)
            console.log('websocket got a message the response is  : ', response)
            const {type, online_friends, friend_id, status} = response

            if (type === 'online_friends_list')
                this._onlineFriendsList = Object.values(online_friends)
            else if (type === 'friend_online_status')
                this._debounced({friend_id, status})
            else if (type === 'friend_removed')
            {
                this.updateFriend(friend_id)
                console.log('final list : ', this._onlineFriendsList)
            }
        }
    }
    updateFriend(friend_id)
    {
        this._onlineFriendsList = this._onlineFriendsList.filter((num) => num !== friend_id);
        
        console.log('when removing ------ ', this._onlineFriendsList)
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
