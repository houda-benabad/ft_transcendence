import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { gameSettings } from './elements.js'
// import { getBackToHome , showModal, delay} from './services/tools.js';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const world = new CANNON.World();
const PLAYER_GEO = new THREE.BoxGeometry(1, .3, .1)
const BALL_GEO = new THREE.SphereGeometry(.1, 32, 15)

function socketSetup() {
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

export function startGame(gameOptions){
	const app = document.getElementById('app')
	app.className = 'game'
	app.innerHTML = ''
	setup_canva()
	sceneSetup(scene, camera, renderer,  gameOptions.background)
	return create_objects(scene, gameOptions.texture)
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
	let ball, plane
	let players = {player1, player2, player3, player4};

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
	players.player1 = new THREE.Mesh(PLAYER_GEO, new THREE.MeshLambertMaterial({ color: 0x8C96ED }))
	players.player1.position.set(1.5, .4, 2.45)


	//OTHERPLAYER
	players.player2 = new THREE.Mesh(PLAYER_GEO, new THREE.MeshLambertMaterial({ color: 0xE4E6FB }))
	players.player2.position.set(1.5, .4, -2.45)

	players.player3 = new THREE.Mesh(PLAYER_GEO, new THREE.MeshLambertMaterial({ color: 0xE4E6FB }))
	players.player3.position.set(-1.5, .4, -2.45)

	players.player4 = new THREE.Mesh(PLAYER_GEO, new THREE.MeshLambertMaterial({ color: 0xE4E6FB }))
	players.player4.position.set(-1.5, .4, 2.45)

	scene.add(plane);
	scene.add(players.player);
	scene.add(players.player2);
	scene.add(players.player3);
	scene.add(players.player4);
	scene.add(ball);
	return { ball, players, plane }
}

function create_bodies(){
	let player = create_player([0.5, .15, 0.05], [0, .25, 2.45])
	let otherPlayer = create_player([0.5, .15, 0.05], [0, .25, -2.45])

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

function create_player(dimension, position){
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

function update_position(gameObjects, gameBodies){
	gameObjects.player.position.copy(gameBodies.player.position);
	gameObjects.player.quaternion.copy(gameBodies.player.quaternion);

	gameObjects.otherPlayer.position.copy(gameBodies.otherPlayer.position);
	gameObjects.otherPlayer.quaternion.copy(gameBodies.otherPlayer.quaternion);

	gameObjects.ball.position.copy(gameBodies.ball.position);
	gameObjects.ball.quaternion.copy(gameBodies.ball.quaternion);
}

function update_coordinates(gameBodies, coordinates) {
	const { ball } = gameBodies;
	ball.position.x = coordinates.ball.position[0];
	ball.position.z = coordinates.ball.position[1];
	const { player, otherPlayer } = gameBodies;
	player.position.x = coordinates.player.position[0];
	player.position.z = coordinates.player.position[1];

	otherPlayer.position.x = coordinates.otherPlayer.position[0];
	otherPlayer.position.z = coordinates.otherPlayer.position[1];
}

function cleanupScene(scene, renderer, world) {
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

export function multi() {

	const timeStep = 1/60
	const gameSocket = socketSetup()

	let gameObjects, gameBodies,gameOptions, started = false

	world.gravity.set(0, -9.82, 0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;
	renderer.setAnimationLoop(animation);

	function animation() {
		world.step(timeStep);
		gameSocket.onmessage = (e) => {
			const { type, data } = JSON.parse(e.data)
			switch (type) {
				case 'api':
					started= false
					document.querySelector('.waiting-holder').style.display = 'none'
					update_coordinates(gameBodies, data.coordinates)
					update_position(gameObjects, gameBodies)
					update_canva(data)
					break;
				case 'gameInfo':
					gameSettings()
					let form = document.getElementById('game-settings')
					form.addEventListener('submit', (e) => {
						e.preventDefault()
						
						let data = new FormData(form);
						gameOptions = Object.fromEntries(data)

						gameSocket.send(JSON.stringify({
							'type': 'gameSettings',
							'data': gameOptions
						}))
						gameObjects = startGame(gameOptions)
						gameBodies = create_bodies()
						started = true
					})
					break;
				case 'startGame':
					gameObjects = startGame(data)
					gameBodies = create_bodies()
					started = true
					break;

				case 'endGame':
					showModal('U WON!')
					const modalBackground = document.getElementById('modal-background')
					cleanupScene(scene, renderer, world)
					modalBackground.addEventListener('click', async (event) => {
						await delay(3000)
						getBackToHome()
					})
					break;
				default:
					break;
			}
		}
	
		if (camera.position.z > 5 && started){
			camera.position.z -= 0.1
			camera.position.x += 0.01
			camera.position.y +=0.005
			camera.rotation.y +=0.002
		}
		else if (camera.position.z < 5 && started){
			if (document.querySelector('.waiting-pop'))
				document.querySelector('.waiting-pop').style.transform = 'scale(1)'
		}

		renderer.render(scene, camera);
	}


}