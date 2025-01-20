import { apiService } from "../services/apiService.js"
import { profileTemplate } from "../templates/profileTemplate.js"
import { animateProgressBar } from "../utils/animations.js"
import { addListenersForFriendsBox} from '../utils/eventListeners.js'
import { databaseExtractorService } from "../services/databaseExtractorService.js"
// import { router  } from "../utils/global.js"

export class ProfileView extends HTMLElement
{
    constructor()
    {
        super()

        this._userId = null
        this._database = null
        this._dataTransformer = null
    }
    set userId(value)
    {
        this._userId = value
    }

    async connectedCallback() 
    {
        this._database = await apiService.user.getProfileInfos(this._userId)

        if (this._database === 'not found')
            return router.handleRoute('/404')
        this._dataTransformer = new databaseExtractorService(this._database)

        this.innerHTML = profileTemplate.layout()
        this.addProfile()
        this.gameHistory()
        this.addFriendsBox()
        this.setupEventListenersAndAnimations()
    }
    disconnectedCallback()
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
            addListenersForFriendsBox.apply(this) // gotta remove the events after finishing up with it .
        animateProgressBar()
    }
    addProfile()
    {
        const profileBox = document.getElementById('profile-box1')
        const profileDb = this._dataTransformer.extractData('profile')

        profileBox.innerHTML = profileTemplate.profileBox(profileDb) 

        const icons = document.createElement('div', {is : 'custom-icons'})
        const profileBoxTop = profileBox.querySelector('#profile-box1-top')

        icons.data = {id : profileDb.userId, relationship : profileDb.relationship, iconId: 'profile'}
        profileBoxTop.appendChild(icons)
    }
    gameHistory()
    {
        const gameHistory = document.querySelector('.table-box')
        const gameHistoryDb = this._dataTransformer.extractData('gameHistory')

        gameHistory.innerHTML = profileTemplate.gameHistory(gameHistoryDb)
    }
    addFriendsBox()
    {
        const friendsBox = document.querySelector('.friends-box')

        friendsBox.innerHTML = profileTemplate.friendsBox(this._userId)

        const friendsDb = this._dataTransformer.extractData('friends')

        profileTemplate.friendsBoxConatainer(friendsDb)
    }
   
}
customElements.define('profile-view', ProfileView) 