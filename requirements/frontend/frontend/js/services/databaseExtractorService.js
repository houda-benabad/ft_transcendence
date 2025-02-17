import { onlineStatusService } from "../managers/globalManager.js"
import { determineUserStatus } from "../utils/utils.js"

export class databaseExtractorService
{
    constructor(database)
    {
        this._database = database

    }
    extractData(type)
    {
        const extractionType = {
            'profile' : this.extractDataForProfile.bind(this),
            'gameHistory' : this.extractDataForGameHistory.bind(this),
            'friendsList' : this.extractDataForFriendsList.bind(this),
            'friendsRequests' : this.extractDataForFriendsRequests.bind(this),
            'leaderboard' : this.extractDataForLeaderboard.bind(this),
            'notifications' : this.extractDataForNotifications.bind(this),
            'settings' : this.extractDataforSettings.bind(this)
        }

        const extracted = extractionType[type]
        return extracted()
    }
    extractDataforSettings()
    {
        return this._database
    }
    extractDataForProfile()
    {
        const {
            user_details : { user_id, username, profile_pic_url},
            general_details : {
                friends_count,
                total_games,
                total_points,
                rank,
                level,
            } = {},
            relationship,
        } = this._database
        return ({
            userId : user_id,
            username,
            profilePic : profile_pic_url,
            status  : determineUserStatus(user_id, relationship),
            friendsCount : friends_count,
            totalGames : total_games,
            totalPoints : total_points,
            rank,
            level,
            relationship,
        })
    }
    extractDataForGameHistory()
    {
        const { game_history = []} = this._database

        return game_history.map(game => (
            {
                gameType : game.type,
                dateTime : game.date_time,
                gamePoints : game.points,
                gameStatus : game.status
            })
        )
    }
    extractDataForFriendsList()
    {
        const { friends} = this._database

        return friends.map(friend => ({
            id : friend.user_details.user_id,
            username : friend.relationship ? friend.user_details.username : 'Me',
            profilePic : friend.user_details.profile_pic_url,
            relationship : friend.relationship,
            other : determineUserStatus(friend.user_details.user_id, friend.relationship),
            type : 'friend'
        }))
    }
    extractDataForFriendsRequests()
    {
        const { requests = []} = this._database
    
        return requests.map(request => ({
            id : request.from_user.user_id,
            username : request.from_user.username,
            profilePic : request.from_user.profile_pic_url,
            other :  request.time_received,
            type : 'request'
        }))
    }
    extractDataForLeaderboard()
    {
        return this._database.map(row => (
        {
            userId : row.user_id,
            username : row.username,
            rank : row.rank,
            totalPoints : row.total_points
        })
        )
    }
    determineActions(id, relationship = null)
    {
        let type
        if (id === 'profile')
            type = relationship ? relationship.status : 'me'
        else if (id === 'friends')
            type =  relationship ? relationship.status  : 'me-friends'
        else 
            type = 'requests'

        const ActionType = {
            'friend'  : ['remove_friend'],
            'stranger' : ['send_request'],
            'pending' : ['cancel_request','accept_request'],
            'requested' : ['cancel_request'],
            'me' : ['edit_profile'],
            'requests' : ['cancel_request','accept_request']
        }
        return (ActionType[type])
    }
    extractDataForNotifications()
    {
        return this._database.map(obj => (
        {
            sender : obj.sender,
            content : obj.content,
            profilePic : obj.profile_pic,
            time : obj.time,
            seen : obj.seen
        })
        )
    }
}