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
		x:10,
		y:0,
		z:0
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
	TOURNAMENT : 'tournament'
}

export const MOUSE = {
	LEFT : '../assets/componants/left_btn.png',
	RIGHT : '../assets/componants/right_btn.png',
	SCROL : '../assets/componants/scroll.png',
}

export const KEYBOARD = {
	W : '../assets/componants/wkey.png',
	S : '../assets/componants/skey.png',
	UP : '../assets/componants/upArrow.png',
	DOWN : '../assets/componants/downArrow.png',
}

export const SCORE = '../assets/componants/10.png'