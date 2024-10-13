import { gameSetup, create_objects_vs, setup_canva } from './game.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import { score, time, updateScore, updateTime } from './element.js'
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

export function create_form() {
    let form = document.createElement('form')
    form.setAttribute('id', 'tournam-regist')

    form.innerHTML = `
        <div class="player-set">
            <input name="player1" class="player-name" required>
            <p>VS</p>
            <input name="player2" class="player-name" required>
        </div>
        <div class="player-set">
            <input name="player3" class="player-name" required>
            <p>VS</p>
            <input name="player4" class="player-name" required>
        </div>
        <button id="start" type="submit">Start</button>
    `
    document.getElementById('canva').appendChild(form)
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        let data = new FormData(form);
        let gameOptions = Object.fromEntries(data)
        form.remove()
        start(gameOptions)
    })
}

async function start(gameOptions) {
    let players = Object.values(gameOptions)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();

    gameSetup(scene, camera, renderer)
    setup_canva()

    let firstWinner, secondWinner, winner
    game(players[0], players[1], scene, renderer, camera)
        .then(value => {firstWinner = value; return game(players[2], players[3], scene, renderer, camera)})
        .then(value => {secondWinner = value; return game(firstWinner, secondWinner, scene, renderer, camera)})
        .then(value => {console.log(value)})
    // console.log("first = ", firstWinner)
    // let secondWinner = game(players[2], players[3], scene, renderer, camera)
    // let Winner = game(firstWinner, secondWinner, scene, renderer, camera)
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

export function updateTime(data) {
    let circularProgress = document.querySelector(".circular-progress"),
        progressValue = document.querySelector(".progress-value");
    let progressStartValue = data.elapsed,
        progressEndValue = data.endTime
    let progressPercentage = (progressStartValue / progressEndValue) * 100;
    progressValue.textContent = `${progressStartValue} s`;
    if (progressStartValue > progressEndValue)
        circularProgress.style.background = `conic-gradient(red ${progressPercentage * 3.6}deg, black 0deg)`;
    else
        circularProgress.style.background = `conic-gradient(#7d2ae8 ${progressPercentage * 3.6}deg, black 0deg)`;

}


function game(player1, player2, scene, renderer, camera) {
    return new Promise((resolve, reject) => {

        let gameObjects = create_objects_vs(scene)
        const updatePlayerPositions = move_players(gameObjects)
        const startTime  = new Date()
        let score = {
            p1 : 0,
            p2 : 0
        }
        
        // renderer.setAnimationLoop( animate );
        timePanel.style.display = 'flex'
        let id;
        function animate() {
            id = requestAnimationFrame(animate)
            let now = new Date()
            let elapsedTime = Math.round( (now - startTime) / 1000)
            
            updateTime({elapsed : elapsedTime, endTime : 5})
            
            if (elapsedTime  >= 10){
                scene.remove(gameObjects.ball)
                scene.remove(gameObjects.player)
                scene.remove(gameObjects.otherPlayer)
                scene.remove(gameObjects.plane)
                cancelAnimationFrame(id)
                resolve(score.p1 > score.p2 ? player1: player2)
                
            }
            updatePlayerPositions()
            check_gravity(gameObjects)
            if (!is_out_bound(gameObjects, score))
                check_collision(gameObjects)
            
            
            BALL_VELOCITY.y += 0.0001
            
            renderer.render(scene, camera)
        }
        animate()
    })
}