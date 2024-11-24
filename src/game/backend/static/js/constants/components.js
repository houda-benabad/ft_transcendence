export const COLORS = {
    PLANE : 0x5F1584,
    BALL : 0xD43ADF,
    PLAYER1 : 0x8C96ED,
    PLAYER2: 0XFFFFFF
}

export const DIMENSION = {
    PLANE : {
        x:4,
        y:.2,
        z:6
    },
    BALL : {
        x:.1,
        y:32,
        z:15
    },
    PLAYER : {
        x:1,
        y:.3,
        z:.1
    }
}

export const POSITION = {
    PLANE : {
        x:0,
        y:0,
        z:0
    },
    BALL : {
        x:0,
        y:.8,
        z:0
    },
    PLAYER1 : {
        x:0,
        y:.4,
        z:DIMENSION.PLANE.z/2
    },
    PLAYER2 : {
        x:0,
        y:.4,
        z:-DIMENSION.PLANE.z/2
    },
    PLAYER3 : {
        x:1.5,
        y:.4,
        z:DIMENSION.PLANE/2
    },
    PLAYER4 : {
        x:1.5,
        y:.4,
        z:-2.55
    }
}

export const MULTIPLAYERPOSITION = {
    PLAYER1 : {
        x:1.5,
        y:.4,
        z:2.55
    },
    PLAYER2 : {
        x:-1.5,
        y:.4,
        z:2.55
    },
    PLAYER3 : {
        x:1.5,
        y:.4,
        z:-2.55
    },
    PLAYER4 : {
        x:-1.5,
        y:.4,
        z:-2.55
    }
}



export const BACKGROUND = {
    DIMENSION :{
        x:8,
        y:128,
        z:128
    },
    SCALE: {
        x:-1,
        y:1,
        z:1
    }
}

export const TEXTURE  = 'default'
