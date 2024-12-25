import { TEXTURE } from "../constants/components.js"
import Local from "../managers/localManagers.js"
import { modalService } from "../services/modalService.js"
import { reset } from "../utils/utils.js"
// import router from "../router/router.js"
import { gameSettingsView } from "./gameSettingsView.js"

export class gameView extends HTMLElement
{
	constructor()
	{
		super()

		let canva = document.getElementById("app");
		canva.className = 'game'
		canva.innerHTML = ''
		this.elements = document.createElement('div')
		this.elements.id = 'game-elements'
		canva.append(this.elements)


		this.waiting = document.createElement('div')
		this.waiting.className = 'waiting-holder'
		this.waiting.innerHTML = `
			<div class="waiting-pop glass">
				<h1>Waiting for other player...</h1>
				<div id="loader"></div>
				<button id="cancel-btn">Cancel</button>
			</div>
		`
		this.score = document.createElement('div')
		this.score.className = 'score'
		this.score.innerHTML = `
			<div class="user glass">
				<h3 id="user1">team1</h3>
			</div>
			<div class="score-num glass">
				<h1 id="score">0 : 0</h1>
			</div>
			<div class="user glass">
				<h3 id="user2">team2</h3>
			</div>
	`
	
	this.time = document.createElement('div')
	this.time.className = 'time glass'
	this.time.innerHTML = `<h1 id="time">00:00</h1>`
	
	this.endGame = document.createElement('div')
	this.endGame.className = 'endGame-pop glass'
	}
	async connectedCallback()
	{
		this.add('score')
	}
	disconnectedCallback()
	{
	}
	add(element){
		console.log(this)
		switch (element) {
			case 'waiting':
				this.appendChild(this.waiting)
				break;
			case 'score':
				this.appendChild(this.score)
				break;
			case 'time':
				this.appendChild(this.time)
				break;
			case 'endGame':
				this.endGame.innerHTML = `<h3>YOU <span id="status">You ${data}</span>!</h3>`
				this.appendChild(this.endGame)
				break;
			default:
				break;
		}
	}
}

customElements.define('game-view', gameView)

//global