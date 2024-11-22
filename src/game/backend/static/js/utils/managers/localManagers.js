import { MODE, WORLD } from "../../constants/engine.js"
import Logic from "../../utils/logic.js"
import physicsManager from "../../utils/managers/pysicsManage.js"
import inputManager from "../../utils/managers/inputManager.js"
import stateManager from '../../utils/managers/stateManage.js'


export default class Local extends Logic {
	constructor( options ) {
        super( MODE.LOCAL, options )
		this.physics = new physicsManager( this.components )
		this.input = new inputManager( this.components )
		this.state = new stateManager( options )
	}

	setup(  ){
        super.setup(  )
		this.physics.setupBallCollisionEvent(  )
	}

	update(  ){
		this.input.movePlayers(   )
		this.physics.checkWallCollision(  )
		this.physics.checkBallPositionForScore(  )
		this.physics.updateBallPosition(  )	
		this.physics.setupBallCollisionEvent(  )
		super.update(  )
	}

	isGameover(  ){
		return this.state.isGameover( this.physics.score )
	}

	clean(){
		this.engine.clean(  )
	}

	animate(  resolve  ){
		let id = requestAnimationFrame( (  )=>this.animate( resolve ) )
		this.engine.world.step( WORLD.TIMESTAMP )
		
		this.update(  )
		if (  this.isGameover(   )  ){
			cancelAnimationFrame( id )
			resolve(    )
		}

		this.engine.renderer.render(  this.engine.scene, this.engine.camera  );
	}

}