export const ENDPOINTS =
{
    SIGN_IN : '/auth/users/signin',
    SIGN_UP : '/auth/users/signup',
    INTRA : '/auth/oauth2/authorize',
    PROFILE: '/api/detailed_profile/', // for friends pass username in the end for`
    SEARCHED_USERS: '/api/profiles/search/', // i think i should modify this one
    LEADERBOARD: '/api/game/leaderboard',
    FRIENDSHIP: '/api/friendship/',
    REFRESH_TOKEN : '/auth/jwt/refresh/',
    INTRA : '/auth/oauth2/authorize'
}

// /api/game/player_info/username // save username .p 