import { ACTIONS } from "../constants/logic.js"
import visualsManager from "./visualManager.js"
import inputManager from "./inputManager.js"
import Engine from "../utils/engine.js"
import Components from "../utils/components.js"
import appCanva from "./canvaManager.js"
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { modalService } from "../services/modalService.js"
import { MODE, WORLD } from "../constants/engine.js"
// import { router } from '../utils/global.js'
import { reset } from '../utils/utils.js'
import { globalManager } from "./globalManager.js"




export default class Remote{
	constructor( mode ){
		this.mode = mode
		this.animationProgress = 0

		this.engine = new Engine( this.mode )
		this.components = new Components(this.engine, this.mode)
		this.visual = new visualsManager(this.components, this.mode)
		this.input = new inputManager( this.components, this.mode )
		if( this.mode == MODE.REMOTE )
			this.canva = new appCanva( ["player1", "player2"] )
		else
			this.canva = new appCanva( ["team1", "team2"] )
	}

	setup( resolve ){
		this.engine.setup( )
		this.components.setup( )
		this.canva.add( 'waiting' )
		document.getElementById( "cancel-btn" ).addEventListener( 'click', async ( )=>{
			this.socket.close( 4000 )
			await reset(  )
			globalManager._router.navigateTo( '/' )
		} )
		this.socket  = this.setupSocket( resolve )
		this.cameraTarget = new THREE.Vector3( 0, 5, 0 );
		this.cameraInitial = new THREE.Vector3().copy(this.engine.camera.position);
	}

	setupSocket( resolve ) {
		let url = `wss://${window.location.host}/wss/${this.mode}`
		const token = globalManager._tokenService.accessToken 
		let socket = new WebSocket( url )
		socket.onopen = ( ) =>{
			socket.send( JSON.stringify( { 'type' : 'auth', 'data': token} ) )
		}
		socket.onclose =   ( e ) =>{ console.log( "closing = ", e.reason ) }
		socket.onmessage = ( e ) => this.updateData( e, resolve )
		console.log( "resolve = ", typeof( resolve ))
		return socket
	}

	update(  ){
		this.input.movePlayers( this.socket )
		this.visual.updatePosition( )

	}

	updateData( e,  resolve ){
		const { type, data } = JSON.parse( e.data )
		this[ACTIONS[type]]( data,  resolve)
	}

	handleError( data ){
		console.log("handlin error, = ", data)
	}

	updateApi( data ){
		this.visual.updateCoordinates( data )
	}

	updateScore( data ){
		this.canva.update( 'score', data )
	}

	updateStart(  ){
		this.canva.add( "score" )
		this.canva.remove( "waiting" )
	}

	updateState( data, resolve ){
		console.log( "result = ", data )

		resolve( data )
		cancelAnimationFrame( this.id )
	}

	initialAnimation(){
		this.animationProgress += 0.005;
		this.engine.camera.position.lerpVectors( this.cameraInitial,  this.cameraTarget,  this.animationProgress )
		this.engine.camera.lookAt( this.engine.scene.position )
	}

	animate(  ) {
		this.id = requestAnimationFrame( (  ) => this.animate(  ) )
		this.engine.world.step( WORLD.TIMESTAMP) 
		if ( this.animationProgress < 1 )
			this.initialAnimation(  )
		else
			this.update( this.id )
		this.engine.renderer.render(  this.engine.scene, this.engine.camera  );
	
	}

}
