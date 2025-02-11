import { DIMENSION, POSITION } from "../constants/components.js"
import { VELOCITY } from "../constants/logic.js"

export function getRandomFloat( min, max ) {
	return (Math.random() * (max - min) + min) > 0 ? 1 : -1;
}

export default class physicsManager{
	constructor( components ){
		this.components = components
		this.ball_velocity = VELOCITY.BALL
		this.score = {	p1 : 0,	p2 : 0	}

	}

	updateBallPosition(  ){
		this.components.bodies.ball.position.z += this.ball_velocity.z
		this.components.bodies.ball.position.x += this.ball_velocity.x
	}

	setupBallCollisionEvent(  ){
		this.components.bodies.ball.addEventListener( 'collide', ( event )=>{
			console.log("Collision with:", event.body);
			if ( event.body !=  this.components.bodies.plane ){
				if ( event.body == this.components.bodies.player1 || event.body == this.components.bodies.player2 ){

					this.ball_velocity.z *= -1
					if ( Math.abs( this.ball_velocity.z ) < .8 )
						this.ball_velocity.z += .005 * ( this.ball_velocity.z > 0 ? 1 : -1 )
				}
				else if ( event.body == this.components.bodies.banner1 || event.body == this.components.bodies.banner2 ){
						this.ball_velocity.x*= -1
				}
			}
        } )
	}

	resetBall(  ){
		this.components.bodies.ball.position.set(0, 0.5, 0)
		this.ball_velocity = {
			x: 0.03,
			y:0,
			z:0.05
		}
		let x = ( getRandomFloat(-2, 2) > 0 ? 1 : -1)
		let z = ( getRandomFloat(-2, 2) > 0 ? 1 : -1)
		this.ball_velocity.z *= z
		this.ball_velocity.x *= x
	}

	checkBallPositionForScore(  ) {
		let {ball} =  this.components.bodies
		if ( ball.position.z > DIMENSION.PLANE.z/2 ) {
			this.resetBall(  )
			this.score.p2 += 1
		}
		if (  ball.position.z < -DIMENSION.PLANE.z/2 ) {
			this.resetBall(  )
			this.score.p1 += 1
		}
	}
	
	checkWallCollision(  ){
		// if ( Math.abs( this.components.bodies.ball.position.x ) >= DIMENSION.PLANE.x/2 )
		// 	this.ball_velocity.x*= -1
	}
}

