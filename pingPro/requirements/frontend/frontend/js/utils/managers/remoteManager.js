import { ACTIONS } from "../../constants/logic.js"
import { WORLD } from "../../constants/engine.js"
import visualsManager from "../../utils/managers/visualManage.js"
import inputManager from "./inputManager.js"
import Engine from "../engine.js"
import Components from "../components.js"

export default class Remote{
    constructor( mode ){
		this.mode = mode

		this.engine = new Engine( this.mode )
		this.components = new Components(this.engine, this.mode)
		this.visual = new visualsManager(this.components, this.mode)
        this.input = new inputManager( this.components, this.mode )
    }

	setup(){
		this.engine.setup( )
		this.components.setup( )
		this.canva.add( 'waiting' )
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
    }

    updateConnection(  ){

    }

    updateState( data, id ){
		cancelAnimationFrame( id )
    }

    animate(  ) {
        let id = requestAnimationFrame( (  ) => this.animate() )
        this.engine.world.step( WORLD.TIMESTAMP) 
        
        this.update( id )

        this.engine.renderer.render(  this.engine.scene, this.engine.camera  );
    
    }

}
