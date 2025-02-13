import { profileTemplate } from "../templates/profileTemplate.js"
import { eventListeners } from "../managers/globalManager.js"
import { Friends } from "../componants/customElements.js"
import { eventHandlersForProfile } from "../utils/eventHandlers.js"
import { escapeHtml } from "../utils/security.js"

export class ProfileView extends HTMLElement
{
    constructor()
    {
        super()
        
        this._database = null
        this._username = null
        this._userId = null
    }
    set database(value)
    {
        this._database = value
    }
    set userId(value)
    {
        this._userId = value
    }
    set updateStatus({friend_id, status})
    { 
        if (friend_id === Number(this._userId))
        {
            const statusDom = this.querySelector('.profile-box1-box-text')
            statusDom.id = status
            statusDom.innerHTML = escapeHtml(status)
        }
    }
    async connectedCallback() 
    {
        this.innerHTML = profileTemplate.layout()
        this.addProfile()
        this.gameHistory()
        this.addFriendsBox()
        this.setupEventListenersAndAnimations()
    }
    disconnectedCallback()
    {
        eventListeners.removeAll()
    }
    addProfile()
    {
        const profileBox = document.getElementById('profile-box1')
        const profileDb = this._database.extractData('profile')

        this._username = profileDb.username
        profileBox.innerHTML = profileTemplate.profileBox(profileDb) 

        const icons = document.createElement('div', {is : 'custom-icons'})
        const profileBoxTop = profileBox.querySelector('#profile-box1-top')

        icons.data = {id : profileDb.userId, relationship : profileDb.relationship, iconId: 'profile'}
        profileBoxTop.appendChild(icons)
    }
    gameHistory()
    {
        const gameHistory = document.querySelector('.custom-table')
        let gameHistoryDb = this._database.extractData('gameHistory')
        
        gameHistory.innerHTML = profileTemplate.gameHistory(gameHistoryDb)
    }
    addFriendsBox()
    {
        const friendsBox = document.querySelector('.friends-box')
        friendsBox.innerHTML = profileTemplate.friendsBox(this._userId, this._username)

        const friends = document.createElement('div', {is : 'custom-friends'})

        friends.friendsListDb = this._database.extractData('friendsList')
        friends.friendsRequestsDb = this._database.extractData('friendsRequests')
        
        friendsBox.appendChild(friends)
    }
    setupEventListenersAndAnimations()
    {
        eventListeners.on(window, 'resize', eventHandlersForProfile.animation.animateProgressBar())

        if (this._userId === 'me')
        {
            eventHandlersForProfile.animation.changeLineForSelectedChoice()
            document.querySelectorAll('.choice-item').forEach(e => {
                eventListeners.on(e, 'mouseover', (event) => eventHandlersForProfile.animation.mouseOverSelectedChoice(event.target))
                eventListeners.on(e, 'mouseout', (event) => eventHandlersForProfile.animation.mouseOutSelectedChoice(event.target))
                eventListeners.on(e, 'click', (event) => eventHandlersForProfile.click.clickSelectedChoice(event.target))
            })
        }

    }
}

customElements.define('profile-view', ProfileView) 

