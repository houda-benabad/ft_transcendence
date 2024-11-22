export const WORLD = {
	GRAVITY : -9.81,
	TIMESTAMP : 1/60,
	ITERATION : 10
}

export const CAMERA = {
	FIELDOFWIEW : 74,
	FAR : 1000,
	NEAR : .1,
	ASPECTRATIO : window.innerWidth / window.innerHeight,
	INITIALPOSITION : {
		x:0,
		y:0,
		z:20
	}
}

export const LIGHT ={
	COLOR : 0xffffff,
	INTENSITY : 6,
	POSITION : {
		x:0,
		y:5,
		z:5
	}
}

export const MODE = {
	LOCAL : 'local',
	REMOTE : 'remote',
	MULTIPLAYER : 'multiplayer',
	TOURNAMRNT : 'tourn'
}
