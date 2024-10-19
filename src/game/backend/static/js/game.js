import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import {   updateEndGame, gameSettings } from './elements.js';
import { gameView } from './services/gameView.js';


const PLAYER_GEO = new THREE.BoxGeometry(1, .3, .1)
const BALL_GEO = new THREE.SphereGeometry(.1, 32, 15)

function socketSetup(mode) {
	let url = `ws://${window.location.host}/ws/${mode}/`
	const gameSocket = new WebSocket(url)

	gameSocket.onopen = (e) => {
		console.log("CONECTION ESTABLISHED")
	}

	document.addEventListener('keydown', (event) => {
		gameSocket.send(JSON.stringify({
			'type': 'keycode',
			'data': event.keyCode
		}))
	});

	return gameSocket
}

export function sceneSetup(scene, camera, renderer, background) {
	camera.position.z = 20;
	camera.rotation.y = -Math.PI


	// RENDERER
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.getElementById('game-elements').appendChild(renderer.domElement)

	// HELPER
	const axesHelper = new THREE.AxesHelper( 5 );
	scene.add( axesHelper );

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
	console.log(gameElements.innerHTML)
	document.querySelector('.time').style.display = 'none'
	document.querySelector('.endGame-pop').style.transform = 'scale(0)'
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

function update_coordinates(gameObjects, coordinates, mode) {
	const { ball } = gameObjects;
	ball.position.fromArray(coordinates.ball.position);

	if (mode === 'game') {
		const { player, otherPlayer } = gameObjects;
		player.position.fromArray(coordinates.player.position);
		otherPlayer.position.fromArray(coordinates.otherPlayer.position);
	}
}

export function create_objects_vs(scene, texture) {
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

export function startGame(gameOptions){
	setup_canva()
	sceneSetup(scene, camera, renderer,  gameOptions.background)
	return create_objects_vs(scene, gameOptions.texture,)
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();

export function start(mode) {

	const gameSocket = socketSetup(mode)

	let gameObjects, gameOptions, started = false
	renderer.setAnimationLoop(animation);

	function animation() {
		gameSocket.onmessage = (e) => {
			const { type, data } = JSON.parse(e.data)
			switch (type) {
		        case "api":
					console.log('data = ', data)
					// document.getElementById('loader').style.display = 'none'
					started = false
		            update_coordinates(gameObjects, data.coordinates, mode)
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
							
							started = true
							const app = document.getElementById('app')
							app.className = 'game'
							app.innerHTML = ''
							gameObjects = startGame(gameOptions)
							
							
						})
						break;
						
					case 'startGame':
							started = true
							const app = document.getElementById('app')
							app.className = 'game'
							app.innerHTML = ''
							gameObjects = startGame(data)
							break;
							
					case "endGame":
						
						document.querySelector('.endGame-pop').style.transform = 'scale(1)'
						break;

		        default:
					break;
				}
				if (started)
					gameObjects.ball.rotation.x += 0.1
			}
			if (camera.position.z > 5 && started){
				camera.position.z -= 0.1
				camera.position.x += 0.01
				camera.position.y +=0.005
				camera.rotation.y +=0.002
			}
			else if (camera.position.z < 5 && started){
				document.querySelector('.waiting-pop').style.transform = 'scale(1)'
			}
			
		renderer.render(scene, camera);
	}


}