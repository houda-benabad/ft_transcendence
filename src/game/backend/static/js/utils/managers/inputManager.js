import { DIMENSION, POSITION } from "../../constants/components.js"
import { MODE } from "../../constants/engine.js"
import { VELOCITY } from "../../constants/logic.js"

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
		eventListeners.on(document,'keydown', ( event ) => { this.keys[event.code] = true } )
		eventListeners.on(document, 'keyup', ( event ) => { this.keys[event.code] = false } )
	}

	localMovements(  ){
		let {player1 , player2} = this.components.bodies
		if ( this.keys['ArrowLeft'] && player1.position.x > this.bounds.min )  player1.position.x -= VELOCITY.PLAYER
		if ( this.keys['ArrowRight'] && player1.position.x < this.bounds.max ) player1.position.x += VELOCITY.PLAYER

		if ( this.keys['KeyA'] && player2.position.x > this.bounds.min ) player2.position.x -= VELOCITY.PLAYER
		if ( this.keys['KeyD'] && player2.position.x < this.bounds.max ) player2.position.x += VELOCITY.PLAYER
	}
2
	remoteMovements(  socket  ){
		if ( this.keys['ArrowLeft'] ){
			socket.send( JSON.stringify( {
				'type': 'keycode',
				'data': 37
			} ) )
		}
		if (  this.keys['ArrowRight']  ){
			socket.send( JSON.stringify( {
				'type': 'keycode',
				'data': 39
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
