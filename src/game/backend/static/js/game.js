import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { getBackToHome } from './services/tools.js';

const PLAYER_GEO = new THREE.BoxGeometry(1, .3, .1)
const BALL_GEO = new THREE.SphereGeometry(.1, 32, 15)

export function socketSetup() {
	let url = `ws://${window.location.host}/ws/game/`
	const gameSocket = new WebSocket(url)
	const keyState = {}

	document.addEventListener('keydown', (event) => { keyState[event.code] = true })
	document.addEventListener('keyup', (event) => { keyState[event.code] = false })

	document.addEventListener('keydown', (event) => {
		gameSocket.send(JSON.stringify({
			'type': 'keycode',
			'data': event.keyCode
		}))
	});

	return gameSocket
}

export function setup_canva() {
	let canva = document.getElementById("app");

	let gameElements = document.createElement('div')
	gameElements.id = 'game-elements'

	gameElements.innerHTML = `
        <div class="score">
            <div class="user glass">
                <h3 id="user1">hajar</h3>
            </div>
            <div class="score-num glass">
                <h1 id="score">0 : 0</h1>
            </div>
            <div class="user glass">
                <h3 id="user2">kouaz</h3>
            </div>
        </div>
		<div class="waiting-holder">
			<div class="waiting-pop glass">
				<h1>Waiting for other player...</h1>
				<div id="loader"></div>
				<button id="cancel-btn">Cancel</button>
			</div>
		</div>
		<div class="time glass">
			<h1 id="time">00:05</h1>
		</div>
        <div class="endGame-pop glass">
            <h3>YOU <span id="status">WON</span>!</h3>
        </div>
	`
	canva.append(gameElements)
	document.querySelector('.score').style.display = 'none'
	document.querySelector('.time').style.display = 'none'
	document.querySelector('.endGame-pop').style.transform = 'scale(0)'
	document.getElementById('cancel-btn').addEventListener('click', ()=>{
		getBackToHome()
	})
}

export function update_canva(data) {
	document.querySelector('.waiting-holder').style.transform = 'scale(0)'
	
	document.querySelector('.score').style.display = 'flex'
	document.getElementById('user1').innerHTML = data.coordinates.player.name
	document.getElementById('user2').innerHTML = data.coordinates.otherPlayer.name
	let score_html = `${data.coordinates.player.score} : ${data.coordinates.otherPlayer.score}`
	document.getElementById('score').innerHTML = score_html
	if (data.time){
		document.querySelector('.time').style.display = 'flex'
		document.getElementById('time').innerHTML = data.time
	}

}

export function sceneSetup(scene, camera, renderer, background) {
	camera.position.z = 20;
	camera.rotation.y = -Math.PI


	// RENDERER
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.getElementById('game-elements').appendChild(renderer.domElement)

	// ORBIT CONTROLER
	const orbit = new OrbitControls(camera, renderer.domElement)


	// LIGHT
	const light = new THREE.DirectionalLight(0xffffff, 6);
	light.castShadow = true
	light.position.y = 5;
	light.position.z = 5;

	// WINDOW
	window.addEventListener('resize', onWindowResize, false);

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}
	// ADD TO SCENE
	scene.add(light)
	
	const geometry = new THREE.SphereGeometry(8, 128, 128);
	geometry.scale(-1, 1, 1);
	
	const textureLoader = new THREE.TextureLoader();
	textureLoader.load(
		`static/img/background/${background}.png`,
		(texture) => {
			texture.encoding = THREE.sRGBEncoding;
			texture.minFilter = THREE.LinearMipmapLinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
			
			const material = new THREE.MeshBasicMaterial({ map: texture });
			const sphere = new THREE.Mesh(geometry, material);
			scene.add(sphere);
		},
		undefined,
		(error) => {
			console.error('An error occurred while loading the texture:', error);
		}
	);
	

}

export function create_objects(scene, texture) {
	let ball, player, otherPlayer, plane;

	//PLANE
	plane = new THREE.Mesh(new THREE.BoxGeometry(3, .2, 5), new THREE.MeshLambertMaterial({ color: 0x5F1584 }))

	// 	BALL
	if (texture == 'default')
		ball = new THREE.Mesh(BALL_GEO, new THREE.MeshLambertMaterial({ color: 0xD43ADF }))
	else {
		const textureLoader = new THREE.TextureLoader().load(`static/img/texture/${texture}.png`);
		ball = new THREE.Mesh(BALL_GEO, new THREE.MeshStandardMaterial({ map : textureLoader }))
	}
	ball.position.set(0, .8, 0)

	// PLAYER
	player = new THREE.Mesh(PLAYER_GEO, new THREE.MeshLambertMaterial({ color: 0x8C96ED }))
	player.position.set(0, .4, 2.45)


	//OTHERPLAYER
	otherPlayer = new THREE.Mesh(PLAYER_GEO, new THREE.MeshLambertMaterial({ color: 0xE4E6FB }))
	otherPlayer.position.set(0, .4, -2.45)

	scene.add(plane);
	scene.add(player);
	scene.add(otherPlayer);
	scene.add(ball);
	return { ball, player, otherPlayer, plane }
}

export function create_bodies(world){
	let player = create_player([0.5, .15, 0.05], [0, .25, 2.45], world)

	// OTHERPLAYER BODY
	let otherPlayer = create_player([0.5, .15, 0.05], [0, .25, -2.45], world)

	const ball = new CANNON.Body({
		shape: new CANNON.Sphere(.1),
		mass: 1,
		position: new CANNON.Vec3(0, .8, 0),
	  });
	  world.addBody(ball);

	const groundBody = new CANNON.Body({
		shape: new CANNON.Plane(),
		type: CANNON.Body.STATIC,
		position: new CANNON.Vec3(0, 0.1, 0),
	});
	groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); 
	world.addBody(groundBody);

	return {player, otherPlayer, ball}
}

export function create_player(dimension, position, world){
	const Shape = new CANNON.Box(new CANNON.Vec3(...dimension));
	const Body = new CANNON.Body({
	  mass: 0,
	  position: new CANNON.Vec3(...position),
	});
	Body.addShape(Shape);
	Body.fixedRotation = true;
	world.addBody(Body);
	return Body
}

export function update_position(gameObjects, gameBodies){
	gameObjects.player.position.copy(gameBodies.player.position);
	gameObjects.player.quaternion.copy(gameBodies.player.quaternion);

	gameObjects.otherPlayer.position.copy(gameBodies.otherPlayer.position);
	gameObjects.otherPlayer.quaternion.copy(gameBodies.otherPlayer.quaternion);

	gameObjects.ball.position.copy(gameBodies.ball.position);
	gameObjects.ball.quaternion.copy(gameBodies.ball.quaternion);
}

export function update_coordinates(gameBodies, coordinates) {
	const { ball } = gameBodies;
	ball.position.x = coordinates.ball.position[0];
	ball.position.z = coordinates.ball.position[1];
	const { player, otherPlayer } = gameBodies;
	player.position.x = coordinates.player.position[0];
	player.position.z = coordinates.player.position[1];

	otherPlayer.position.x = coordinates.otherPlayer.position[0];
	otherPlayer.position.z = coordinates.otherPlayer.position[1];
}

export function cleanupScene(scene, renderer, world) {
    scene.traverse((object) => {
        if (object.geometry) {
            object.geometry.dispose();
        }
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
    });

    while(scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    while(world.bodies.length > 0) {
        world.removeBody(world.bodies[0]);
    }

    renderer.dispose();

    renderer.domElement.remove();
}
