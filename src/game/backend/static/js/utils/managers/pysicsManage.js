import { DIMENSION, POSITION } from "../../constants/components.js"
import { VELOCITY } from "../../constants/logic.js"

export default class physicsManager{
	constructor(components){
		this.components = components
		this.ball_velocity = VELOCITY.BALL
		this.score = {	p1 : 0,	p2 : 0	}

	}

	updateBallPosition(){
		this.components.bodies.ball.position.z += this.ball_velocity.z
		this.components.bodies.ball.position.x += this.ball_velocity.x
	}

	setupBallCollisionEvent(){
		this.components.bodies.ball.addEventListener('collide', (event)=>{
            if (event.body !=  this.components.bodies.plane )
                this.ball_velocity.z *= -1
        })
	}

	resetBall(){
		this.components.bodies.ball.position.set(...Object.values(POSITION.BALL))
	}

	checkBallPositionForScore() {
		let {ball} =  this.components.bodies
		if (ball.position.z > DIMENSION.PLANE.z/2) {
			this.resetBall()
			this.score.p1 += 1
		}
		if ( ball.position.z < -DIMENSION.PLANE.z/2) {
			this.resetBall()
			this.score.p2 += 1
		}
	}
	
	checkWallCollision(){
		if (Math.abs(this.components.bodies.ball.position.x) >= DIMENSION.PLANE.x/2)
			this.ball_velocity.x*= -1
	}
}

