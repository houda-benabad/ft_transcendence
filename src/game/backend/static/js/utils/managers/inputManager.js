import { DIMENSION, POSITION } from "../../constants/components.js"
import { MODE } from "../../constants/engine.js"
import { KEYS, VELOCITY } from "../../constants/logic.js"

export default class inputManager{
	constructor( components, mode ){
		this.keys = {}
		this.bounds = {
			max : DIMENSION.PLANE.x /2 - DIMENSION.PLAYER.x/2,
			min : -DIMENSION.PLANE.x/2 + DIMENSION.PLAYER.x/2
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
		if ( this.keys[KEYS.LEFTARROW] && player1.position.x > this.bounds.min )  player1.position.x -= VELOCITY.PLAYER
		if ( this.keys[KEYS.RIGHTARROW] && player1.position.x < this.bounds.max ) player1.position.x += VELOCITY.PLAYER

		if ( this.keys[KEYS.A] && player2.position.x > this.bounds.min ) player2.position.x -= VELOCITY.PLAYER
		if ( this.keys[KEYS.D] && player2.position.x < this.bounds.max ) player2.position.x += VELOCITY.PLAYER
	}
2
	remoteMovements(  socket  ){
		if ( this.keys[KEYS.LEFTARROW] ){
			socket.send( JSON.stringify( {
				'type': 'keycode',
				'data': KEYS.LEFTARROW
			} ) )
		}
		if (  this.keys[KEYS.RIGHTARROW]  ){
			socket.send( JSON.stringify( {
				'type': 'keycode',
				'data': KEYS.RIGHTARROW
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
