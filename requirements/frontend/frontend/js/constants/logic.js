export const VELOCITY = {
    PLAYER : .09,
    BALL : {
        x: 0.03,
        y:0,
        z:0.05
    }
}

export const MAXVELOCITY = .09

export const ACTIONS  = {
    'api' : 'updateApi',
    'score' : 'updateScore',
    'start' : 'updateStart',
    'endGame' : 'updateState',
    'error' : '_handle_socket_error',
    'matchmaking' : 'handleMatchmaking'
}

export const PLAYERS =  ['PLAYER1', 'PLAYER2', 'PLAYER3', 'PLAYER4']


export const KEYS = {
    UP : 38,
    DOWN : 40,
    W: 87,
    S: 83
}