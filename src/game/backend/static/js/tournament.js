import {  create_objects_vs, sceneSetup } from './game2.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js'
import { gameSettings } from './elements.js'
// import { showModal } from './services/tools.js'
import { getBackToHome , showModal, delay} from './services/tools.js';


let BALL_VELOCITY = {
	x: 0.01,
	z: 0.01
}

const PLAYER_SPEED = 0.05
const MAX_PLAYER_X = 1.5
const MIN_PLAYER_X = -1.5

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

function is_out_bound(ballBody, score) {
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

function move_players(player, otherPlayer) {
	const keyState = {}

	document.addEventListener('keydown', (event) => { keyState[event.code] = true })
	document.addEventListener('keyup', (event) => { keyState[event.code] = false })

	return function() {
		if (keyState['ArrowLeft'] && player.position.x > MIN_PLAYER_X + .5)
			player.position.x -= PLAYER_SPEED
		if (keyState['ArrowRight'] && player.position.x < MAX_PLAYER_X - .5)
			player.position.x += PLAYER_SPEED
		if (keyState['KeyA'] && otherPlayer.position.x > MIN_PLAYER_X + .5)
			otherPlayer.position.x -= PLAYER_SPEED
		if (keyState['KeyD'] && otherPlayer.position.x < MAX_PLAYER_X - .5)
			otherPlayer.position.x += PLAYER_SPEED
	}
}

function check_plane_sides(ballBody){

	if (ballBody.position.x >= 1.5){
		BALL_VELOCITY.x*= -1
	}
	else if (ballBody.position.x <= -1.5)
		BALL_VELOCITY.x *= -1
}

export function setup_canva(player1, player2) {
	let canva = document.getElementById("app");

	let gameElements = document.createElement('div')
	gameElements.id = 'game-elements'

	gameElements.innerHTML = `
		<div class="score">
			<div class="user glass">
				<h3 id="user1">${player1}</h3>
			</div>
			<div class="score-num glass">
				<h1 id="score">0 : 0</h1>
			</div>
			<div class="user glass">
				<h3 id="user2">${player2}</h3>
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

function create_player(dimension, position, world){
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

function create_bodies(world){
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
	

	ball.addEventListener('collide', (event)=>{
		if (event.body !=  groundBody )
			BALL_VELOCITY.z *= -1
	})

	return {player, otherPlayer, ball}
}

function update_position(gameObjects, gameBodies){
	gameObjects.player.position.copy(gameBodies.player.position);
	gameObjects.player.quaternion.copy(gameBodies.player.quaternion);

	gameObjects.otherPlayer.position.copy(gameBodies.otherPlayer.position);
	gameObjects.otherPlayer.quaternion.copy(gameBodies.otherPlayer.quaternion);

	gameObjects.ball.position.copy(gameBodies.ball.position);
	gameObjects.ball.quaternion.copy(gameBodies.ball.quaternion);


	gameBodies.ball.position.z += BALL_VELOCITY.z
	gameBodies.ball.position.x += BALL_VELOCITY.x
}

async function startGame(gameOptions, players){
	let firstWinner, secondWinner, winner

	// FIRST ROUND
	showModal(`This round ${players[0]} VS ${players[1]}`)
	let modalBackground = document.getElementById('modal-background')
	modalBackground.addEventListener('click', async () => {
		await delay(2000)
		document.getElementById('app').innerHTML = ''
		firstWinner = await game(players[0], players[1], gameOptions)
	
	// SECOND ROUND
		showModal(`This round ${players[2]} VS ${players[3]}`)
		modalBackground = document.getElementById('modal-background')
		modalBackground.addEventListener('click', async () => {
			await delay(2000)
			document.getElementById('app').innerHTML = ''
			secondWinner = await game(players[2], players[3], gameOptions)
	
	// LAST ROUND
			showModal(`This round ${firstWinner} VS ${secondWinner}`)
			modalBackground = document.getElementById('modal-background')
			modalBackground.addEventListener('click', async () => {
				await delay(2000)
				document.getElementById('app').innerHTML = ''
				winner = await game(firstWinner, secondWinner, gameOptions)
	// WINNER
				showModal(`winner is ${winner}`)
				modalBackground = document.getElementById('modal-background')
				modalBackground.addEventListener('click', async () => {
					await delay(2000)
					getBackToHome()

	
				})

			})
		})
	})

}

export async function tourn() {
	const players = await showModal('', 'alias')
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
		startGame(gameOptions, players)
	})
}


function game(player1, player2, gameOptions) {
	return new Promise((resolve, reject) => {
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer();
		const scene = new THREE.Scene();

		const world = new CANNON.World();
		const timeStep = 1/60
		world.gravity.set(0, -9.82, 0);
		world.broadphase = new CANNON.NaiveBroadphase();
		world.solver.iterations = 10;

		let score = {
			p1 : 0,
			p2 : 0
		}
		setup_canva(player1, player2)
		sceneSetup(scene, camera, renderer, gameOptions.background)
		let gameObjects = create_objects_vs(scene, gameOptions.texture)
		let gameBodies = create_bodies(world)
		
		const updatePlayerPositions = move_players(gameBodies.player, gameBodies.otherPlayer)
		let Animate = true
		const startTime  = new Date()

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
					document.getElementById('app').innerHTML = ''
					cleanupScene(scene, renderer, world)

					resolve(score.p1 > score.p2 ? player1: player2)

				}
				if (document.getElementById('time'))
					document.getElementById('time').innerHTML = elapsed
			}
			else if (Animate && (score.p1 == gameOptions.range || score.p2 == gameOptions.range)){
				cancelAnimationFrame(id)
				Animate = false
				cleanupScene(scene, renderer, world)
				resolve(score.p1 > score.p2 ? player1: player2)

			}
			update_position(gameObjects, gameBodies)
	
			renderer.render(scene, camera);
		}
	
		animate()
	})
}