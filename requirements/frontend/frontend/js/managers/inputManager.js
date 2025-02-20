import { DIMENSION, POSITION } from "../constants/components.js"
import { MODE } from "../constants/engine.js"
import { KEYS, VELOCITY } from "../constants/logic.js"
import { eventListeners } from "../managers/globalManager.js"

export default class inputManager{
	constructor( components, mode ){
		this.keys = {}
		this.bounds = {
			max : DIMENSION.PLANE.x /2 - DIMENSION.PLAYER.x/2 - .1,
			min : -DIMENSION.PLANE.x/2 + DIMENSION.PLAYER.x/2 + .1
		}
		this.mode = mode
		this.components = components
		this.setupEventListeners(  )
	}
	setupEventListeners(  ){
		eventListeners.on(document,'keydown', ( event ) => { this.keys[event.keyCode] = true } )
		eventListeners.on(document, 'keyup', ( event ) => { this.keys[event.keyCode] = false } )
	}
	localMovements(  ){
		let {player1 , player2} = this.components.bodies
		if ( this.keys[KEYS.DOWN] && player2.position.x < this.bounds.max  )  player2.position.x += VELOCITY.PLAYER
		if ( this.keys[KEYS.UP] && player2.position.x > this.bounds.min ) player2.position.x -= VELOCITY.PLAYER

		if ( this.keys[KEYS.S] && player1.position.x < this.bounds.max ) player1.position.x += VELOCITY.PLAYER
		if ( this.keys[KEYS.W] && player1.position.x > this.bounds.min ) player1.position.x -= VELOCITY.PLAYER
	}
	remoteMovements(  socket  ){
		if ( this.keys[KEYS.UP] ){
			socket.send( JSON.stringify( {
				'type': 'keycode',
				'data': KEYS.UP
			} ) )
		}
		if (  this.keys[KEYS.DOWN]  ){
			socket.send( JSON.stringify( {
				'type': 'keycode',
				'data': KEYS.DOWN
			} ) )
		}
	}
	movePlayers(  socket  ) {
		if ( this.mode == MODE.REMOTE || this.mode == MODE.MULTIPLAYER )
			this.remoteMovements(  socket  ) 
		else 
			this.localMovements(  )
	
	}

}