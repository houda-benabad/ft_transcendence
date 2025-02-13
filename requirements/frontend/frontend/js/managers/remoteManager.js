import { ACTIONS } from "../constants/logic.js"
import visualsManager from "./visualManager.js"
import inputManager from "./inputManager.js"
import Engine from "../utils/engine.js"
import Components from "../utils/components.js"
import appCanva from "./canvaManager.js"
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { MODE, WORLD } from "../constants/engine.js"
import { reset, tokenExpired } from '../utils/utils.js'
import { tokenService } from "./globalManager.js"
import { modalService } from "../services/modalService.js"
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
		this.resolve = resolve
		this.engine.setup( )
		this.components.setup( )
		this.canva.add( 'waiting' )
		this.socket  = this._setupSocket( this.resolve )
		this.cameraTarget = new THREE.Vector3( 0, 5, 0 );
		this.cameraInitial = new THREE.Vector3().copy(this.engine.camera.position);
		document.getElementById( "cancel-btn" ).addEventListener( 'click', this._handle_cancel_btn.bind(this))
	}

	async _handle_socket_error( e ){
		switch( e.code ){
			case 4000:
				tokenExpired( this._setupSocket.bind(this) )
				break;
			case 3000:
				await reset(  )
				await modalService.show( `Error Ocurred During Game, Please try again later` )
				await reset(  )
				globalManager._router.navigateTo( '/' )
				break;
		}
	}

	async _handle_cancel_btn( ){
		document.getElementById( "cancel-btn" ).removeEventListener( 'click',  this._handle_cancel_btn)
		this.socket.close( 4000 )
		setTimeout( async () =>{
			await reset(  )
			globalManager._router.navigateTo( '/' )
			
		}, 100)  
	}

	_setupSocket(  ) {
		const token = tokenService.accessToken 
		let url = `wss://${window.location.host}/wss/${this.mode}?token=${token}`
		let socket = new WebSocket( url )
		socket.onopen = ( ) =>{
			socket.send( JSON.stringify( { 'type' : 'auth', 'data': token} ) )
			document.getElementById( "cancel-btn" ).addEventListener( 'click', this._handle_cancel_btn.bind(this))
		}
		socket.onclose =   async ( e ) => await this._handle_socket_error( e)
		socket.onmessage = ( e ) => this.updateData( e, this.resolve )

		return socket
	}

	update(  ){
		this.input.movePlayers( this.socket )
		// this.visual.updatePosition( )

	}

	updateData( e,  resolve ){
		const { type, data, author } = JSON.parse( e.data )
		this[ACTIONS[type]]( data,  resolve, author)
	}

	handleError( data ){
	}

	updateApi( data ){
		this.visual.updateCoordinates( data )
	}

	updateScore( data, author ){
		this.canva.update( 'score', data, author )
	}

	updateStart( data ){
		console.log( "data = ", data  )
		if (this.mode == MODE.REMOTE)
			this.canva.setup(  data, MODE.REMOTE, data.author )
		else
			this.canva.setup( data, MODE.MULTIPLAYER, data.author )

		this.canva.add( "score" )
		this.canva.remove( "waiting" )
	}

	updateState( data, resolve ){

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
