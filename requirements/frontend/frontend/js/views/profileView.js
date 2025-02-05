import { profileTemplate } from "../templates/profileTemplate.js"
import { eventListeners } from "../managers/globalManager.js"

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
        // to remove all eventlisteners for this one
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
        const gameHistory = document.querySelector('.table-box')
        const gameHistoryDb = this._database.extractData('gameHistory')

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
        // eventListeners.on(window, 'resize', eventHandlersForProfile.resize.resizingWindow)
        window.addEventListener('resize', () => eventHandlersForProfile.resize.resizingWindow)
    }
}

customElements.define('profile-view', ProfileView) 

const eventHandlersForProfile = 
{
    animation : 
    {
        animateProgressBar()
        {
            const startTime = performance.now()
            const levelBar = document.getElementById('level-progress')
            const levelPercentage = levelBar.getAttribute('data-value')

            function update(currentTime)
            {
                const elapsedTime = currentTime - startTime
                const duration = (1500 * (levelPercentage / 100))
                const progress = Math.min(elapsedTime / duration, 1) // 2000 represent the duration i want for my animation in ms
                const targetPorcentage = progress * levelPercentage

                levelBar.style.width = `${targetPorcentage}%`
                if (progress < 1)
                    requestAnimationFrame(update)

            }
            requestAnimationFrame(update)
        }
    },
    resize : 
    {
        resizingWindow() 
        {
            console.log('im in heree -  -')
            eventHandlersForProfile.animation.animateProgressBar()
        }
    }
}