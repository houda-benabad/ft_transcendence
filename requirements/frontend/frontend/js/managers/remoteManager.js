import { ACTIONS } from "../constants/logic.js"
import { WORLD } from "../constants/engine.js"
import visualsManager from "./visualManager.js"
import inputManager from "./inputManager.js"
import Engine from "../utils/engine.js"
import Components from "../utils/components.js"
import appCanva from "./canvaManager.js"
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'


export default class Remote{
	constructor( mode ){
		this.mode = mode
		this.animationProgress = 0

		this.engine = new Engine( this.mode )
		this.components = new Components(this.engine, this.mode)
		this.visual = new visualsManager(this.components, this.mode)
		this.input = new inputManager( this.components, this.mode )
		this.canva = new appCanva( ["player1", "player2"] )
	}

	setup(){
		this.engine.setup( )
		this.components.setup( )
		this.canva.add( 'waiting' )
		this.cameraTarget = new THREE.Vector3( 0, 5, 0 );
		this.cameraInitial = new THREE.Vector3().copy(this.engine.camera.position);
	}

	update( id ){

		this.engine.socket.onmessage = ( e ) => this.updateData( e, id )
		this.input.movePlayers( this.engine.socket )
		this.visual.updatePosition( )

	}

	updateData( e, id ){
		const { type, data } = JSON.parse( e.data )
		this[ACTIONS[type]]( data, id)
	}

	updateApi( data ){
		this.visual.updateCoordinates( data.coordinates )
	}

	updateScore( data ){
		this.canva.update( 'score', data )
	}

	updateStart(  ){
		this.canva.add( "score" )
		this.canva.remove( "waiting" )
	}

	updateState( data, id ){
		cancelAnimationFrame( id )
	}

	initialAnimation(){
		this.animationProgress += 0.005;
		this.engine.camera.position.lerpVectors( this.cameraInitial,  this.cameraTarget,  this.animationProgress )
		this.engine.camera.lookAt( this.engine.scene.position )
	}

	animate(  ) {
		let id = requestAnimationFrame( (  ) => this.animate() )
		this.engine.world.step( WORLD.TIMESTAMP) 

		if (this.animationProgress < 1)
			this.initialAnimation(  )
		else
			this.update( id )
		this.engine.renderer.render(  this.engine.scene, this.engine.camera  );
	
	}

}
