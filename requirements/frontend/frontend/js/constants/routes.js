import { signTemplate } from "../templates/signTemplate.js"
import { errorTemplate } from "../templates/errorTemplate.js"

export const ROUTES = {
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
        allScreen : false
    },
    '/profile' :
    {
        customElement : 'profile-view',
        protected: true,
        allScreen : false
    },
    '/game-settings' :
    {
        customElement : 'game-settings-view',
        protected: true,
        allScreen : false
    },
    '/game' :
    {
        customElement : 'game-view',
        protected: true,
        allScreen : true
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
}