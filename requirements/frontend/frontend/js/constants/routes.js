import { signTemplate } from "../templates/signTemplate.js"
import { errorTemplate } from "../templates/errorTemplate.js"
import { apiService } from "../services/apiService.js"

export const ROUTES = (apiService) => ({
    '/signin' :
    {
        template : signTemplate('signin'),
        allScreen : true
    },
    '/signup' :
    {
        template : signTemplate('signup'),
        allScreen : true
    },
    '/' :
    {
        customElement : 'home-view',
        allScreen : false,
        api : () => apiService.home.getLeaderboardData(),
    },
    '/game' :
    {
        allScreen : true,
    },
    '/profile' :
    {
        customElement : 'profile-view',
        allScreen : false,
        api : (userId) => apiService.user.getProfileInfos(userId)
    },
    '/game-settings' :
    {
        customElement : 'game-settings-view',
        allScreen : false
    },
    '/settings' :
    {
        customElement : 'settings-view',
        allScreen : false,
        api : () => apiService.settings.getBasicData()
    },
    '/404' :
    {
        template : errorTemplate(),
        allScreen : true
    },
})