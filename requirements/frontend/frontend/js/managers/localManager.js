import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { MODE, WORLD } from "../constants/engine.js"
import physicsManager from "./physicsManager.js"
import inputManager from "./inputManager.js"
import stateManager from './stateManager.js'
import Engine from '../utils/engine.js'
import appCanva from "./canvaManager.js"
import Components from '../utils/components.js'
import visualsManager from './visualManager.js'
import { setIsItOutOfGame, getIsItOutOfGame } from './globalManager.js'


export default class Local{
	constructor( options, players ) {
		this.options = options
		this.animationProgress = 0
		this.players = players
		this.winner = ""
		this.isAnimating = true

		this.engine = new Engine( MODE.LOCAL )
		this.components = new Components(this.engine, MODE.LOCAL, options)
		this.visual = new visualsManager(this.components, MODE.LOCAL)
		this.input = new inputManager( this.components, MODE.LOCAL )
		this.canva = new appCanva( this.players )

		this.physics = new physicsManager( this.components )
		this.state = new stateManager( options )

	}

	setup(  ){
        this.engine.setup( )
		this.components.setup( )
		
		
		this.canva.add( 'score')
		if (this.options.mode == 'time' )
			this.canva.add( 'time' )

		this.physics.setupBallCollisionEvent(  )
	}

	getScore(  ){
		return { 
			score : this.physics.score,
			name: {
				p1: this.players[0],
				p2: this.players[1]
			}
		}

	}

	getTime(  ){
		return this.state.timeElapsed 
	}

	update(  ){
		this.input.movePlayers(   )
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

	animate( resolve  ){
		let id = requestAnimationFrame( (  )=>this.animate( resolve ) )
		this.engine.world.step( WORLD.TIMESTAMP )
		if (  this.isGameover(   ) || getIsItOutOfGame() == true  ){
			this.physics.score.p1 > this.physics.score.p2 ? this.winner = this.players[0] : this.winner = this.players[1]
			cancelAnimationFrame( id )
			if (getIsItOutOfGame() == true)
				return resolve(  )
			return resolve( this.winner )
		}
		else if (this.animationProgress < 1 && getIsItOutOfGame() == false  )
			this.initialAnimation(  )
		else if (this.animationProgress > 1  && this.animationProgress < 5  && getIsItOutOfGame() == false  ){
			this.engine.setupControls()
			this.animationProgress = 5
		}
		else
			this.update(  )
		this.engine.renderer.render(  this.engine.scene, this.engine.camera  );

	}

	initialAnimation(){
		this.engine.camera.position.x -= this.animationProgress * .05
		this.engine.camera.position.y += this.animationProgress * .05
		this.animationProgress += 0.005;
		this.engine.camera.lookAt( this.engine.scene.position )
	}

}