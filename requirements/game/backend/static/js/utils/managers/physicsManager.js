import { DIMENSION, POSITION } from "../../constants/components.js"
import { VELOCITY } from "../../constants/logic.js"
import { MAXVELOCITY } from "../../constants/logic.js";


export default class physicsManager{
	constructor(components){
		this.components = components
		this.ball_velocity = VELOCITY.BALL
		this.userInfo = {
			p1 : {
				score : 0,
				name : 'user1'
			},
			p2 :{
				score : 0,
				name: 'user2'
			}
		}
	}

	getDirection() {
		return (Math.random() % 2 == 0) ? -1 : 1
	}

	updateBallPosition(){
		this.components.bodies.ball.position.z += this.ball_velocity.z
		this.components.bodies.ball.position.x += this.ball_velocity.x
	}

	setupBallCollisionEvent(){
		this.components.bodies.ball.addEventListener('collide', (event)=>{
			if (event.body !=  this.components.bodies.plane){
				this.ball_velocity.z *= -1
				if (Math.abs(this.ball_velocity.z) < MAXVELOCITY)
					this.ball_velocity.z += .005 * (this.ball_velocity.z > 0 ? 1 : -1)
			}
        })
	}

	resetBall(){
		this.components.bodies.ball.position.set(0,.2,0)
		this.ball_velocity = VELOCITY.BALL
		this.ball_velocity.z *= this.getDirection(  )
		this.ball_velocity.x *= this.getDirection(  )
	}

	checkBallPositionForScore() {
		let {ball} =  this.components.bodies
		if (ball.position.z > DIMENSION.PLANE.z/2) {
			this.resetBall()
			this.userInfo.p2.score += 1
		}
		if ( ball.position.z < -DIMENSION.PLANE.z/2) {
			this.resetBall()
			this.userInfo.p1.score += 1
		}
	}
	
	checkWallCollision(){
		if (Math.abs(this.components.bodies.ball.position.x) >= DIMENSION.PLANE.x/2)
			this.ball_velocity.x*= -1
	}
}

