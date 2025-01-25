import { signTemplate } from "../templates/signTemplate.js"
import { errorTemplate } from "../templates/errorTemplate.js"
import { apiService } from "../services/apiService.js"

export const ROUTES = (apiService) => ({
    '/signin' :
    {
        template : signTemplate('signin'),
        protected : false,
        allScreen : true
    },
    '/signup' :
    {
        template : signTemplate('signup'),
        protected : false,
        allScreen : true
    },
    '/' :
    {
        customElement : 'home-view',
        protected: true,
        allScreen : false,
        api : () => apiService.home.getLeaderboardData(),
    },
    '/profile' :
    {
        customElement : 'profile-view',
        protected: true,
        allScreen : false,
        api : (userId) => apiService.user.getProfileInfos(userId)
    },
    '/game-settings' :
    {
        customElement : 'game-settings-view',
        protected: true,
        allScreen : false
    },
    '/settings' :
    {
        customElement : 'settings-view',
        protected: true,
        allScreen : false
    },
    '/404' :
    {
        template : errorTemplate(),
        protected: false,
        allScreen : true
    },
})