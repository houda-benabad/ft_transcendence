import { MODE, WORLD } from "../../constants/engine.js"
import Logic from "../../utils/logic.js"
import physicsManager from "../../utils/managers/pysicsManage.js"
import inputManager from "../../utils/managers/inputManager.js"
import stateManager from '../../utils/managers/stateManage.js'
import appCanva from "./canvaManager.js"

export default class Local extends Logic {
	constructor( options ) {
        super( MODE.LOCAL, options )
		this.canva = new appCanva()
		this.options = options
		this.physics = new physicsManager( this.components )
		this.input = new inputManager( this.components )
		this.state = new stateManager( options )
	}

	setup(  ){
        super.setup(  )
		this.canva.add( 'score' )
		if (this.options.mode == 'time' )
			this.canva.add( 'time' )
		this.physics.setupBallCollisionEvent(  )
	}

	getScore(  ){
		return this.physics.score
	}

	getTime(  ){
		return this.state.timeElapsed
	}

	update(  ){
		this.input.movePlayers(   )
		this.physics.checkWallCollision(  )
		this.physics.checkBallPositionForScore(  )
		this.physics.updateBallPosition(  )	
		this.canva.update( 'score', this.getScore(  ) )
		if (this.options.mode == 'time' )
			this.canva.update( 'time', this.getTime(  ) )
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
			resolve(  this  )
		}

		this.engine.renderer.render(  this.engine.scene, this.engine.camera  );
	}

}