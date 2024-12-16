import { MODE } from "../../constants/engine.js";

export default class visualsManager {
	constructor( components, mode ) {
		this.components = components
		this.mode = mode
	}

		// for remote
		updateCoordinates( data ) {
			const { ball } = this.components.bodies;
			ball.position.x = data.ball.position[0];
			ball.position.z = data.ball.position[1];
	
			const { bodies } = this.components;

			const playerNumber = Object.keys( data ).length - 1
			for (  let i =0; i< playerNumber; i++  ){
				bodies[ `player${i+1}` ].position.x = data[ `p${i+1}` ].position[0]
			}

		}
		
		// FOR LOCAL
		updatePosition(  ){
			const { bodies, objects } = this.components;
			const playerNumber = Object.keys( objects ).length - 2

			for ( let i =0; i< playerNumber; i++ ){
				objects[ `player${i+1}` ].position.copy( bodies[ `player${i+1}` ].position );
				objects[ `player${i+1}` ].quaternion.copy( bodies[ `player${i+1}` ].quaternion );
			}

			this.components.objects.ball.position.copy( this.components.bodies.ball.position );
			this.components.objects.ball.quaternion.copy( this.components.bodies.ball.quaternion );
		}

}