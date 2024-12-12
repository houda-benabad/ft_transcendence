import { apiService } from "../services/apiService.js"
import { profileTemplate } from "../templates/profileTemplate.js"
import { animateProgressBar } from "../utils/animations.js"
import { eventListeners } from "../utils/global.js"
import { database } from "../constants/database.js"

export class profileView extends HTMLElement
{
    //userdetails in friends in id 
    // what about if its me would this element relationship not be there
    constructor(){
        super()
        this.database = database 
        this.selectedChoice = null
        this.userType = null
        this.userUsername = null
        //initialize which type of element we are talking about
    }
    async connectedCallback() 
    {
        // const identifier = this.dataset.options
        const identifier = '2'

        // this.database = await apiService.user.getUserInfos(identifier) //normally it should be here, and it should be null in the constructor but .

        this.innerHTML = profileTemplate.layout()
        
        this.addProfile()
        this.gameHistory()
        this.addFriendsBox()
    }
    addProfile()
    {
        const profileBox = document.getElementById('profile-box1')
        const profileDb = this.extractProfileDb()
        
        profileBox.innerHTML = profileTemplate.profileBox(profileDb)
        animateProgressBar()
        eventListeners.on(window, 'resize', () => animateProgressBar())    
    }
    gameHistory()
    {
        const gameHistory = document.querySelector('.table-box')
        const gameHistoryDb = this.extractGameHistoryDb()

        gameHistory.innerHTML = profileTemplate.gameHistory(gameHistoryDb)
    }
    addFriendsEvent()
    {
        this.selectedChoice = document.querySelector('.selected-choice')
        const slidingLine = document.getElementById('sliding-line')

        // initial value
        slidingLine.style.width = `${this.selectedChoice.offsetWidth}px`
        slidingLine.style.transform = `translateX(${this.selectedChoice.offsetLeft}px)`

        document.querySelectorAll('.choice-item').forEach(e => {
            e.addEventListener('mouseover', (event) => {
                slidingLine.style.width = `${e.offsetWidth}px` // do i need this .
                slidingLine.style.transform = `translateX(${e.offsetLeft}px)`
                e.classList.add('hoovered')
                this.selectedChoice.classList.remove('selected-choice')
            })
            e.addEventListener('mouseout', (event) => {
                slidingLine.style.width = `${this.selectedChoice.offsetWidth}px` // do i need this .
                slidingLine.style.transform = `translateX(${this.selectedChoice.offsetLeft}px)`
                e.classList.remove('hoovered')
                this.selectedChoice.classList.add('selected-choice')
            })
            e.addEventListener('click', (event) => {

                event.preventDefault()
                
                slidingLine.style.transform = `translateX(${e.offsetLeft}px)`
                this.selectedChoice.classList.remove('selected-choice')
                e.classList.add('selected-choice')
                this.selectedChoice = e

                const friendsDb = this.extractFriendsDb(this.selectedChoice)
                const friendsBoxConatainer = document.getElementById('friends-box-container')

                if (friendsDb.length === 0)
                {
                    const value = this.selectedChoice ? this.selectedChoice.id : 'friends'
                    friendsBoxConatainer.innerHTML = `<p>there is no ${value} at the moment</p>`
                    return ;
                }
                profileTemplate.friendsBox(friendsDb)
            })
        })
    }
    addFriendsBox()
    {
        const friendsBox = document.querySelector('.friends-box')
        const friendsDb = this.extractFriendsDb(this.selectedChoice)

        if (this.userType === 'me')
        {
            friendsBox.innerHTML = `
            <div id="choices-container">
                <div id="choices">
                    <a class="selected-choice choice-item" href="#" id="friends">friends</a>
                    <a href="#" id="requests" class="choice-item">requests</a>
                    <div id="sliding-line"></div>
                </div>
            </div>
            <div id="friends-box-container"></div>`
            this.addFriendsEvent()
        }
        else
            friendsBox.innerHTML = 
        `<h2>${this.userUsername}'s friends</h2>
            <div id="friends-box-container"></div>`

        const friendsBoxConatainer = document.getElementById('friends-box-container')

        if (friendsDb.length === 0)
        {
            const value = this.selectedChoice ? this.selectedChoice.id : 'friends'
            friendsBoxConatainer.innerHTML = `<p>there is no ${value} at the moment</p>`
            return ;
        }
        profileTemplate.friendsBox(friendsDb)
    }
    extractFriendsDb(db=null)
    {
        const {friends, requests} = this.database

        if (db === null || db.id === 'friends')
        {
            return friends.map(friend => ({
                userId : friend.user_details.user_id,
                username : friend.relationship ? friend.user_details.username : 'Me',
                profilePic : friend.user_details.profile_pic_url,
                removeFriend : friend.user_details.remove_friend,
                other : 'online',
                icons : this.userType === 'me' ? [
                    'eva:person-remove-outline',
                    'solar:gamepad-minimalistic-linear'
                ] : friend.relationship ? [friend.relationship.status === 'friend' ?
                    'la:user-friends' : 'eva:person-add-outline'] : ['la:user-friends']
            }))
        }
        return requests.map(request => ({
            requestId : request.id,
            userId : request.from_user.user_id,
            username : request.from_user.username,
            profilePic : request.from_user.profile_pic_url,
            acceptRequest : request.accept_request,
            rejectRequest : request.reject_request,
            other : '2 min ago', // need to find a solution for this ..
            icons : [
                'dashicons:no',
                'dashicons:yes'
            ]
        }))
    
    }
    extractProfileDb()
    {
        const {
            user_details : { user_id, username, profile_pic_url},
            general_details : {
                friends_count = 0,
                total_games = 0,
                total_points = 0,
                rank = 0,
            },
            relationship,
        } = this.database

        this.userType = relationship ? relationship.status : 'me' // where i would be in need of this
        this.userUsername = username
        return ({
            userId : user_id,
            username,
            profilePic : profile_pic_url,
            status  : 'online', // we gotta see how to do this
            friendsCount : friends_count,
            totalGames : total_games,
            totalPoints : total_points,
            rank,
            iconType : relationship ? (relationship.status === 'friend' ? 'eva:person-remove-outline' : 'eva:person-add-outline') : 'mage:edit',
            iconUrl: relationship ? (relationship.urls) : 'navigateTo settinnfs'
        })
    }
    extractGameHistoryDb()
    {
        const { game_history } = this.database // would game history be sent to me empty or not sent by hind - -

        return game_history.map(game => (
            {
                gameType : game.game_type,
                dateTime : game.data_time,
                gamePoints : game.points,
                gameStatus : game.status
            })
        )
    }
}
customElements.define('profile-view', profileView) 