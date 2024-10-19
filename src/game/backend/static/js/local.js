import {  create_objects_vs, sceneSetup } from './game.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { gameSettings } from './elements.js'

let WINNER = ''
let BALL_VELOCITY = {
    x: 0,
    y: 0.01,
    z: 0.01
}

const BALL_SPEED = 0.01
const PLAYER_SPEED = 0.05
const MAX_PLAYER_X = 1.5
const MIN_PLAYER_X = -1.5


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

function check_gravity(gameObjects) {
    const GRAVITY = 0.01
    const p1 = new THREE.Box3().setFromObject(gameObjects.player)
    const p2 = new THREE.Box3().setFromObject(gameObjects.otherPlayer)
    const ball = new THREE.Box3().setFromObject(gameObjects.ball)
    const plane = new THREE.Box3().setFromObject(gameObjects.plane)

    if (!p1.intersectsBox(plane)) {
        gameObjects.player.position.y -= GRAVITY
        gameObjects.otherPlayer.position.y -= GRAVITY
    }
    if (!ball.intersectsBox(plane))
        gameObjects.ball.position.y -= BALL_VELOCITY.y
}

function is_out_bound(gameObjects, score) {
    if (gameObjects.ball.position.z > 2.5) {
        BALL_VELOCITY.y = 0
        gameObjects.ball.position.set(0, 0.8, 0)
        score.p1 += 1
        return true
    }
    if ( gameObjects.ball.position.z < -2.5) {
        BALL_VELOCITY.y = 0
        gameObjects.ball.position.set(0, 0.8, 0)
        score.p2 += 1

        return true
    }
    return false
}

function check_collision(gameObjects) {
    const p1 = new THREE.Box3().setFromObject(gameObjects.player)
    const p2 = new THREE.Box3().setFromObject(gameObjects.otherPlayer)
    const ball = new THREE.Box3().setFromObject(gameObjects.ball)

    if (gameObjects.ball.position.x <= MIN_PLAYER_X || gameObjects.ball.position.x >= MAX_PLAYER_X)
        BALL_VELOCITY.x *= -1

    if (ball.intersectsBox(p1) || ball.intersectsBox(p2)) {
        let hitpoint = (gameObjects.ball.position.x - gameObjects.player.position.x)
        BALL_VELOCITY.x = hitpoint * 0.005
        BALL_VELOCITY.z *= -1
    }
    gameObjects.ball.position.z += BALL_VELOCITY.z
    gameObjects.ball.position.x += BALL_VELOCITY.x
}

function move_players(gameObjects) {
    const keyState = {}

    document.addEventListener('keydown', (event) => { keyState[event.code] = true })
    document.addEventListener('keyup', (event) => { keyState[event.code] = false })

    return function() {
        if (keyState['ArrowLeft'] && gameObjects.player.position.x > MIN_PLAYER_X)
            gameObjects.player.position.x -= PLAYER_SPEED
        if (keyState['ArrowRight'] && gameObjects.player.position.x < MAX_PLAYER_X)
            gameObjects.player.position.x += PLAYER_SPEED
        if (keyState['KeyA'] && gameObjects.otherPlayer.position.x > MIN_PLAYER_X)
            gameObjects.otherPlayer.position.x -= PLAYER_SPEED
        if (keyState['KeyD'] && gameObjects.otherPlayer.position.x < MAX_PLAYER_X)
            gameObjects.otherPlayer.position.x += PLAYER_SPEED
    }
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();


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

function startGame(gameOptions){
    setup_canva()
    sceneSetup(scene, camera, renderer, gameOptions.background)
    // return create_objects_vs(scene, gameOptions.texture)
    game(gameOptions)
}


function game(gameOptions) {

        let gameObjects = create_objects_vs(scene, gameOptions.texture)
        // const updatePlayerPositions = move_players(gameObjects)
        // const startTime  = new Date()
        // let score = {
        //     p1 : 0,
        //     p2 : 0
        // }
        
        // timePanel.style.display = 'flex'
        // let id;
        function animate() {
            // id = requestAnimationFrame(animate)
            // let now = new Date()
            // let elapsedTime = Math.round( (now - startTime) / 1000)
            
            // updateTime({elapsed : elapsedTime, endTime : 5})
            
            // if (elapsedTime  >= 10){
            //     scene.remove(gameObjects.ball)
            //     scene.remove(gameObjects.player)
            //     scene.remove(gameObjects.otherPlayer)
            //     scene.remove(gameObjects.plane)
            //     cancelAnimationFrame(id)
            //     resolve(score.p1 > score.p2 ? player1: player2)
                
            // }
            // updatePlayerPositions()
            // check_gravity(gameObjects)
            // if (!is_out_bound(gameObjects, score))
            //     check_collision(gameObjects)
            
            
            // BALL_VELOCITY.y += 0.0001
            
            renderer.render(scene, camera)
        }
        animate()
}