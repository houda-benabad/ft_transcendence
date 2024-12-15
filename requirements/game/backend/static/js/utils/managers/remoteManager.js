import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { ACTIONS } from "../../constants/logic.js"
import { WORLD } from "../../constants/engine.js"
import visualsManager from "../../utils/managers/visualManager.js"
import inputManager from "./inputManager.js"
import Engine from "../engine.js"
import Components from "../components.js"
import appCanva from "./canvaManager.js"

export default class Remote{
    constructor( mode ){
		this.mode = mode
        this.start = false

		this.engine = new Engine( this.mode )
		this.components = new Components(this.engine, this.mode)
		this.visual = new visualsManager(this.components, this.mode)
        this.input = new inputManager( this.components, this.mode )

        this.canva = new appCanva(  )
        this.animationProgress = 0
    }

	setup(){
		this.engine.setup( )
		this.components.setup( )
		this.canva.add( 'waiting' )

        this.cameraTarget = new THREE.Vector3( 0, 5, 0 );
		this.cameraInitial = new THREE.Vector3().copy(this.engine.camera.position);

	}

    update( id, resolve ){

		this.engine.socket.onmessage = ( e ) => this.updateData( e, id, resolve )
        this.input.movePlayers( this.engine.socket )
		this.visual.updatePosition( )

    }

    updateData( e, id , resolve){
        const { type, data } = JSON.parse( e.data )
        this[ACTIONS[type]]( data, id, resolve)
    }

    updateApi( data ){
        this.canva.remove( 'waiting' )
        this.canva.add( 'score' )
        this.visual.updateCoordinates( data.coordinates )
    }

    updateStart(){
        // this.start = true
    } 

    updateScore( data ){
        this.canva.update( 'score' , data)
    }

    updateConnection(  ){
        this.start = true
    }

    updateState( data, id, resolve ){
		cancelAnimationFrame( id )
        resolve( data )
    }

    initialAnimation(){
		this.animationProgress += 0.005;
		this.engine.camera.position.lerpVectors( this.cameraInitial,  this.cameraTarget,  this.animationProgress )
		this.engine.camera.lookAt( this.engine.scene.position )
	}

    animate( resolve ) {
        let id = requestAnimationFrame( (  ) => this.animate( resolve ) )
        this.engine.world.step( WORLD.TIMESTAMP) 
        if (this.start && this.animationProgress < 1)
            this.initialAnimation(  )
        else
            this.update( id, resolve )

        this.engine.renderer.render(  this.engine.scene, this.engine.camera  );
    
    }

}
