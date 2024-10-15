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
	document.body.appendChild(renderer.domElement)

	// document.gatEle.appendChild(renderer.domElement)

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
	let canva = document.getElementById("main");
	// canva.innerHTML = ''
	let scorePanel = score(0, 0)
	let timePanel = time(0)
	canva.append(scorePanel)
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
		// player.position.lerp(new THREE.Vector3(coordinates.player.position), 0.1);
		// player.position.lerp(...coordinates.player.position, 0.1);
		// otherPlayer.position.lerp(coordinates.otherPlayer.position, 0.1)
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

function create_objects_multi(scene) {

	//PLANE
	let plane = new THREE.Mesh(new THREE.BoxGeometry(5, .2, 5), new THREE.MeshLambertMaterial({ color: 0x005599 }))

	// 	BALL
	let ball = new THREE.Mesh(new THREE.SphereGeometry(.2, 32, 15), new THREE.MeshLambertMaterial({ color: 0xffffff }))

	// PLAYER
	let player1 = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0xff99ff }))

	let player2 = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0xffff88 }))

	let player3 = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0x22ffff }))

	let player4 = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0xff9900 }))


	scene.add(player1);
	scene.add(player2);
	scene.add(player3);
	scene.add(player4);
	scene.add(plane);
	scene.add(ball);
	return { ball, player1, player2, player3, player4, plane }
}

export function startGame(gameOptions){
	
	gameSetup(scene, camera, renderer,  gameOptions.background)
	let gameObjects
	// if (mode == 'game')
	return create_objects_vs(scene, gameOptions.texture,)

}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();

export function start(mode) {

	const gameSocket = socketSetup(mode)
	setup_canva()

	let gameObjects, gameOptions, started = false
	renderer.setAnimationLoop(animation);

	// document.getElementById('cancel').addEventListener('click', ()=>{
	// 	window.location.href = '/'
	// })
	function animation() {
		gameSocket.onmessage = (e) => {
		    const { type, data } = JSON.parse(e.data)
		    switch (type) {
		        // case "coordinates":
				// 	document.getElementById('loader').style.display = 'none'
				// 	document.getElementById('blurryScreen').style.transform = 'translate(-50%, -50%) scale(0)'
				// 	started = false
		        //     update_coordinates(gameObjects, data, mode)
		        //     updateScore(gameObjects, data, mode)
		        //     break;

		        // case "endGame":

		        //     updateEndGame(data)
		        //     break;

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
						started = true
						document.getElementById('main').innerHTML = ''

					})


					console.log("NEED TO SHOW GAME SETTINGS")
		            break;

				case 'startGame':
					console.log('NEED TO PLAY')
					document.getElementById('main').innerHTML = ''
						gameObjects = startGame(data)
						started = true
						break;

		        // case 'time':
		        //     timePanel.style.display = 'flex'
		        //     updateTime(data)
		        //     break;

		    //     case 'match_making':
		    //         update_match_making(data)
		    //     default:
			// 		break;
			// 	}
			// 	if (started)
			// 		gameObjects.ball.rotation.x += 0.1
			// }
			// if (camera.position.z > 5 && started){
			// 	camera.position.z -= 0.1
			// 	camera.position.x += 0.01
			// 	camera.position.y +=0.005
			// 	camera.rotation.y +=0.002
			// }
			// else if (camera.position.z < 5 && started){
			// 	document.getElementById('blurryScreen').style.transform = 'translate(-50%, -50%) scale(1)'
			// 	document.getElementById('loader').style.display = 'block'

			}
			
		renderer.render(scene, camera);
	}


}}