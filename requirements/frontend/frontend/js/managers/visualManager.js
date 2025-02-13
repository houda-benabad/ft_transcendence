export default class visualsManager {
	constructor( components, mode ) {
		this.components = components
		this.mode = mode
	}

		updateCoordinates( data ) {
			const { bodies } = this.components;
			const { objects } = this.components;


			bodies.ball.position.x = data.ball.position[0];
			bodies.ball.position.z = data.ball.position[2];
			objects.ball.position.copy( bodies.ball.position );
	

			const playerNumber = Object.keys( data ).length - 1
			for (  let i =0; i< playerNumber; i++  ){
				bodies[ `player${i+1}` ].position.x = data[ `p${i+1}` ].position[0]
				objects[ `player${i+1}` ].position.copy( bodies[ `player${i+1}` ].position );
			}

		}
		
		updatePosition(  ){
			const { bodies, objects } = this.components;
			const playerNumber = 2
			for ( let i =0; i< playerNumber; i++ ){
				objects[ `player${i+1}` ].position.copy( bodies[ `player${i+1}` ].position );
				objects[ `player${i+1}` ].quaternion.copy( bodies[ `player${i+1}` ].quaternion );
			}
			const bannerNumber = 2
			for ( let i =0; i< bannerNumber; i++ ){
				objects[ `banner${i+1}` ].position.copy( bodies[ `banner${i+1}` ].position );
				objects[ `banner${i+1}` ].quaternion.copy( bodies[ `banner${i+1}` ].quaternion );
			}

			this.components.objects.ball.position.copy( this.components.bodies.ball.position );
			this.components.objects.ball.quaternion.copy( this.components.bodies.ball.quaternion );
		}

}