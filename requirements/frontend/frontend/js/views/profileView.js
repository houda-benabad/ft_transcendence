import { profileTemplate } from "../templates/profileTemplate.js"
import { animateProgressBar } from "../utils/animations.js"
import { Icons ,Friends} from "../componants/customElements.js"
import { globalManager } from "../managers/globalManager.js"
``
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
        // console.log('im in heee')
        this._userId = value
    }
    async connectedCallback() 
    {
        this.innerHTML = profileTemplate.layout()
        this.addProfile()
        this.gameHistory()
        this.addFriendsBox()
        this.setupEventListenersAndAnimations()
        this.setUpWebsocket()
    }
    setUpWebsocket()
    {
        const url = `wss://${window.location.host}/wss/online_status`
        const socket = new WebSocket(url)

        socket.onopen = () => { console.log('websocket was opened successfully')}
    }
    disconnectedCallback() // later
    {
        window.removeEventListener('resize', animateProgressBar)

        // if (this._userId === 'me') // to check later on how to do it
        //     removeListenersForFriendsBox.apply(this) // to remove the event listeners of friends
    }
    setupEventListenersAndAnimations()
    {
        window.addEventListener('resize', animateProgressBar)
        window.addEventListener('resize', () => {
            let selectedChoice = document.querySelector('.selected-choice')
            const slidingLine = document.getElementById('sliding-line')

            slidingLine.style.width = `${selectedChoice.offsetWidth}px`
            slidingLine.style.transform = `translateX(${selectedChoice.offsetLeft}px)`
        })
        if (this._userId === 'me')
            this.addListenersForFriendsBox()
        animateProgressBar()
    }
    addListenersForFriendsBox()
    {
        let selectedChoice = document.querySelector('.selected-choice')
        const slidingLine = document.getElementById('sliding-line')

        // initial value
        slidingLine.style.width = `${selectedChoice.offsetWidth}px`
        slidingLine.style.transform = `translateX(${selectedChoice.offsetLeft}px)`

        document.querySelectorAll('.choice-item').forEach(e => {
            e.addEventListener('mouseover', (event) => {
                slidingLine.style.width = `${e.offsetWidth}px`
                slidingLine.style.transform = `translateX(${e.offsetLeft}px)`
                e.classList.add('hoovered')
                selectedChoice.classList.remove('selected-choice')
            })
            e.addEventListener('mouseout', (event) => {
                slidingLine.style.width = `${selectedChoice.offsetWidth}px`
                slidingLine.style.transform = `translateX(${selectedChoice.offsetLeft}px)`
                e.classList.remove('hoovered')
                selectedChoice.classList.add('selected-choice')
            })
            e.addEventListener('click', (event) => {
                event.preventDefault()
                
                slidingLine.style.transform = `translateX(${e.offsetLeft}px)`
                selectedChoice.classList.remove('selected-choice')
                e.classList.add('selected-choice')
                selectedChoice = e

                const friendsBoxContainer = document.getElementById('friends-box-container')
                friendsBoxContainer.friendsList = selectedChoice.id === 'friends' ? true : false
            })
    })
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



        // const friendsDb = this._database.extractData('friends')
        // profileTemplate.friendsBoxConatainer(friendsDb)
    }
    
}
customElements.define('profile-view', ProfileView) 