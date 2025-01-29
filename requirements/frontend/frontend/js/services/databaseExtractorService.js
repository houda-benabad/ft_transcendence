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
        }

        const extracted = extractionType[type]
        return extracted()
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
        // console.log('in here : ', this.determineIconsAndActions(relationship))
        return ({
            userId : user_id,
            username,
            profilePic : profile_pic_url,
            status  : 'online',
            friendsCount : friends_count,
            totalGames : total_games,
            totalPoints : total_points,
            rank,
            level,
            relationship,
            // actions : this.determineActions('profile', relationship)
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
    // extractDataForFriends()
    // {
    //     console.log('here database is : ', this._database)
    //     const selectedChoice = document.querySelector('.selected-choice') 

    //     // console.log('selected choice : ', selectedChoice.id)
    //     const type = selectedChoice ? (selectedChoice.id === 'friends' ? 'friendsList' : 'friendsRequests') : 'friendsList'

    //     // console.log('type : ', type)
    //     if (type === 'friendsList')
    //         return this.extractDataForFriendsList()
    //     else
    //         return this.extractDataForFriendsRequests()
    // }
    extractDataForFriendsList()
    {
        const { friends, relationship } = this._database

        // console.log('friends here  : ', friends)
        // console.log('database: ', this._database)
        return friends.map(friend => ({
            id : friend.user_details.user_id,
            username : friend.relationship ? friend.user_details.username : 'Me',
            profilePic : friend.user_details.profile_pic_url,
            relationship : friend.relationship,
            other : 'online',
            type : 'friend'
            //here gotta link the icons with the convenient urls.
        }))
    }
    extractDataForFriendsRequests()
    {
        const { requests = []} = this._database
    
        // console.log('requests : ', requests)
        // console.log('database : ', this._database.requests)
        return requests.map(request => ({
            id : request.from_user.user_id,
            username : request.from_user.username,
            profilePic : request.from_user.profile_pic_url,
            other :  '2 min ago',
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
        // console.log(' =>>> relationshipp', relationship)
        let type
        if (id === 'profile')
            type = relationship ? relationship.status : 'me'
        else if (id === 'friends')
            type =  relationship ? relationship.status  : 'me-friends'
        else 
            type = 'requests'

        // console.log('id  : ', id)
        // console.log('the type is : ? ', type)
        // console.log('im here again : ', type)
        const ActionType = {
            'friend'  : ['remove_friend'],
            'stranger' : ['send_request'],
            'pending' : ['cancel_request','accept_request'],
            'requested' : ['cancel_request'],
            'me' : ['edit_profile'],
            'requests' : ['cancel_request','accept_request']
        }
        // console.log('here in the extractor : ', IconType[type])
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


// 'la:user-friends' : 'eva:person-add-outline'] : ['la:user-friends']) : ['eva:person-remove-outline','solar:gamepad-minimalistic-linear']