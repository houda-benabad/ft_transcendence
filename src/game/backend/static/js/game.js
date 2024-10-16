import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import {  match_making, update_match_making, score, updateScore, time, updateTime, updateEndGame, gameSettings } from './elements.js';
import { gameView } from './services/gameView.js';


const PLAYER_GEO = new THREE.BoxGeometry(1, .3, .3)
const BALL_GEO = new THREE.SphereGeometry(.2, 32, 15)

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

export function gameSetup(scene, camera, renderer, background) {
	camera.position.z = 20;
	camera.rotation.y = -Math.PI


	// RENDERER
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.getElementById('app').appendChild(renderer.domElement)

	// HELPER
	const axesHelper = new THREE.AxesHelper(5);

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

	let loader = document.createElement('div')
	loader.id = 'loader'

	let blurryScreen = document.createElement('div')
	blurryScreen.id= 'blurryScreen'
	blurryScreen.className = 'glass'
	blurryScreen.innerHTML = ` 
            <h1>Waiting for others...</h1> 
            <button id="cancel">Cancel</button> 
	`
	let scorePanel = score(0, 0)
	let timePanel = time(0)
	canva.append(scorePanel)
	canva.append(loader)
	canva.append(blurryScreen)
	canva.append(timePanel)
	timePanel.style.display = 'none'
	scorePanel.style.display = 'none'
}

function update_coordinates(gameObjects, coordinates, mode) {
	const { ball } = gameObjects;
	ball.position.fromArray(coordinates.ball.position);

	if (mode === 'game') {
		const { player, otherPlayer } = gameObjects;
		player.position.fromArray(coordinates.player.position);
		otherPlayer.position.fromArray(coordinates.otherPlayer.position);
	} else if (mode === 'multi') {
		document.getElementById("match_popup").style.display = 'none'
		const { player1, player2, player3, player4 } = gameObjects;
		player1.position.lerp(coordinates.player1.position, 0.1);
		player2.position.lerp(coordinates.player2.position, 0.1);
		player3.position.lerp(coordinates.player3.position, 0.1);
		player4.position.lerp(coordinates.player4.position, 0.1);
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
	player.position.set(0, .4, 2.35)


	//OTHERPLAYER
	otherPlayer = new THREE.Mesh(PLAYER_GEO, new THREE.MeshLambertMaterial({ color: 0xE4E6FB }))
	otherPlayer.position.set(0, .4, -2.35)

	scene.add(plane);
	scene.add(player);
	scene.add(otherPlayer);
	scene.add(ball);
	return { ball, player, otherPlayer, plane }
}

export function startGame(gameOptions){
	console.log('STATING')
	setup_canva()
	gameSetup(scene, camera, renderer,  gameOptions.background)
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
		        case "coordinates":
					document.getElementById('loader').style.display = 'none'
					document.getElementById('blurryScreen').style.transform = 'translate(-50%, -50%) scale(0)'
					started = false
		            update_coordinates(gameObjects, data, mode)
		            updateScore(gameObjects, data, mode)
		            break;

					
					case 'gameInfo':
						gameSettings()
						console.log('HOST')
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
							console.log('INVITED')
							started = true
							const app = document.getElementById('app')
							app.className = 'game'
							app.innerHTML = ''
							gameObjects = startGame(data)
							break;
							
				// case "endGame":

				//     updateEndGame(data)
				//     break;
			
		        // case 'time':
		        //     timePanel.style.display = 'flex'
		        //     updateTime(data)
		        //     break;

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
				document.getElementById('blurryScreen').style.transform = 'translate(-50%, -50%) scale(1)'
				document.getElementById('loader').style.display = 'block'

			}
			
		renderer.render(scene, camera);
	}


}