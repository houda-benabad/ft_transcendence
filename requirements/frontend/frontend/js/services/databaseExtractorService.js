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
            'friends' : this.extractDataForFriends.bind(this)
        }

        const extracted = extractionType[type]
        return extracted()
    }
    extractDataForProfile()
    {
        const {
            user_details : { user_id, username, profile_pic_url},
            general_details : {
                friends_count = 0,
                total_games = 0,
                total_points = 0,
                rank = 0,
            } = {},
            relationship,
        } = this._database
    
        return ({
            userId : user_id,
            username,
            profilePic : profile_pic_url,
            status  : 'online', // we gotta see how to do this
            friendsCount : friends_count,
            totalGames : total_games,
            totalPoints : total_points,
            rank,
            // this needs some updates , a map containing icon type and the proper url .
            iconType : relationship ? (relationship.status === 'friend' ? 'eva:person-remove-outline' : 'eva:person-add-outline') : 'mage:edit',
            iconUrl: relationship ? (relationship.urls) : 'navigateTo settinnfs'
        })
    }
    extractDataForGameHistory()
    {
        const { game_history = []} = this._database

        return game_history.map(game => (
            {
                gameType : game.game_type,
                dateTime : game.data_time,
                gamePoints : game.points,
                gameStatus : game.status
            })
        )
    }
    extractDataForFriends()
    {
        const selectedChoice = document.querySelector('.selected-choice') 

        const type = selectedChoice ? (selectedChoice.id === 'friends' ? 'friendsList' : 'friendsRequests') : 'friendsList'

        if (type === 'friendsList')
            return this.extractDataForFriendsList()
        else
            return this.extractDataForFriendsRequests()
    }
    extractDataForFriendsList()
    {
        const { friends, relationship } = this._database

        return friends.map(friend => ({
            userId : friend.user_details.user_id,
            username : friend.relationship ? friend.user_details.username : 'Me',
            profilePic : friend.user_details.profile_pic_url,
            removeFriend : friend.user_details.remove_friend,
            other : 'online',
            icons : relationship ? (friend.relationship ? [friend.relationship.status === 'friend' ?
                    'la:user-friends' : 'eva:person-add-outline'] : ['la:user-friends']) : ['eva:person-remove-outline','solar:gamepad-minimalistic-linear']
            //here gotta link the icons with the convenient urls.
        }))
    }
    extractDataForFriendsRequests()
    {
        const { requests } = this._database

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
    
}