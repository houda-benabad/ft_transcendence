import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { MODE, WORLD } from "../../constants/engine.js"
import physicsManager from "./physicsManager.js"
import inputManager from "../../utils/managers/inputManager.js"
import stateManager from '../../utils/managers/stateManager.js'
import Engine from '../engine.js'
import appCanva from "./canvaManager.js"
import Components from '../components.js'
import visualsManager from './visualManager.js'


export default class Local{
	constructor( options ) {
		this.options = options
		this.animationProgress = 0

		this.engine = new Engine( MODE.LOCAL )
		this.components = new Components(this.engine, MODE.LOCAL, options)
		this.visual = new visualsManager(this.components, MODE.LOCAL)
		this.input = new inputManager( this.components )
		this.canva = new appCanva()

		this.physics = new physicsManager( this.components )
		this.state = new stateManager( options )

	}

	setup(  ){
        this.engine.setup( )
		this.components.setup( )
		this.canva.add( 'score' )
		
		this.physics.setupBallCollisionEvent(  )
		if (this.options.mode == 'time' )
			this.canva.add( 'time' )

		this.cameraTarget = new THREE.Vector3( 0, 5, 0 );
		this.cameraInitial = new THREE.Vector3().copy(this.engine.camera.position);
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
		this.visual.updatePosition()


		this.canva.update( 'score', this.getScore(  ) )
		if (this.options.mode == 'time' )
			this.canva.update( 'time', this.getTime(  ) )
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
		
		if (this.animationProgress < 1)
		{
			this.initialAnimation(  )
			if ( this.animationProgress >= 1)
				this.state.setup(  )
		}
		else{
			this.update(  )
			if (  this.isGameover(   )  ){
				cancelAnimationFrame( id )
				resolve(  )
			}
		}
		this.engine.renderer.render(  this.engine.scene, this.engine.camera  );

	}

	initialAnimation(){
		this.animationProgress += 0.005;
		this.engine.camera.position.lerpVectors( this.cameraInitial,  this.cameraTarget,  this.animationProgress )
		this.engine.camera.lookAt( this.engine.scene.position )
	}

}