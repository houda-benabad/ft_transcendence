import { apiService } from "../services/apiService.js"
import { profileTemplate } from "../templates/profileTemplate.js"
import { animateProgressBar } from "../utils/animations.js"
import { eventListeners } from "../utils/global.js"
export class profileView extends HTMLElement
{
    constructor(){
        super()
        this.database = {
            user_details :
            {
                user_id : 1,
                username : 'pingy world',
                profile_pic_url : '../../assets/componants/user.jpeg',
            },
            general_details :
            {
                friends_count : 1000,
                total_games : 1200,
                total_points : 1200,
                rank : 1000,
            },
            game_history :
            [
                {
                    game_type : 'multiplayer',
                    data_time : '2024/12/01/12:00PM',
                    points : 100,
                    status : 'win'
                },
                {
                    game_type : 'local',
                    data_time : '2024/12/01/12:10PM',
                    points : 100,
                    status : 'win'
                },
                {
                    game_type : 'multiplayer',
                    data_time : '2024/12/01/10:00AM',
                    points : 0,
                    status : 'lose'
                },
                {
                    game_type : 'multiplayer',
                    data_time : '2024/12/01/10:00AM',
                    points : 0,
                    status : 'lose'
                },
                {
                    game_type : 'multiplayer',
                    data_time : '2024/12/01/10:00AM',
                    points : 0,
                    status : 'lose'
                },
                
            ],
            friends :
            [
                {
                    user_id: 1,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 3,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 4,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 10,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                },
                {
                    user_id: 2,
                    username: 'hind',
                    profile_pic_url : '../../assets/componants/user.jpeg',
                    remove_friend : 'a url sent by hind'
                }
            ],
            requests :
            [
                {
                    id : 10,
                    from_user : {
                        user_id : 10,
                        username: 'houda',
                        profile_pic_url : '../../assets/componants/user.jpeg',
                    },
                    accept_request : 'a url sent by hind',
                    reject_request : 'a url sent by hind'
                },
                {
                    id : 10,
                    from_user : {
                        user_id : 10,
                        username: 'houda',
                        profile_pic_url : '../../assets/componants/user.jpeg',
                    },
                    accept_request : 'a url sent by hind',
                    reject_request : 'a url sent by hind'
                },
                {
                    id : 10,
                    from_user : {
                        user_id : 10,
                        username: 'houda',
                        profile_pic_url : '../../assets/componants/user.jpeg',
                    },
                    accept_request : 'a url sent by hind',
                    reject_request : 'a url sent by hind'
                }
            ]
        }
        this.selectedChoice = null
        //initialize which type of element we are talking about
    }
    async connectedCallback() 
    {
        // const identifier = this.dataset.options
        // this.database = await apiService.user.getUserInfos(identifier) //normally it should be here, and it should be null in the constructor but .

        this.innerHTML = profileTemplate.layout()
        
        this.addProfile()
        this.gameHistory()
        this.addFriendsEvent()
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
        const friendsBox = document.querySelector('.friends-box')

        // here im gonna be creating the element in which will be having a friends and requests
        friendsBox.innerHTML =
        `
        <div id="choices-container">
            <div id="choices">
                <a class="selected-choice choice-item" href="#" id="friends">friends</a>
                <a href="#" id="requests" class="choice-item">requests</a>
                <div id="sliding-line"></div>
            </div>
        </div>
        <div id="friends-box-container"></div>
        `
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
                console.log('normally shouldnt be the event preveneted ')
                event.preventDefault()

                slidingLine.style.width = `${e.offsetWidth}px` // do i need this .
                slidingLine.style.transform = `translateX(${e.offsetLeft}px)`

                this.selectedChoice.classList.remove('selected-choice')
                e.classList.add('selected-choice')
                this.selectedChoice = e
                this.addFriendsBox()
            })
        })
    }
    addFriendsBox()
    {
        const friendsBox = document.querySelector('.friends-box')
        const friendsDb = this.extractFriendsDb(this.selectedChoice.id)

        profileTemplate.friendsBox(friendsDb)
    }
    extractFriendsDb(id)
    {
        const {friends, requests} = this.database

        if (id === 'friends')
        {
            return friends.map(friend => ({
                userId : friend.user_id,
                username : friend.username,
                profilePic : friend.profile_pic_url,
                removeFriend : friend.remove_friend,
                other : 'online', // gonna see about this
                firstIcon : 'eva:person-remove-outline',
                secondIcon : 'solar:gamepad-minimalistic-linear'
            }))
        }

        return requests.map(request => ({
            requestId : request.id,
            userId : request.from_user.user_id,
            username : request.from_user.username,
            profilePic : request.from_user.profile_pic_url,
            acceptRequest : request.accept_request,
            rejectRequest : request.reject_request,
            other : '2 min ago',
            firstIcon : 'dashicons:no-alt',
            secondIcon : 'dashicons:yes'
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
            }
        } = this.database

        return ({
            userId : user_id,
            username,
            profilePic : profile_pic_url,
            status  : 'online', // we gotta see how to do this
            friendsCount : friends_count,
            totalGames : total_games,
            totalPoints : total_points,
            rank,
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