export const COLORS = {
    PLANE : 0x5F1584,
    PLAYER1 : 0x8C96ED,
    PLAYER2: 0XFFFFFF,
    popular : 0x0FFADF,
    default : 0xD43ADF,
    special : 0xD43A00
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
    },
    BANNER :{
        x: .2,
        y: 2,
        z: 6
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
    BANNER1:{
        x:-DIMENSION.PLANE.x/2 - DIMENSION.BANNER.x/2 - .1,
        y:0,
        z:0
    },
    BANNER2:{
        x:DIMENSION.PLANE.x/2 + DIMENSION.BANNER.x/2 + .1,
        y:0,
        z:0
    }

}

export const MULTIPLAYERPOSITION = {
    PLAYER1 : {
        x:1.5,
        y:.4,
        z:(DIMENSION.PLANE.z+1)/2
    },
    PLAYER2 : {
        x:-1.5,
        y:.4,
        z:(DIMENSION.PLANE.z+1)/2
    },
    PLAYER3 : {
        x:1.5,
        y:.4,
        z:-(DIMENSION.PLANE.z+1)/2
    },
    PLAYER4 : {
        x:-1.5,
        y:.4,
        z:-(DIMENSION.PLANE.z+1)/2
    }
}

export const BACKGROUND = {
    DIMENSION :{
        x:900,
        y:100,
        z:100
    },
    SCALE: {
        x:-1,
        y:1,
        z:1
    }
}

export const TEXTURE  = 'default'

