import {is_out_bound, move_players , check_plane_sides, setup_canva} from './local.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js'
import { gameSettings } from './elements.js'
import { create_objects, sceneSetup, create_bodies, update_position , cleanupScene} from './game.js'
import { getBackToHome , showModal, delay} from './services/tools.js';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const world = new CANNON.World();

let BALL_VELOCITY = {
	x: 0.01,
	z: 0.01
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

function game(player1, player2, gameOptions) {
	return new Promise((resolve, reject) => {
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
		let gameObjects = create_objects(scene, gameOptions.texture)
		let gameBodies = create_bodies(world)
		
		gameBodies.ball.addEventListener('collide', (event)=>{
			if (event.body !=  gameBodies.groundBody )
				BALL_VELOCITY.z *= -1
		})

		const updatePlayerPositions = move_players(gameBodies.player, gameBodies.otherPlayer)
		let Animate = true
		const startTime  = new Date()

		function animate() {
			if (!Animate) return

			let id = requestAnimationFrame(animate);
	
			world.step(timeStep);
			updatePlayerPositions()
	
			is_out_bound(gameBodies.ball, score)
			check_plane_sides(gameBodies.ball, BALL_VELOCITY)
		
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
			gameBodies.ball.position.z += BALL_VELOCITY.z
			gameBodies.ball.position.x += BALL_VELOCITY.x
			renderer.render(scene, camera);
		}
	
		animate()
	})
}