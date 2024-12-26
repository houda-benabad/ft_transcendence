import { apiService } from "../services/apiService.js"
import { database } from "../constants/database.js"
import { profileTemplate } from "../templates/profileTemplate.js"
import { animateProgressBar } from "../utils/animations.js"
import { addListenersForFriendsBox} from '../utils/eventListeners.js'
import { eventListeners } from "../utils/global.js"
import { databaseExtractorService } from "../services/databaseExtractorService.js"

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
        this._database = await apiService.user.getUserInfos(this._userId)
        this._dataTransformer = new databaseExtractorService(this._database)

        // console.log(' =>>>>>>> database : ', this._database)
        this.innerHTML = profileTemplate.layout()
        this.addProfile()
        this.gameHistory()
        // this.addFriendsBox()
        // this.setupEventListenersAndAnimations()
    }
    setupEventListenersAndAnimations()
    {
        animateProgressBar()
        eventListeners.on(window, 'resize', () => animateProgressBar())   
        
        if (this._userId === 'me')
            addListenersForFriendsBox.apply(this)
    }
    addProfile()
    {
        const profileBox = document.getElementById('profile-box1')
        const profileDb = this._dataTransformer.extractData('profile')

        profileBox.innerHTML = profileTemplate.profileBox(profileDb) 

        const icons = document.createElement('div', {is : 'custom-icons'})
        const profileBoxTop = profileBox.querySelector('#profile-box1-top')

        icons.data = {userId : profileDb.userId, relationship : profileDb.relationship, id : 'profile'}
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