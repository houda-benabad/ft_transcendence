import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';



export function  start(){


	let player_score = document.getElementById("player_score")
	let other_score = document.getElementById("other_score")
	let scores = document.getElementById("scores")

	let url = `ws://${window.location.host}/ws/game/`
	const gameSocket = new WebSocket(url)


	scores.style.display = "flex"
	
	let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	camera.position.z = 5;
	camera.position.y = 1;
	
	// RENDER
	const renderer = new THREE.WebGLRenderer(  );
	renderer.setSize( window.innerWidth, window.innerHeight  );
	renderer.shadowMap.enabled = true;
	document.body.appendChild( renderer.domElement )
	renderer.setAnimationLoop( animation );
	
	
	// SCENE
	const scene = new THREE.Scene(  );
	
	let ball, player, otherPlayer, plane;
	
	//PLANE
	plane = new THREE.Mesh(new THREE.BoxGeometry( 3, .2, 5 ), new THREE.MeshLambertMaterial( { color:0x005599 } ))
	
	// 	BALL
	ball = new THREE.Mesh( new THREE.SphereGeometry( .2, 32, 15 ), new THREE.MeshLambertMaterial( { color:0xffffff, wireframe: true} ))
	ball.position.set( 0, .8, 0 )
	
	// PLAYER
	player = new THREE.Mesh(new THREE.BoxGeometry( 1, .3, .3 ), new THREE.MeshLambertMaterial( { color:0xffffff } ))
	player.position.set( 0, .4 , 2.7 )
	
	
	//OTHERPLAYER
	otherPlayer =  new THREE.Mesh(new THREE.BoxGeometry( 1, .3, .3 ), new THREE.MeshLambertMaterial( { color:0x005500 } ))
	otherPlayer.position.set( 0, .4 , -2.7 )
	
	// ORBIT CONTROLER
	const orbit = new OrbitControls( camera, renderer.domElement )
	
	// HELPER
	const axesHelper = new THREE.AxesHelper(  5  );
	
	// LIGHT
	const light = new THREE.DirectionalLight(  0xffffff, 6  );
	light.castShadow = true
	light.position.y = 5;
	light.position.z = 5;
	
	// SCENE
	scene.add(  light  );
	scene.add(  axesHelper  );
	scene.add(  plane );
	scene.add(  player );
	scene.add(  otherPlayer );
	scene.add(  ball );
	
	window.addEventListener( 'resize', onWindowResize, false );
	
	function onWindowResize(){
		
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		
		renderer.setSize( window.innerWidth, window.innerHeight );
		
	}
	
	// WEBSOCKET CONNECTION
	gameSocket.onopen = function(e){
		console.log("CONECTION ESTABLISHED")
	}
	
	// KEY EVENT
	document.addEventListener('keydown', (event) => {
		gameSocket.send(JSON.stringify({
			'type': 'keycode',
			'data': event.keyCode
		}))
		console.log(event.keyCode);
	});
	
	// ANIMATION 
	function animation(  ){ 
		gameSocket.onmessage = function(e){
			let dataJson = JSON.parse(e.data)
			if (dataJson['type'] == "msg"){
				
				let coordinates = dataJson['data']
				
				ball.position.set(coordinates.ball.position[0], coordinates.ball.position[1], coordinates.ball.position[2])
				player.position.set(coordinates.player.position[0], coordinates.player.position[1], coordinates.player.position[2])
				otherPlayer.position.set(coordinates.otherPlayer.position[0], coordinates.otherPlayer.position[1], coordinates.otherPlayer.position[2])
				player_score.innerHTML = coordinates.player.score;
				other_score.innerHTML = coordinates.otherPlayer.score;

			}
			ball.rotation.x += 0.1
		}
		renderer.render( scene, camera );
	}
}