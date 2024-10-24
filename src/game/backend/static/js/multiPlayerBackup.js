import {  create_objects_vs, sceneSetup } from './game.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { gameSettings } from './elements.js'
import { getBackToHome , showModal, delay} from './services/tools.js';

let WINNER = ''
let BALL_VELOCITY = {
	x: 0.01,
	z: 0.01
}

const PLAYER_SPEED = 0.05
const MAX_PLAYER_X = 1.5
const MIN_PLAYER_X = -1.5


export function is_out_bound(ballBody, score) {
	if (ballBody.position.z > 2.5) {
		ballBody.position.set(0, 0.8, 0)
		score.p1 += 1
		document.getElementById('score').innerHTML = `${score.p1}  :  ${score.p2}`
		return true
	}
	if ( ballBody.position.z < -2.5) {
		ballBody.position.set(0, 0.8, 0)
		score.p2 += 1
		document.getElementById('score').innerHTML = `${score.p1}  :  ${score.p2}`

		return true
	}
	return false
}

export function move_players(player, otherPlayer) {
	const keyState = {}

	document.addEventListener('keydown', (event) => { keyState[event.code] = true })
	document.addEventListener('keyup', (event) => { keyState[event.code] = false })

	return function() {
		if (keyState['ArrowLeft'] && player.position.x > MIN_PLAYER_X)
			player.position.x -= PLAYER_SPEED
		if (keyState['ArrowRight'] && player.position.x < MAX_PLAYER_X)
			player.position.x += PLAYER_SPEED
		if (keyState['KeyA'] && otherPlayer.position.x > MIN_PLAYER_X)
			otherPlayer.position.x -= PLAYER_SPEED
		if (keyState['KeyD'] && otherPlayer.position.x < MAX_PLAYER_X)
			otherPlayer.position.x += PLAYER_SPEED
	}
}

export function check_plane_sides(ballBody){

	if (ballBody.position.x >= 1.5){
		BALL_VELOCITY.x*= -1
	}
	else if (ballBody.position.x <= -1.5)
		BALL_VELOCITY.x *= -1
}

export function local() {
	gameSettings()
	let gameOptions
	let form = document.getElementById('game-settings')
	form.addEventListener('submit', (e) => {
		e.preventDefault()
		
		let data = new FormData(form);
		gameOptions = Object.fromEntries(data)
		const app = document.getElementById('app')
		app.className = 'game'
		app.innerHTML = ''
		startGame(gameOptions)
		
		
	})

}


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const world = new CANNON.World();



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
		<div class="time glass">
			<h1 id="time">00:05</h1>
		</div>
		<div class="endGame-pop glass">
			<h3>YOU <span id="status">WON</span>!</h3>
		</div>
	`
	canva.append(gameElements)
	document.querySelector('.endGame-pop').style.transform = 'scale(0)'
}

export function create_player(dimension, position){
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

export function create_bodies(){
	let player = create_player([0.5, .15, 0.05], [0, .25, 2.45])

	// OTHERPLAYER BODY
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
	

	ball.addEventListener('collide', (event)=>{
		if (event.body !=  groundBody )
			BALL_VELOCITY.z *= -1
	})

	return {player, otherPlayer, ball}
}

export function update_position(gameObjects, gameBodies){
	gameObjects.player.position.copy(gameBodies.player.position);
	gameObjects.player.quaternion.copy(gameBodies.player.quaternion);

	gameObjects.otherPlayer.position.copy(gameBodies.otherPlayer.position);
	gameObjects.otherPlayer.quaternion.copy(gameBodies.otherPlayer.quaternion);

	gameObjects.ball.position.copy(gameBodies.ball.position);
	gameObjects.ball.quaternion.copy(gameBodies.ball.quaternion);


	gameBodies.ball.position.z += BALL_VELOCITY.z
	gameBodies.ball.position.x += BALL_VELOCITY.x
}

export function game_over(){
	showModal('GAME OVER')
	const modalBackground = document.getElementById('modal-background')
	modalBackground.addEventListener('click', async () => {
		await delay(3000)
		getBackToHome()
	})
}

function startGame(gameOptions) {
	const timeStep = 1/60
	world.gravity.set(0, -9.82, 0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;
	let score = {
		p1 : 0,
		p2 : 0
	}
	const startTime  = new Date()
	setup_canva()
	sceneSetup(scene, camera, renderer, gameOptions.background)
	let gameObjects = create_objects_vs(scene, gameOptions.texture)
	let gameBodies = create_bodies()

	const updatePlayerPositions = move_players(gameBodies.player, gameBodies.otherPlayer)
	let Animate = true


	function animate() {
		if (!Animate) return

		let id = requestAnimationFrame(animate);

		world.step(timeStep);
		updatePlayerPositions()

		is_out_bound(gameBodies.ball, score)
		check_plane_sides(gameBodies.ball)
	
		if (Animate && gameOptions.mode == 'time'){
			let now  = new Date()
			let elapsed  = Math.round( (now - startTime) / 1000)

			if(elapsed >= gameOptions.range && score.p1 != score.p2){
				Animate = false
				cancelAnimationFrame(id)
				game_over()
			}
			if (document.getElementById('time'))
				document.getElementById('time').innerHTML = elapsed
		}
		else if (Animate && (score.p1 == gameOptions.range || score.p2 == gameOptions.range)){
				cancelAnimationFrame(id)
				Animate = false
				game_over()
		}
		update_position(gameObjects, gameBodies)

		renderer.render(scene, camera);
	}
	
	animate();
	
}