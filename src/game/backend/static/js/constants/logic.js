export const VELOCITY = {
    PLAYER : .05,
    BALL : {
        x: Math.random() * (0.07 - 0.02),
        y:0,
        z:Math.random() * (0.07 - 0.02)
    }
}

export const ACTIONS  = {
    'api' : 'updateApi',
    'score' : 'updateScore',
    'Connected' : 'updateConnection',
    'endGame' : 'updateState'
}

export const PLAYERS =  ['PLAYER1', 'PLAYER2', 'PLAYER3', 'PLAYER4']


export const KEYS = {
    LEFTARROW : 37,
    RIGHTARROW : 39,
    A: 65,
    D: 68
}