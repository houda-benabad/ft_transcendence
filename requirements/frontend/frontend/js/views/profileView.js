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
                id : 1,
                username : 'pingy world',
                profile_pic : '../../assets/componants/user.jpeg',
                is_online : true
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
                    id: 1,
                    username: 'hind',
                    profile_pic : './image.jpeg',
                    is_online : true
                },
                {
                    id: 3,
                    username: 'hind',
                    profile_pic : './image.jpeg',
                    is_online : true
                },
                {
                    id: 4,
                    username: 'hind',
                    profile_pic : './image.jpeg',
                    is_online : true
                },
                {
                    id: 10,
                    username: 'hind',
                    profile_pic : './image.jpeg',
                    is_online : true
                },
                {
                    id: 2,
                    username: 'hind',
                    profile_pic : './image.jpeg',
                    is_online : true
                }
            ],
            requests :
            [
                {
                    request_id : 10,
                    from_user : {
                        id : 10,
                        username: 'houda',
                        profile_pic : './image.jpeg',
                        is_online : true 
                    }
                },
                {
                    request_id : 10,
                    from_user : {
                        id : 10,
                        username: 'houda',
                        profile_pic : './image.jpeg',
                        is_online : true 
                    }
                },
                {
                    request_id : 10,
                    from_user : {
                        id : 10,
                        username: 'houda',
                        profile_pic : './image.jpeg',
                        is_online : true 
                    }
                }
            ]
        }
        //initialize which type of element we are talking about
    }
    async connectedCallback() 
    {
        // const identifier = this.dataset.options
        // this.database = await apiService.user.getUserInfos(identifier) //normally it should be here, and it should be null in the constructor but .

        this.innerHTML = profileTemplate.layout()
        
        this.addProfile()
        this.gameHistory()
        this.addFriends()
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
    addFriends()
    {
        const friendsBox = document.querySelector('.friends-box')

        // here im gonna be creating the element in which will be having a friends and requests
        friendsBox.innerHTML =
        `
        <div id="choices">
            <a class="selected choice-item" href="#" id="friends">friends</a>
            <a href="#" id="requests" class="choice-item">requests</a>
            <div id="sliding-line"></div>
        </div>
        `
        const selected = document.querySelector('.selected')
        const slidingLine = document.getElementById('sliding-line')

        slidingLine.style.width = `${selected.offsetWidth}px`
        slidingLine.style.transform = `translateX(${selected.offsetLeft}px)`

        document.querySelectorAll('.choice-item').forEach(e => {
            e.addEventListener('mouseenter', () => {
                slidingLine.style.width = `${e.offsetWidth}px`
                slidingLine.style.transform = `translateX(${e.offsetLeft}px)`

                document.querySelectorAll('.choice-item').forEach(e => e.classList.remove('selected'))

                e.classList.add('selected')
            })
        })
    }
    extractProfileDb()
    {
        const {
            user_details : { id, username, profile_pic, is_online},
            general_details : {
                friends_count = 0,
                total_games = 0,
                total_points = 0,
                rank = 0,
            }
        } = this.database

        return ({
            userId : id,
            username,
            profilePic : profile_pic,
            status : is_online ? 'online' : 'offline',
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